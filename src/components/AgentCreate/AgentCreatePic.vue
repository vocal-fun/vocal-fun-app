<template>
  <div class="profile-pic">
    <p>Agent profile pic</p>
    <div class="upload-pic">
      <NuxtImg class="profile" :src="preview || '/img/profile.png'" alt="Profile picture" format="webp"
        loading="lazy" />
      <div class="description">
        <p v-if="fileName">{{ displayFileName }}</p>
        <template v-else>
          <p>Upload a picture</p>
          <p>png, jpg, jpeg. Max 1mb</p>
        </template>
      </div>
      <button @click="handleButtonClick">
        {{ file ? "Remove" : "Upload" }}
      </button>
      <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" style="display: none;" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'
import { NuxtImg } from '#components'

const emit = defineEmits<{ (e: 'update:imageFile', file: File | null): void }>();

const file = ref<File | null>(null);
const preview = ref<string | null>(null);
const fileName = ref<string>('');

const fileInput = ref<HTMLInputElement | null>(null);

const displayFileName = computed(() => {
  if (!fileName.value) return '';
  if (fileName.value.length <= 5) return fileName.value;
  const dotIndex = fileName.value.lastIndexOf('.');
  if (dotIndex !== -1) {
    const namePart = fileName.value.slice(0, 5);
    const ext = fileName.value.slice(dotIndex);
    return namePart + '...' + ext;
  } else {
    return fileName.value.slice(0, 5) + '...';
  }
});

function handleButtonClick() {
  if (file.value) {
    file.value = null;
    preview.value = null;
    fileName.value = '';
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    emit('update:imageFile', null);
  } else {
    fileInput.value?.click();
  }
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const selectedFile = target.files ? target.files[0] : null;
  if (selectedFile) {
    if (selectedFile.size > 1048576) {
      alert("File size exceeds 1MB. Please select a smaller file.");
      if (fileInput.value) {
        fileInput.value.value = '';
      }
      return;
    }
    file.value = selectedFile;
    fileName.value = selectedFile.name;
    preview.value = URL.createObjectURL(selectedFile);
    emit('update:imageFile', selectedFile);
  }
}
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
    background-color: #59596d26;
    border: 1.8px solid #59596d33;

    img.profile {
      width: 62px;
      height: 62px;
    }

    .description {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-left: 32px;

      p {
        &:last-child {
          opacity: 0.5;
        }
      }
    }

    button {
      position: relative;
      margin-left: auto;

      &::after {
        content: '';
        display: block;
        height: 1px;
        background-color: white;
        margin-top: 6px;
      }

      transition: color 0.3s ease-in-out;

      &:hover {
        color: rgb(201, 195, 195);
      }

      &:hover::after {
        background-color: rgb(201, 195, 195);
      }
    }
  }
}
</style>
