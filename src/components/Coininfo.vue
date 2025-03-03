<template>
  <div class="agent-details-card">
    
    <div class="header">
      <NuxtImg
        class="avatar-img"
        :src="agent.image"
        alt="Agent Avatar"
        width="90"
        height="90"
      />
      <div class="header-text">
        <h3>{{ agent.tokenName }} OFFICIAL COIN</h3>
        <p class="token">${{ agent.tokenName }}</p>
      </div>
    </div>

    <!-- Contract & Price -->
    <div class="info-rows">
      <div class="info-row">
        <p class="label">CONTRACT</p>
        <p class="value"> agent.contract </p>
      </div>
      <div class="info-row">
        <p class="label">PRICE / MIN</p>
        <p class="value">1 VOCAL</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="actions">
      <button class="preview">PREVIEW</button>
      <button class="call">CALL</button>
    </div>

    <!-- Market Data -->
    <div class="stats-grid">
      <div><p class="sub-label">$ PRICE</p><p class="sub-value">{{ agent.price }}</p></div>
      <div><p class="sub-label">AGE</p><p class="sub-value">{{ agent.createdAt }}</p></div>
      <div><p class="sub-label">MKT CAP</p><p class="sub-value">{{ agent.mcap }}</p></div>
      <div><p class="sub-label">LIQUIDITY</p><p class="sub-value">agent.liquidity </p></div>
      <div><p class="sub-label">HOLDERS</p><p class="sub-value">{{ agent.holders }}</p></div>
    </div>

    <!-- Change in price over time -->
    <div class="change-grid">
      <!-- <div>
        <p class="change-value" :class="{ negative: agent.change5m < 0 }">{{ agent.change5m }}%</p>
        <p class="change-label">5m</p>
      </div> -->
      <!-- <div>
        <p class="change-value" :class="{ negative: agent.change1h < 0 }">{{ agent.change1h }}%</p>
        <p class="change-label">1h</p>
      </div> -->
      <div>
        <p class="change-value" :class="{ negative: agent.change24h < 0 }">{{ agent.change24h }}%</p>
        <p class="change-label">24h</p>
      </div>
      <div>
        <p class="change-value" :class="{ negative: agent.change7d < 0 }">{{ agent.change7d }}%</p>
        <p class="change-label">7d</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { NuxtImg } from '#components'
import type { Agent } from '~/types';



defineProps<{ agent: Agent }>()
</script>

<style scoped lang="scss">
.agent-details-card {
  background: #000;
  color: #37D339;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;

    .avatar-img {
      border-radius: 50%;
      object-fit: cover;
      width: 70px;
      height: 70px;
    }
    &-text {
      display: flex;
      flex-direction: column;
      gap: 12px;
      h3 {
        font-size: 14px;
      }
      p {
        font-size: 12px;
      }
    }
  }

  .info-rows {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;

    .info-row {
      display: flex;
      justify-content: space-between;
      .label {
        opacity: 0.7;
      }
    }
  }

  .actions {
    display: flex;
    gap: 1rem;

    button {
      flex: 1 1 50%;
      padding: 0.75rem;
      cursor: pointer;
      background-color: #37d33933;
      border: none;
      transition: background 0.2s;

      &:hover {
        background-color: #37D339;
        color: #121212;
      }
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    background: #161622;
    padding: 1rem;

    .sub-label {
      font-size: 0.9rem;
      opacity: 0.6;
    }
    .sub-value {
      font-size: 1rem;
    }
  }

  .change-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    background: #161622;
    padding: 1rem;

    .change-value {
      font-size: 1rem;
    }
    .change-label {
      font-size: 0.75rem;
      opacity: 0.6;
    }
    .negative {
      color: #FA6400;
    }
  }
}
</style>
