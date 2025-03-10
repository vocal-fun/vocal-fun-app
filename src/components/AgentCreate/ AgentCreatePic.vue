<template>
  <div class="profile-pic">
    <p>Agent profile pic</p>
    <div class="upload-pic">
      <NuxtImg
        class="profile"
        src="/img/profile.png"
        alt="Profile picture"
        format="webp"
        loading="lazy"
      />
      <div class="description">
        <p>Upload a picture</p>
        <p>png, jpg, jpeg. Max 1mb</p>
      </div>
      <button>Upload</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtImg } from '#components'
</script>

<style scoped lang="scss">
.profile-pic {
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 32px;

  .upload-pic {
    margin-top: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px;
    background-color: #59596D26;
    border: 1.8px solid #59596D33;

    img.profile {
      width: 62px;
      height: 62px;
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

    /* Button underline style */
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
}
</style>
