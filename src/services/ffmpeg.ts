import { FFmpeg } from '@ffmpeg/ffmpeg';
import { BASE_IMAGE_URL, Sound } from '~/consts';

let ffmpeg: FFmpeg;
const MP3_OUTPUT_NAME = 'output.mp3';
const TMP_NAME = 'input.raw';
const VIDEO_OUTPUT_NAME = 'output.mp4';

/**
 * Prepare image for video conversion
 * @param url Image URL
 * @returns Image name
 */
async function prepareImage(url: string): Promise<string | null> {
  try {
    const imageExt = url.split('.').pop();
    const imgName = 'image.' + imageExt;

    const imageBlob = await $fetch<Blob>(`/api/image/${url.replace(BASE_IMAGE_URL, '')}`, {
      method: 'GET',
      responseType: 'blob',
      headers: { 'Cache-Control': 'max-age=86400' }, // Cache for 1 day
    });
    const arrayBuffer = await imageBlob.arrayBuffer();
    await ffmpeg.writeFile(imgName, new Uint8Array(arrayBuffer));
    return imgName;
  } catch (error) {
    console.warn('[DOWNLOAD ERROR]:', error);
    return null;
  }
}

/**
 * Prepare MP3 conversion
 * @param data Float32Array
 */
async function prepareMP3(data: Float32Array): Promise<void> {
  const combinedPCMUint8 = new Uint8Array(data.buffer.slice(0));

  await ffmpeg.writeFile(TMP_NAME, combinedPCMUint8); // Write the PCM data to the virtual file system

  // Run the FFmpeg command to convert PCM to MP3
  await ffmpeg.exec([
    '-f', 'f32le',                      // Input format: 32-bit float PCM
    '-ar', Sound.SampleRate.toString(), // Sample rate
    '-ac', Sound.Channels.toString(),   // Mono/stereo audio
    '-i', TMP_NAME,                     // Input file
    '-c:a', 'libmp3lame',               // MP3 encoder
    '-b:a', '256k',                     // Bitrate: 256 kbps
    MP3_OUTPUT_NAME                     // Output file
  ]);

  // Clean up temporary input file
  await ffmpeg.deleteFile(TMP_NAME);
};

/**
 * Convert combined PCM data to MP3 using FFmpeg.wasm
 * @param data Float32Array
 * @param withCleanUp Delete output file after conversion; default `false`
 * @returns MP3 Blob
 */
export async function getMp3(data: Float32Array, withCleanUp = false): Promise<Blob | null> {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
  }
  if (!ffmpeg.loaded) {
    await ffmpeg.load(); // Load FFmpeg.wasm
  }
  try {
    await prepareMP3(data);
    const mp3Data = await ffmpeg.readFile(MP3_OUTPUT_NAME); // Read the MP3 file from memory

    if (withCleanUp) {
      await ffmpeg.deleteFile(MP3_OUTPUT_NAME);
    }
    if (mp3Data.length === 0) {
      console.warn('[DOWNLOAD ERROR]: MP3 conversion failed: Output file is empty.');
      return null;
    }
    // Convert MP3 data to Blob
    return new Blob([mp3Data], { type: 'audio/mp3' });
  } catch (error) {
    console.warn('[DOWNLOAD ERROR]:', error);
    return null;
  }
}

/**
 * Get audio duration
 * @param audioBlob Audio Blob
 * @returns Duration in seconds
 */
async function getAudioDuration(audioBlob: Blob): Promise<string> {
  const audio = new Audio(URL.createObjectURL(audioBlob));
  return new Promise((resolve) => {
    audio.onloadedmetadata = () => {
      resolve(audio.duration.toString());
    };
    audio.remove();
  });
}

/**
 * Generate video by audio and agent image
 * @param audio Float32Array audio data
 * @param agentImgUrl agent image URL
 * @returns Video Blob
 */
export async function getVideo(audio: Float32Array, agentImgUrl: string): Promise<Blob | null> {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
  }
  if (!ffmpeg.loaded) {
    await ffmpeg.load(); // Load FFmpeg.wasm
  }
  try {
    const mp3Blob = await getMp3(audio);
    if (!mp3Blob) {
      return null;
    }

    const audioDuration = await getAudioDuration(mp3Blob);
    const imgName = await prepareImage(agentImgUrl);
    if (!imgName) {
      return null;
    }

    await ffmpeg.exec([
      '-loop', '1',
      '-framerate', '1',
      '-i', imgName,
      '-i', MP3_OUTPUT_NAME,
      '-filter_complex', '[0:v]format=rgb24,scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2:0x161622[v]',
      '-map', '[v]',
      '-map', '1:a',
      '-c:v', 'libx264',
      '-t', audioDuration,
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '256k',
      '-shortest',
      VIDEO_OUTPUT_NAME
    ]);

    const videoData = await ffmpeg.readFile(VIDEO_OUTPUT_NAME); // Read the video file from memory
    // Clean up
    await ffmpeg.deleteFile(imgName);
    await ffmpeg.deleteFile(MP3_OUTPUT_NAME);
    await ffmpeg.deleteFile(VIDEO_OUTPUT_NAME);

    if (videoData.length === 0) {
      console.warn('[DOWNLOAD ERROR]: Video conversion failed: Output file is empty.');
      return null;
    }
    // Convert video data to Blob
    return new Blob([videoData], { type: 'video/mp4' });
  } catch (error) {
    console.warn('[DOWNLOAD ERROR]:', error);
    return null;
  }
}
