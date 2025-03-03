<template>
  <div class="agent-details-card">
    <div class="header-info">
      <div class="header">
        <NuxtImg class="avatar-img" :src="agent.image" alt="Agent Avatar" width="90" height="90" />
        <div class="header-text">
          <h3>{{ agent.tokenName }} OFFICIAL COIN</h3>
          <p class="token">${{ agent.tokenName }}</p>
        </div>
      </div>
      <div class="contract-info">
        <div class="info-row">
          <p class="label">CONTRACT</p>
          <p class="value">{{ formatContract(agent.contract) }}</p>
        </div>
        <div class="info-row">
          <p class="label">PRICE / MIN</p>
          <p class="value">{{ agent.rate }} VOCAL</p>
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="preview">PREVIEW</button>
      <button class="call">CALL</button>
    </div>

    <div class="coin-info">
      <div class="prices">
        <div class="titles">
          <p><span>$ </span>PRICE</p>
          <p>PRICE</p>
          <p>AGE</p>
        </div>
        <div class="values">
          <p>${{ agent.price }}</p>
          <p>${{ agent.price }}</p>
          <p>{{ agent.createdAt.toUpperCase() }} AGO</p>
        </div>
      </div>
      <div class="stats">
        <div class="titles">
          <p>MKAT CAP</p>
          <p>LIQUIDITY</p>
          <p>HOLDERS</p>
        </div>
        <div class="values">
          <p>${{ formatShortNumber(agent.mcap) }}</p>
          <p>${{ formatShortNumber(agent.liquidity) }}</p>
          <p>{{ agent.holders }}</p>
        </div>
      </div>
      <div class="changes">
        <div>
          <p :style="{ color: changes.change5m.color }">{{ changes.change5m.formatted }}</p>
          <p>5m</p>
        </div>
        <div>
          <p :style="{ color: changes.change1h.color }">{{ changes.change1h.formatted }}</p>
          <p>1h</p>
        </div>
        <div>
          <p :style="{ color: changes.change24h.color }">{{ changes.change24h.formatted }}</p>
          <p>24h</p>
        </div>
        <div>
          <p :style="{ color: changes.change7d.color }">{{ changes.change7d.formatted }}</p>
          <p>7d</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { NuxtImg } from '#components'
import { formatShortNumber, formatContract } from '~/utils/formatters'
import type { Agent } from '~/types';

const props = defineProps<{ agent: Agent }>()

function formatChange(value: number): { formatted: string; color: string } {
  const absValue = Math.abs(value);
  if (value >= 0) {
    return { formatted: `+${absValue}%`, color: '#00FA00' };
  } else {
    return { formatted: `-${absValue}%`, color: '#FF886A' };
  }
}

const changes = computed(() => ({
  change5m: formatChange(props.agent.change5m),
  change1h: formatChange(props.agent.change1h),
  change24h: formatChange(props.agent.change24h),
  change7d: formatChange(props.agent.change7d),
}));
</script>

<style scoped lang="scss">
.agent-details-card {
  color: #00FA00;
  border-bottom: 1px solid #59596D;
  display: flex;
  flex-direction: column;

  .header-info {
    display: flex;
    flex-direction: column;
    padding: 8px 16px 16px 8px;
    background: linear-gradient(180deg, rgba(0, 255, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);

    .header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-bottom: 38px;
      border-bottom: 1px solid #37D339;

      .avatar-img {
        border-radius: 50%;
        object-fit: cover;
        width: 74px;
        height: 74px;
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

    .contract-info {
      display: flex;
      flex-direction: column;
      margin-top: 12px;
      gap: 0.8rem;

      .info-row {
        display: flex;
        justify-content: space-between;

        &:first-child {
          padding-bottom: 14px;
          border-bottom: 1px solid #37D339;
        }

        .value {
          cursor: pointer;

          &:hover {
            text-decoration: underline;

          }
        }
      }
    }
  }

  .actions {
    display: flex;
    flex-direction: row;

    button {
      width: 100%;
      text-align: center;
      cursor: pointer;
      background-color: #37D33933;
      padding: 22px;
      transition: background 0.2s;

      &:hover {
        background-color: #37D339;
        color: #121212;
      }

      &:first-child {
        border-right: 1px solid #00FA00;
      }
    }
  }

  .coin-info {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 28px;

    .prices,
    .stats {
      margin-left: 20px;
      font-size: 12px;
      color: #FFFFFF;
      display: grid;
      grid-template-columns: repeat(3, auto);
      gap: 14px;

      .titles,
      .values {
        display: contents;
      }

      .titles {
        p {
          opacity: 0.5;
        }
      }
    }

    .changes {
      display: flex;
      flex-direction: row;
      border-top: 1px solid #59596D;
      justify-content: space-between;
      color: #FFFFFF;
      opacity: 0.5;
      font-size: 11px;

      div {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 14px;
        align-items: center;

        &:not(:last-child) {
          border-right: 1px solid #59596D;
        }
      }
    }
  }
}
</style>
