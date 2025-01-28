import { vocalService } from '~/services/vocal';

export let selectedVoice: string;

const cachedVoiceLine: Record<string, { text: string; audio: string }> = {};

export async function getVocalResponse(transcript: string) {
  vocalService.getVocalResponse(transcript);
}

export async function setVoicePersonality(personality: string) {
  selectedVoice = personality;
  vocalService.setVoicePersonality(selectedVoice);
}

export async function getIntialVoiceLine() {
  vocalService.getInitialVoiceLine();
  vocalService.onMessage("start_vocal_response", (message) => {
    console.info("set cached voice line", message.text);
    setCachedVoiceLine(selectedVoice, message.text, message.audio_base64);
  });
}

export function setCachedVoiceLine(personality: string, text: string, audio: string) {
  cachedVoiceLine[personality] = {
    text,
    audio,
  };
}

export function getCachedVoiceLine(personality: string) {
  return cachedVoiceLine[personality];
}
