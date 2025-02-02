<template>
  <div class="header">
    <div class="account">
      <span>YOUR BALANCE: ${{ balance }}</span>
      <button v-play-click-sound @click="openWallet">{{ formattedAddress }}</button>
    </div>
    <button v-play-click-sound class="close" @click="onModalClose">X</button>
  </div>
  <div class="info">
    <div class="info__label">
      <span>BUY TIME WITH</span>
      <span class="text">
        <span v-for="(item, index) in buyOptions" :key="index">
          <Token with-name :token="item.symbol" /> {{ index < buyOptions.length - 1 ? 'OR' : '' }}
        </span>
        ON
        <Token with-name token="base" />
      </span>
      <div class="label-options">
        <button
          v-for="item in buyOptions"
          v-play-click-sound
          :key="item.symbol"
          :class="{ active: selectedOption?.address === item.address }"
          @click="selectOption(item)"
        >
          {{ amount }} <Token with-name :token="item.symbol" />
        </button>
      </div>
      <div class="amount-controls">
        <button v-play-click-sound @click="increaseAmount">+</button>
        <button v-play-click-sound @click="decreaseAmount">-</button>
      </div>
    </div>
    <div v-show="selectedOption?.recipient" class="info__qr">
      <QrcodeVue level="H" foreground="#37D339" background="#000" :value="selectedOption?.recipient" :size="140" />
      <!-- <span class="qr-option">{{ amount }} {{ selectedSymbol }}</span> -->
    </div>
  </div>
  <div class="recipient">
    <span>Send {{ optionsString }} to this address</span>
    <button v-play-click-sound @click="copyRecipient">{{ selectedOption?.recipient ?? 'n/a' }}</button>
  </div>
  <div class="warning">
    <span>⚠ {{ optionsString }} Only</span>
    <span>⚠ BASE Chain ONLY</span>
  </div>
  <button v-play-click-sound class="action shake-little" :class="selectedSymbol.toLowerCase()" :disabled="sendLoading" @click="buy">
    SEND {{ amount }} <Token with-name icon-position="right" size="20px" :token="selectedSymbol" />
    <LoadingDots v-show="sendLoading" />
  </button>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';

const emit = defineEmits(['close']);

const {
  balance,
  amount,
  selectedOption,
  formattedAddress,
  buyOptions,
  sendLoading,
  increaseAmount,
  decreaseAmount,
  openWallet: _openWallet,
  selectOption,
  copyRecipient,
  buy,
} = useBuyModal();

const optionsString = computed(() => buyOptions.value.map((item) => item.symbol.toUpperCase()).join(' or '));
const selectedSymbol = computed(() => selectedOption.value?.symbol.toUpperCase() ?? '');

const onModalClose = () => {
  emit('close');
}

const openWallet = () => {
  _openWallet();
  onModalClose();
}
</script>

<style scoped lang="scss">
@mixin useLinkButton() {
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease-in-out;
  &:hover {
    color: white;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  .account {
    margin-left: 2rem; // To make it visually centered
    flex: 1;
    display: flex;
    justify-content: center;
    gap: 1rem;
    > button {
      @include useLinkButton();
    }
  }
  .close {
    padding: 0.5rem 1rem;
    transition: color 0.3s ease-in-out;
    &:hover {
      color: white;
    }
  }
}
.info {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__label {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .text {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      > span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }
    .label-options,
    .amount-controls {
      display: flex;
      gap: 1rem;
    }
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: nowrap;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 12px;
      padding: 0.5rem 1rem;
      background: #00FA0014;
      border-radius: 100px;
      transition: background-color 0.3s ease-in-out;
      &:hover,
      &.active {
        background-color: var(--color-primary);
        color: white;
      }
    }
  }
  &__qr {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
}
.recipient {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  > button {
    @include useLinkButton();
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.warning {
  width: 100%;
  display: flex;
  gap: 1rem;
  color: #FA6400;
}
.action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
  color: white;
  &[disabled] {
    cursor: not-allowed;
  }
  &.usdc {
    background-color: #2775CA;
    box-shadow: 0px 0.55px 6.65px 0px #2775CA;
  }
  &.usdt {
    background-color: #26A17B;
    box-shadow: 0px 0.55px 6.65px 0px #26A17B;
  }
  &:hover {
    transform: scale(1.035);
  }
}
@media (max-width: 600px) {
  .label-options {
    flex-direction: column;
  }
}
@media (max-width: 550px) {
  .info,
  .account,
  .warning {
    flex-direction: column;
    align-items: center;
  }
  .info {
    gap: 2rem;
    .amount-controls {
      justify-content: center;
    }
  }
}
</style>
