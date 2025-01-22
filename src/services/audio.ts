import { Howl } from 'howler';

interface AudioCache {
  audio: Howl;
  loop: boolean;
  volume: number;
  fadein?: number;
  fadeout?: number;
}

/**
 * Audio service for playing sound effects and background music
 * @see https://howlerjs.com/
 * @see https://webaudioapi.com/samples/
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
 */
class AudioService {
  private readonly backgroundUrl = '/audio/background.mp3';
  private readonly clickUrl = '/audio/click.mp3';
  public readonly callingUrl = '/audio/calling.mp3';

  private audioCache: Record<string, AudioCache> = {};
  public wasBgMusicInterrupted = false;
  public isBgMusicPlaying = false;

  /**
   * Load audio into cache or update audio settings
   * @param url Audio URL
   * @param loop Loop audio
   * @param volume Audio volume; 0.0 to 1.0; default 1.0
   * @param fadein Fade in duration in ms
   * @param fadeout Fade out duration in ms
   */
  load(url: string, loop: boolean = false, volume: number = 1, fadein?: number, fadeout?: number): void {
    if (this.audioCache[url]) {
      return; // If already cached, skip loading
    }
    this.audioCache[url] = {
      audio: new Howl({
        src: [url],
        loop,
        volume,
        autoplay: false,
      }),
      loop,
      volume,
      fadein,
      fadeout,
    };
  }

  /**
   * Play audio from cache
   * @param url Audio URL
   */
  play(url: string): Howl | null {
    const item = this.audioCache[url];
    if (!item) {
      console.warn(`[VOCAL.FUN] [AUDIO] Audio not found in cache: ${url}`);
      return null;
    }
    const { audio, volume } = item;
    if (url !== this.backgroundUrl) {
      audio.seek(0); // Reset the audio to start
    }
    audio.volume(volume);
    audio.play();
    return audio;
  }

  /**
   * Pause audio from cache
   * @param url Audio URL
   */
  pause(url: string): void {
    const item = this.audioCache[url];
    if (!item) {
      console.warn(`[VOCAL.FUN] [AUDIO] Audio not found in cache: ${url}`);
      return;
    }
    item.audio.pause();
  }

  /**
   * Fade in audio from cache
   * @param url Audio URL
   * @param duration Fade in duration in ms; if not set - use fade duration from cache
   */
  fadein(url: string, duration?: number): void {
    const item = this.audioCache[url];
    if (!item) {
      console.warn(`[VOCAL.FUN] [AUDIO] Audio not found in cache: ${url}`);
      return;
    }
    const { audio, volume } = item;
    const fade = item.fadein ?? duration;
    if (!fade) {
      audio.play();
      return;
    }
    audio.volume(0);
    audio.play();
    audio.fade(0, volume, fade);
  }

  /**
   * Fade out audio from cache
   * @param url Audio URL
   * @param duration Fade out duration in ms; if not set - use fade duration from cache
   */
  fadeout(url: string, duration?: number): void {
    const item = this.audioCache[url];
    if (!item) {
      console.warn(`[VOCAL.FUN] [AUDIO] Audio not found in cache: ${url}`);
      return;
    }
    const audio = item.audio;
    const fade = item.fadeout ?? duration;
    if (!fade) {
      audio.pause();
      return;
    }
    const currentVolume = audio.volume(); // Get current volume
    audio.fade(currentVolume, 0, fade);
    setTimeout(() => audio.pause(), fade); // Stop after fade out
  }

  /**
   * Remove audio from cache
   * @param url Audio URL
   */
  remove(url: string): void {
    const item = this.audioCache[url];
    if (item) {
      item.audio.stop();
      item.audio.unload();
      delete this.audioCache[url];
    }
  }

  /** Initialize audio cache with default settings for background, click, and calling sounds */
  initCache(): void {
    this.load(this.clickUrl);
    this.load(this.backgroundUrl, true, 0.1, 2_000, 500);
    this.load(this.callingUrl);
  }

  /** Clear audio cache and stop all audio */
  clearCache(): void {
    for (const url in this.audioCache) {
      this.audioCache[url].audio.stop();
      this.audioCache[url].audio.unload();
      delete this.audioCache[url];
    }
  }

  /** Play background music */
  playBgMusic(): void {
    this.isBgMusicPlaying = true;
    this.fadein(this.backgroundUrl);
  }

  /** Pause background music */
  pauseBgMusic(): void {
    if (!this.isBgMusicPlaying) {
      return;
    }
    this.isBgMusicPlaying = false;
    this.fadeout(this.backgroundUrl);
  }

  /** Interrupt background music by system actions */
  interruptBgMusic(): void {
    if (!this.isBgMusicPlaying) {
      return;
    }
    this.wasBgMusicInterrupted = true;
    this.fadeout(this.backgroundUrl);
  }

  /** Resume background music after system actions */
  resumeBgMusic(): void {
    if (this.wasBgMusicInterrupted) {
      this.wasBgMusicInterrupted = false;
      this.playBgMusic();
    }
  }

  /** Play click sound */
  async click(): Promise<void> {
    const audio = this.play(this.clickUrl);
    if (!audio) {
      return;
    }
    const duration = audio.duration() * 1_000;
    await new Promise((resolve) => setTimeout(resolve, duration));
  }

  /** Play calling sound */
  calling(): void {
    this.play(this.callingUrl);
  }
}

const audioService = new AudioService();

export { audioService };
