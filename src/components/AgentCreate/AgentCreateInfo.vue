<template>
  <div class="profile-basics">
    <p>Basics first</p>
    <div class="inputs">
      <input placeholder="Name your agent..." :value="agentInfo.name"
        @input="updateField('name', ($event.target as HTMLInputElement).value)" />
      <input placeholder="Come up with a ticker (e.g $TRUMP)" :value="agentInfo.ticker"
        @input="updateField('ticker', ($event.target as HTMLInputElement).value)" />
      <input placeholder="Provide description to the agent..." :value="agentInfo.description"
        @input="updateField('description', ($event.target as HTMLInputElement).value)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface AgentInfo {
  name: string;
  ticker: string;
  description: string;
}

const props = defineProps<{ agentInfo: AgentInfo }>();
const emit = defineEmits<{ (e: 'update:agentInfo', value: AgentInfo): void }>();

function updateField(field: keyof AgentInfo, value: string) {
  emit('update:agentInfo', { ...props.agentInfo, [field]: value });
}
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
      border: 1.8px solid #59596d33;
      padding: 22px;
      color: white;
      background-color: #59596d26;

      &::placeholder {
        opacity: 0.5;
      }
    }
  }
}
</style>
