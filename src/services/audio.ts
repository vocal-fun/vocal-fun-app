export const playClickSound = async () => {
  const audio = new Audio('/audio/click.mp3');
  try {
    audio.currentTime = 0; // Reset the audio to start
    await audio.play();
    await new Promise((resolve) => setTimeout(resolve, 400));
  } catch (err) {
    console.warn('[VOCAL.FUN] [CLICK] Audio playback failed:', err);
  }
};
