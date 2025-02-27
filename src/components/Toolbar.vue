<template>
  <div class="toolbar">
    <!-- Sort -->
    <div class="sort">
      <label for="sort">Sort by:</label>
      <select
        id="sort"
        :value="sortBy"
        @input="$emit('update:sortBy', $event.target.value)"
      >
        <option value="mcap">Top mcap 24h</option>
        <option value="price">Price</option>
        <!-- Add other sort fields as needed -->
      </select>
    </div>

    <!-- Watchlist toggle -->
    <button @click="$emit('toggle-watchlist')">
      {{ showWatchlist ? 'Hide' : 'Show' }} Watchlist
    </button>

    <!-- Search -->
    <div class="search">
      <input
        type="text"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        placeholder="Search agents…"
      />
    </div>

    <!-- View toggle (Grid / Table) -->
    <div class="view-toggle">
      <button
        :class="{ active: viewMode === 'grid' }"
        @click="$emit('update:viewMode', 'grid')"
      >
        Grid View
      </button>
      <button
        :class="{ active: viewMode === 'table' }"
        @click="$emit('update:viewMode', 'table')"
      >
        Table View
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
  sortBy: {
    type: String,
    required: true,
  },
  showWatchlist: {
    type: Boolean,
    required: true,
  },
  viewMode: {
    type: String,
    required: true,
  },
});
defineEmits([
  'update:searchQuery',
  'update:sortBy',
  'toggle-watchlist',
  'update:viewMode'
]);
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.sort,
.search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.view-toggle button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.view-toggle button.active {
  background-color: #444;
  color: #fff;
}
</style>
