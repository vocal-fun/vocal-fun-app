<template>
  <div class="profile-basics">
    <p>Basics first</p>
    <div class="inputs">
      <input placeholder="Name your agent..." />
      <input placeholder="Come up with a ticker (e.g $TRUMP)" />
      <input placeholder="Provide description to the agent..." />
    </div>
  </div>
</template>

<script setup lang="ts">
// No special logic needed yet
</script>

<style scoped lang="scss">
.profile-basics {
  margin-bottom: 40px;
  width: 100%;

  .inputs {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    input {
      border: 1.8px solid #59596D33;
      padding: 22px;
      color: white;
      background-color: #59596D26;

      &::placeholder {
        opacity: 0.5;
      }
    }
  }
}
</style>
