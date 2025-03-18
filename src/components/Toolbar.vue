<template>
  <div class="toolbar">
    <div class="view-toggle">
      <button v-play-click-sound :class="{ active: viewMode === TypeGridTable.GRID }"
        @click="$emit('update:viewMode', TypeGridTable.GRID)">
        <NuxtImg class="grid" src="/img/grid.png" alt="Grid button" format="webp" sizes="48px" loading="lazy" />
      </button>
      <button v-play-click-sound :class="{ active: viewMode === TypeGridTable.TABLE }"
        @click="$emit('update:viewMode', TypeGridTable.TABLE)">
        <NuxtImg class="table" src="/img/table.png" alt="Table button" format="webp" sizes="48px" loading="lazy" />
      </button>
    </div>

    <div class="divider" />
    <div v-if="viewMode === TypeGridTable.GRID" class="sort">
      <label>Sort by:</label>
      <div class="dropdown" ref="dropdownRef">
        <button v-play-click-sound class="dropdown-trigger" @click="toggleDropdown">
          {{ currentLabel }}
          <span class="arrow" />
        </button>
        <transition name="dropdown">
          <ul v-play-click-sound v-if="isOpen" class="dropdown-menu">
            <li v-for="option in options" :key="option.value" :class="{ active: option.value === sortBy }"
              @click="selectOption(option.value)">
              {{ option.label }}
            </li>
          </ul>
        </transition>
      </div>
    </div>

    <p class="watchlist">Watchlist</p>
    <div class="search">
      <NuxtImg class="icon" src="/img/search.png" alt="Search Icon" format="webp" sizes="16px" loading="lazy" />
      <input type="text" :value="searchQuery" @input="handleSearchInput" placeholder="Search" />
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import debounce from 'lodash/debounce';
import { TypeGridTable } from '~/types'

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
  { value: 'volume24h', label: '24h vol.' },
  { value: 'change24h', label: '24h %' },
  { value: 'change7d', label: '7d %' },
  { value: 'holders', label: 'Holders' }
]

const isOpen = ref(false)
const dropdownRef = ref<HTMLDivElement | null>(null)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectOption(value: string) {
  emit('update:sortBy', value)
  isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  debouncedSearch.cancel()
})

const currentLabel = computed(() => {
  const found = options.find(o => o.value === props.sortBy)
  return found ? found.label : 'Select an option'
})

const debouncedSearch = debounce((value: string) => {
  emit('update:searchQuery', value)
}, 300)

function handleSearchInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  debouncedSearch(value)
}
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  padding: 12px 24px;
  background-color: var(--color-background);
  flex-wrap: wrap;
}

.divider {
  align-self: stretch;
  width: 1px;
  background: var(--color-tertiary);
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
    transition: opacity 0.3s ease-in-out;

    &:hover {
      opacity: 0.7;
    }
  }

  .grid,
  .table {
    width: 24px;
    height: 24px;
    transition: opacity 0.3s ease-in-out;
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

.watchlist {
  opacity: 0.5;
}

.search {
  background-color: transparent;
  padding: 12px 10px;
  gap: 12px;
  margin-left: auto;
  border: 2px solid #303149;
  max-width: 240px;

  input {
    background-color: transparent;
    box-sizing: border-box;
    color: white;
    border: none;
    outline: none;
    min-width: 150px;

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
    color: var(--color-secondary);
  }
}

.dropdown {
  position: relative;
}

.dropdown-trigger {
  background-color: transparent;
  color: var(--color-secondary);
  cursor: pointer;
  padding: 4px 8px;
  font: inherit;
  display: inline-flex;
  align-items: center;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #0ac80a;
  }

  .arrow {
    margin-left: 8px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--color-secondary);
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--color-background);
  border: 1px solid var(--color-secondary);
  margin: 0;
  padding: 0;
  list-style: none;
  min-width: 140px;
  z-index: 1000;

  li {
    padding: 8px;
    color: var(--color-secondary);
    cursor: pointer;
    transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;

    &:hover {
      background-color: var(--color-secondary);
      color: var(--color-background);
    }
  }
}

.dropdown-menu li.active {
  font-weight: bold;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1048px) {
  .divider {
    display: none;
  }

  .toolbar {
    padding: 20px 24px;
    gap: 1rem;
  }

  .watchlist {
    margin-left: auto;
  }

  .view-toggle {
    button {

      .grid,
      .table {
        width: 20px;
        height: 20px;
      }
    }
  }

  .search {
    max-width: unset;
    width: 100%;
  }
}

@media (max-width: 700px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .view-toggle,
  .sort,
  .search,
  .watchlist {
    width: 100%;
    text-align: left;
    margin-bottom: 0.5rem;
  }

  .divider {
    display: none;
  }
}

@media (max-width: 500px) {
  .dropdown-menu {
    font-size: 14px;

    li {
      padding: 5px;
    }
  }
}
</style>
