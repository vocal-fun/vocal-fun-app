import io, { Socket } from 'socket.io-client';
import { usePermission } from '@vueuse/core';
import { AudioStreamPlayer } from '~/services/AudioStreamManager';

export function useCallApi() {
  const audioPlayer = new AudioStreamPlayer();

  const authStore = useAuthStore();
  const loading = ref(false);
  const hasCallError = ref<boolean>(false);
  const token = computed(() => authStore.token);
  const sessionId = ref('');
  const ws = ref<Socket | null>(null);
  const activeAgentId = ref('');
  const isConnected = computed(() => ws.value?.connected);
  const micPermission = usePermission('microphone');
  const isMicAllowed = computed(() => micPermission.value === 'granted');
  const hasError = computed(() => !isMicAllowed || hasCallError.value);

  const isRecording = ref(false);
  const mediaStream = ref<MediaStream | null>(null);
  const audioProcessor = ref<ScriptProcessorNode | null>(null);
  const audioContextObj = ref<AudioContext | null>(null);

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

  const initCallSession = async (agentId: string) => {
    if (activeAgentId.value === agentId && isConnected.value) {
      return;
    }
    loading.value = true;
    await getCallSession(agentId);
    if (!sessionId.value || !token.value) {
      loading.value = false;
      return;
    }
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
    });
    ws.value.on('disconnect', () => {
      stopRecording();
      console.log('[CALL API] Disconnected from server');
      audioPlayer?.cleanup();
    });
    ws.value.on('audio_stream', handleTTSStream);
    ws.value.on('audio_stream_end', () => {
      console.log('[CALL API] Audio stream ended');
    });
    ws.value.on('ai_disconnected', () => {
      console.log('[CALL API] AI server disconnected');
    });
    ws.value.on('error', (error: Error) => {
      console.warn('[CALL API] Error: ' + error?.message);
      hasCallError.value = true;
    });
    activeAgentId.value = agentId;
    loading.value = false;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,   // mono
          sampleRate: 16000, // 16 kHz
          sampleSize: 16,    // 16-bit
        },
      });
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

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
    if (data.type === 'audio_chunk' && data.chunk) {
      try {
        await audioPlayer.addChunk(data.chunk);
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

  return {
    isRecording,
    loading,
    isConnected,
    hasCallError,
    hasError,
    getCallSession,
    initCallSession,
    closeCallSession,
    startRecording,
    stopRecording,
  };
}
