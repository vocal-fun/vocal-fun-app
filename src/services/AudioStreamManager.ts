import { Sound } from '~/consts';

export class AudioStreamPlayer {
  private audioContext: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private audioQueue: AudioBuffer[] = [];
  private isPlaying: boolean = false;
  private onStartCallback: (() => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    // Initialize AudioContext with correct sample rate
    this.initializeAudioContext();
    this.setCallbacks(() => {
      console.log('[AUDIO STREAM] Started playing audio response');
    }, () => {
      console.log('[AUDIO STREAM] Finished playing audio response');
    });
  }

  private initializeAudioContext(): void {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass({ sampleRate: Sound.SampleRate });
      } else {
        console.error('Web Audio API is not supported in this browser');
      }
    }
  }

  public setCallbacks(onStart: () => void, onEnd: () => void): void {
    this.onStartCallback = onStart;
    this.onEndCallback = onEnd;
  }

  public async addChunk(base64Audio: string): Promise<void> {
    if (!this.audioContext) {
      this.initializeAudioContext();
      if (!this.audioContext) {
        console.error('AudioContext could not be initialized');
        return;
      }
    }

    try {
      // Decode base64 to binary
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert to Float32Array (server sends pcm_f32le)
      const floatData = new Float32Array(bytes.buffer);

      // Create audio buffer
      const audioBuffer = this.audioContext.createBuffer(
        1, // mono
        floatData.length,
        this.audioContext.sampleRate
      );

      // Copy the PCM data to the audio buffer
      audioBuffer.copyToChannel(floatData, 0);

      // Add to queue
      this.audioQueue.push(audioBuffer);

      // Start playing if not already playing
      if (!this.isPlaying) {
        await this.playNextChunk();
      }
    } catch (error) {
      console.error('Error processing audio chunk:', error);
    }
  }

  private async playNextChunk(): Promise<void> {
    if (!this.audioContext || this.audioQueue.length === 0 || this.isPlaying) {
      return;
    }

    const audioBuffer = this.audioQueue.shift();
    if (!audioBuffer) return;

    this.isPlaying = true;
    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = audioBuffer;
    this.sourceNode.connect(this.audioContext.destination);

    // Handle the end of this chunk
    this.sourceNode.onended = () => {
      this.isPlaying = false;
      if (this.sourceNode) {
        this.sourceNode.disconnect();
        this.sourceNode = null;
      }

      // Play next chunk if available
      if (this.audioQueue.length > 0) {
        this.playNextChunk();
      } else if (this.onEndCallback) {
        this.onEndCallback();
      }
    };

    // Call start callback if this is the first chunk
    if (this.onStartCallback && this.audioQueue.length === 0) {
      this.onStartCallback();
    }

    try {
      this.sourceNode.start(0);
    } catch (error) {
      console.error('Error starting audio playback:', error);
      this.isPlaying = false;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    }
  }

  public async stop(): Promise<void> {
    try {
      if (this.sourceNode) {
        this.sourceNode.stop();
        this.sourceNode.disconnect();
        this.sourceNode = null;
      }
      this.audioQueue = [];
      this.isPlaying = false;

      if (this.audioContext?.state === 'running') {
        await this.audioContext.suspend();
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }

  public async resume(): Promise<void> {
    try {
      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
      }
    } catch (error) {
      console.error('Error resuming audio context:', error);
    }
  }

  public async cleanup(): Promise<void> {
    try {
      await this.stop();
      if (this.audioContext) {
        await this.audioContext.close();
        this.audioContext = null;
      }
    } catch (error) {
      console.error('Error cleaning up audio player:', error);
    }
  }
}