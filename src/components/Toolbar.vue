<template>
  <div class="toolbar">
    <div class="view-toggle">
      <button :class="{ active: viewMode === 'grid' }" @click="$emit('update:viewMode', 'grid')">
        <NuxtImg class="grid" src="/img/grid.png" alt="Grid button" format="webp" sizes="48px" loading="lazy" />
      </button>
      <button :class="{ active: viewMode === 'table' }" @click="$emit('update:viewMode', 'table')">
        <NuxtImg class="table" src="/img/table.png" alt="Table button" format="webp" sizes="48px" loading="lazy" />
      </button>
    </div>

    <div class="divider" />
    <div v-if="viewMode === 'grid'" class="sort">
      <label>Sort by:</label>
      <div class="dropdown">
        <button class="dropdown-trigger" @click="toggleDropdown">
          {{ currentLabel }}
          <span class="arrow" />
        </button>
        <ul v-if="isOpen" class="dropdown-menu">
          <li v-for="option in options" :key="option.value" :class="{ active: option.value === sortBy }"
            @click="selectOption(option.value)">
            {{ option.label }}
          </li>
        </ul>
      </div>
    </div>

    <p class="watchlist">Watchlist</p>
    <p v-if="viewMode === 'table'" class="clips">My clips</p>

    <div class="search">
      <NuxtImg class="icon" src="/img/search.png" alt="Search Icon" format="webp" sizes="16px" loading="lazy" />
      <input type="text" :value="searchQuery" @input="$emit('update:searchQuery', $event.target.value)"
        placeholder="Search" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  searchQuery: {
    type: String,
    required: true
  },
  sortBy: {
    type: String,
    required: true
  },
  showWatchlist: {
    type: Boolean,
    required: true
  },
  viewMode: {
    type: String,
    required: true
  }
})

const emit = defineEmits([
  'update:searchQuery',
  'update:sortBy',
  'toggle-watchlist',
  'update:viewMode'
])

const options = [
  { value: 'mcap', label: 'Top mcap 24h' },
  { value: 'price', label: 'Price' },
  { value: '24hvol', label: '24h vol.' },
  { value: '24hpercent', label: '24h %' },
  { value: '7dpercent', label: '7d %' },
  { value: 'holders', label: 'Holders' }
]

const isOpen = ref(false)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectOption(value: string) {
  emit('update:sortBy', value)
  isOpen.value = false
}

const currentLabel = computed(() => {
  const found = options.find(o => o.value === props.sortBy)
  return found ? found.label : 'Select an option'
})
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 12px 24px;
  background-color: #161622;
}

.divider {
  align-self: stretch;
  width: 1px;
  background: #59596d;
  margin-top: -12px;
  margin-bottom: -12px;
}

.view-toggle {
  display: flex;
  gap: 20px;

  button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      opacity: 0.8;
    }
  }

  .grid,
  .table {
    width: 24px;
    height: 24px;
    transition: opacity 0.2s ease-in-out;
    opacity: 0.5;

  }
  .active .grid,
  .active .table {
    opacity: 1;
  }
}

.sort,
.search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.watchlist,
.clips {
  opacity: 0.5;
}

.search {
  background-color: transparent;
  padding: 12px 10px;
  gap: 12px;
  margin-left: auto;
  border: 2px solid #59596D;

  input {
    background-color: transparent;
    box-sizing: border-box;
    color: white;
    border: none;
    outline: none;

    &:focus-visible {
      outline: unset;
    }

    &::placeholder {
      color: white;
    }
  }

  .icon {
    width: 16px;
    height: 16px;
  }
}

.sort {
  label {
    margin-right: 0.5rem;
    color: #00fa00;
  }
}

.dropdown {
  position: relative;
}

.dropdown-trigger {
  background-color: transparent;
  color: #00fa00;
  cursor: pointer;
  padding: 4px 8px;
  font: inherit;
  display: inline-flex;
  align-items: center;

  .arrow {
    margin-left: 8px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #00fa00;
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: #161622;
  border: 1px solid #00fa00;
  margin: 0;
  padding: 0;
  list-style: none;
  min-width: 140px;
  z-index: 1000;
}

.dropdown-menu li {
  padding: 8px;
  color: #00fa00;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background: #00fa00;
  color: #161622;
}

.dropdown-menu li.active {
  font-weight: bold;
}
</style>
