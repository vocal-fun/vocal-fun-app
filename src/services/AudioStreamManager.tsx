export class AudioStreamPlayer {
    private audioContext: AudioContext | null = null;
    private sourceNode: AudioBufferSourceNode | null = null;
    private audioQueue: AudioBuffer[] = [];
    private isPlaying: boolean = false;
    private onStartCallback: (() => void) | null = null;
    private onEndCallback: (() => void) | null = null;
  
    constructor() {
      // Initialize AudioContext only when first needed
      this.initializeAudioContext();
    }
  
    private initializeAudioContext() {
      if (typeof window !== 'undefined') {
        // Get the correct AudioContext definition
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioContext = new AudioContextClass();
        } else {
          console.error('Web Audio API is not supported in this browser');
        }
      }
    }
  
    public setCallbacks(onStart: () => void, onEnd: () => void) {
      this.onStartCallback = onStart;
      this.onEndCallback = onEnd;
    }
  
    public async addChunk(base64Audio: string) {
      if (!this.audioContext) {
        this.initializeAudioContext();
        if (!this.audioContext) {
          console.error('AudioContext could not be initialized');
          return;
        }
      }
  
      try {
        const audioData = atob(base64Audio);
        const arrayBuffer = new ArrayBuffer(audioData.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < audioData.length; i++) {
          view[i] = audioData.charCodeAt(i);
        }
  
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.audioQueue.push(audioBuffer);
  
        if (!this.isPlaying) {
          this.playNextChunk();
        }
      } catch (error) {
        console.error('Error processing audio chunk:', error);
      }
    }
  
    private async playNextChunk() {
      if (!this.audioContext || this.audioQueue.length === 0 || this.isPlaying) {
        return;
      }
  
      const audioBuffer = this.audioQueue.shift();
      if (!audioBuffer) return;
  
      this.isPlaying = true;
      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = audioBuffer;
      this.sourceNode.connect(this.audioContext.destination);
  
      this.sourceNode.onended = () => {
        this.isPlaying = false;
        if (this.audioQueue.length > 0) {
          this.playNextChunk();
        } else if (this.onEndCallback) {
          this.onEndCallback();
        }
      };
  
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
  
    public async stop() {
      try {
        if (this.sourceNode) {
          this.sourceNode.stop();
          this.sourceNode.disconnect();
          this.sourceNode = null;
        }
        this.audioQueue = [];
        this.isPlaying = false;
        
        // Suspend the audio context to save resources
        if (this.audioContext?.state === 'running') {
          await this.audioContext.suspend();
        }
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
    }
  
    public async resume() {
      try {
        if (this.audioContext?.state === 'suspended') {
          await this.audioContext.resume();
        }
      } catch (error) {
        console.error('Error resuming audio context:', error);
      }
    }
  
    public async cleanup() {
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