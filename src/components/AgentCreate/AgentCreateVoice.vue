<template>
  <div class="profile-voice">
    <p>Voice sample</p>
    <p class="warning">
      Upload a 10-15s clip of voice you want to clone. High quality only.
      Or pick one of the existing ones.
    </p>

    <!-- Upload voice block -->
    <div class="upload-voice">
      <NuxtImg
        class="speaker"
        src="/logo/logo.png"
        alt="Speaker logo"
        format="webp"
        loading="lazy"
      />
      <div class="description">
        <p>Upload a voice sample</p>
        <p>.mp4, max 1mb</p>
      </div>
      <button>Upload</button>
    </div>

    <!-- "OR" divider -->
    <div class="divider">
      <span>OR</span>
    </div>

    <!-- Example voice block -->
    <div class="example-voice">
      <!-- Play button -->
      <button>
        <NuxtImg
          class="play"
          src="/img/play.png"
          alt="Play button"
          format="webp"
          loading="lazy"
        />
      </button>

      <div class="description">
        <p>Kawaii</p>
        <p>cute japanese girl</p>
      </div>

      <!-- "Select" button -->
      <button class="select" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtImg } from '#components'
</script>

<style scoped lang="scss">
.profile-voice {
  display: flex;
  width: 100%;
  flex-direction: column;

  .warning {
    color: #fa6400;
    margin-bottom: 32px;
    margin-top: 16px;
    font-size: 12px;
  }

  /* Upload voice block */
  .upload-voice {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px;
    background-color: #59596D26;
    border: 1.8px solid #59596D33;

    img.speaker {
      width: 63px;
      height: 63px;
      padding: 12px;
      border: 1px solid #59596D33;
    }

    .description {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-left: 32px;

      p:last-child {
        opacity: 0.5;
      }
    }

    button {
      position: relative;
      margin-left: auto;

      &::after {
        content: '';
        display: block;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.5);
        margin-top: 6px;
      }

      &:hover::after {
        background-color: white;
      }
    }
  }

  /* Divider (OR) inline */
  .divider {
    display: flex;
    align-items: center;
    color: white;
    margin-top: 28px;
    margin-bottom: 24px;

    &::before,
    &::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid white;
      opacity: 0.2;
    }

    &::before {
      margin-right: 32px;
    }

    &::after {
      margin-left: 32px;
    }
  }

  /* Example voice block */
  .example-voice {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px;
    background-color: #59596D26;
    border: 1.8px solid #59596D33;

    /* Play button */
    button:first-child {
      border: 1px solid #59596D33;
      margin: unset;
      width: 63px;
      height: 63px;
      display: flex;
      align-items: center;
      justify-content: center;

      img.play {
        width: 22px;
        height: 22px;
      }
    }

    .description {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-left: 32px;

      p:last-child {
        opacity: 0.5;
      }
    }

    /* "Select" button */
    .select {
      width: 32px;
      height: 32px;
      background-color: transparent;
      border: 1px solid #59596D;
      cursor: pointer;
      transition: border-color 0.3s ease;
      margin-left: auto;

      &:hover {
        border-color: #ffffff;
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px #ffffff;
      }
    }
  }
}
</style>
