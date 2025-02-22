import io, { Socket } from 'socket.io-client';
import { usePermission } from '@vueuse/core';
import { AudioStreamPlayer } from '~/services/AudioStreamManager';
import { getVideo } from '~/services/ffmpeg';
import { Sound } from '~/consts';
import type { Agent } from '~/types';

export function useCallApi() {
  const audioPlayer = new AudioStreamPlayer();
  audioPlayer.setCallbacks(() => {
    pauseRecording();
  }, () => {
    resumeRecording();
  });

  const authStore = useAuthStore();
  const hasCallError = ref<boolean>(false);
  const token = computed(() => authStore.token);
  const sessionId = ref('');
  const ws = ref<Socket | null>(null);
  const activeAgentId = ref('');
  const isConnected = computed(() => ws.value?.connected);
  const micPermission = usePermission('microphone');
  const isMicAllowed = computed(() => micPermission.value === 'granted');
  const hasError = computed(() => !isMicAllowed || hasCallError.value);
  const isDownloadDisabled = computed(() => isDownloading.value || audioChunks.value.length === 0);

  const isRecording = ref(false);
  const isDownloading = ref(false);
  const mediaStream = ref<MediaStream | null>(null);
  const audioProcessor = ref<ScriptProcessorNode | null>(null);
  const audioContextObj = ref<AudioContext | null>(null);
  const audioChunks = ref<Float32Array>(new Float32Array(0));

  const getCallSession = async (agentId: string) => {
    try {
      const res = await $fetch<{ session: any, sessionId: string }>(`/api/v1/call/start?agentId=${agentId}`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token.value,
        },
      });
      sessionId.value = res.sessionId;
    } catch(error) {
      console.warn(error);
    }
  };

  const initCallSession = async (agentId: string): Promise<void> => {
    if (activeAgentId.value === agentId && isConnected.value) {
      return;
    }
    await getCallSession(agentId);
    if (!sessionId.value || !token.value) {
      return;
    }
    audioChunks.value = new Float32Array(0);
    return new Promise((resolve, reject) => {
      try {
        ws.value = io('https://api.vocal.fun/call', {
          auth: {
            token: token.value,
            sessionId: sessionId.value,
          },
        });
        ws.value.on('connect', () => {
          console.log('[CALL API] Connected to server');
        });
        ws.value.on('call_ready', () => {
          console.log('[CALL API] Call ready - you can start speaking');
          resolve();
        });
        ws.value.on('disconnect', () => {
          stopRecording();
          console.log('[CALL API] Disconnected from server');
          audioPlayer?.cleanup();
          reject(new Error('Disconnected from server'));
        });
        ws.value.on('audio_stream', handleTTSStream);
        ws.value.on('audio_stream_end', () => {
          console.log('[CALL API] Audio stream ended');
        });
        ws.value.on('ai_disconnected', () => {
          console.log('[CALL API] AI server disconnected');
          hasCallError.value = true;
          reject(new Error('AI server disconnected'));
        });
        ws.value.on('error', (error: Error) => {
          console.warn('[CALL API] Error: ' + error?.message);
          hasCallError.value = true;
          reject(error);
        });
        activeAgentId.value = agentId;
      } catch (error) {
        hasCallError.value = true;
        console.warn('[CALL API] Error connecting to server:', error);
        reject(error);
      }
    });
  };

  const base64ToFloat32Array = (base64: string): Float32Array => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Float32Array(bytes.buffer);
  }

  const startRecording = async () => {
    audioChunks.value = new Float32Array(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: Sound.Channels, // mono
          sampleRate: Sound.SampleRate, // 24 kHz
          sampleSize: Sound.SampleSize, // 32-bit
        },
      });
      const audioContext = new AudioContext({ sampleRate: Sound.SampleRate });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, Sound.Channels, Sound.Channels);

      source.connect(processor);
      processor.connect(audioContext.destination);
      processor.onaudioprocess = (e) => {
        if (ws.value?.connected) {
          const audioData = e.inputBuffer.getChannelData(0);
          // Convert Float32Array to Int16Array
          const int16Data = new Int16Array(audioData.length);
          for (let i = 0; i < audioData.length; i++) {
            const s = Math.max(-1, Math.min(1, audioData[i]));
            int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }
          audioChunks.value = new Float32Array([...audioChunks.value, ...audioData]);
          ws.value.emit('audio_data', int16Data.buffer);
        }
      };

      isRecording.value = true;
      console.log('[CALL API] Recording started');

      mediaStream.value = stream;
      audioProcessor.value = processor;
      audioContextObj.value = audioContext;
    } catch (error) {
      hasCallError.value = true;
      console.warn('[CALL API] Error starting recording:', error);
    }
  };

  const pauseRecording = () => {
    if (!isRecording.value) {
      return;
    }
    audioProcessor.value?.disconnect();
    console.log('[CALL API] Recording paused');
  };

  const resumeRecording = () => {
    if (!audioContextObj.value) {
      return;
    }
    audioProcessor.value?.connect(audioContextObj.value?.destination);
    console.log('[CALL API] Recording resumed');
  }

  const stopRecording = () => {
    if (!isRecording.value) {
      return;
    }
    // Cleanup audio context
    audioProcessor.value?.disconnect();
    audioProcessor.value = null;
    mediaStream.value?.getTracks().forEach(track => track.stop());
    mediaStream.value = null;
    audioContextObj.value?.close();
    audioContextObj.value = null;
    isRecording.value = false;
    console.log('[CALL API] Recording stopped');
  };

  const handleTTSStream = async (data: { type: string; chunk?: string }) => {
    const chunk = data.chunk;
    if (data.type === 'audio_chunk' && chunk) {
      try {
        await audioPlayer.addChunk(chunk);
        audioChunks.value = new Float32Array([...audioChunks.value, ...base64ToFloat32Array(chunk)]);
      } catch (error) {
        console.warn('[CALL API] Error processing audio chunk:', error);
      }
    }
  };

  const closeCallSession = () => {
    stopRecording();
    ws.value?.disconnect();
    sessionId.value = '';
    activeAgentId.value = '';
  }

  const downloadMp4 = async (agentImg: string): Promise<Blob | null> => {
    if (isDownloadDisabled.value) {
      return null;
    }
    try {
      isDownloading.value = true;
      const blob = await getVideo(audioChunks.value, agentImg);
      return blob;
    } catch (error) {
      console.warn('[DOWNLOAD ERROR]:', error);
      return null;
    } finally {
      isDownloading.value = false;
    }
  };

  return {
    isRecording,
    isConnected,
    hasCallError,
    hasError,
    isDownloadDisabled,
    isDownloading,
    getCallSession,
    initCallSession,
    closeCallSession,
    startRecording,
    stopRecording,
    downloadMp4,
  };
}
