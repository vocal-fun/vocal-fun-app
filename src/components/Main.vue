<template>
  <section class="main">
    <div class="content-header">
      <h2>Talk to realtime AI agents</h2>
      <EQ class="equalizer" />
    </div>

    <!-- Toolbar for sorting, watchlist, search, and layout toggle -->
    <div class="table-agents">
      <Toolbar v-model:sortBy="sortBy" v-model:searchQuery="searchQuery" :showWatchlist="showWatchlist"
        v-model:viewMode="viewMode" @toggle-watchlist="toggleWatchlist" />

      <!-- GRID LAYOUT -->
      <div v-if="viewMode === 'grid'" class="content-main grid-layout">
        <Person v-for="person in filteredAgents" :key="person.id" :name="person.name" :image="person.image"
          :id="person.id" :rate="person.rate" :disabled="modalLoading" @open-modal="openModal(person, $event)" />
      </div>

      <!-- TABLE LAYOUT -->
      <table v-else class="content-main agents-table">
        <thead>
          <tr>
            <th>Vocal agent</th>
            <th>Price</th>
            <th>mcap</th>
            <th>24h vol.</th>
            <th>24h %</th>
            <th>7d %</th>
            <th>Holders</th>
            <th>Preview</th>
            <th>Call</th>
            <th>Buy</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in filteredAgents" :key="person.id">
            <td>
              <Person :name="person.name" :image="person.image" :id="person.id" :rate="person.rate"
                :disabled="modalLoading" @open-modal="openModal(person, $event)" />
            </td>
            <td>{{ person.price }}</td>
            <td>{{ person.mcap }}</td>
            <td>{{ person.volume24h }}</td>
            <td>{{ person.change24h }}</td>
            <td>{{ person.change7d }}</td>
            <td>{{ person.holders }}</td>
            <td>
              <button @click="openModal(person, 'preview')">Preview</button>
            </td>
            <td>
              <button @click="openModal(person, 'call')">Call</button>
            </td>
            <td>
              <button @click="openModal(person, 'buy')">Buy</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <!-- Modal with CallModalContent -->
    <Modal :isOpen="isModalOpen" @close="closeModal">
      <ClientOnly>
        <CallModalContent ref="modalContent" :person="selectedPerson" @close="closeModal" />
      </ClientOnly>
    </Modal>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'

import { useAgentsStore } from '~/stores/agents'
import { useAuthStore } from '~/stores/auth'
import { useWalletConnect } from '~/composables/useWalletConnect'

import EQ from '~/components/EQ.vue'
import Person from '~/components/Person.vue'
import Modal from '~/components/Modal.vue'
import CallModalContent from '~/components/CallModalContent.vue'
import Toolbar from '~/components/Toolbar.vue'

// Refs & Stores
const modalContent = useTemplateRef('modalContent')
const agentsStore = useAgentsStore()
const authStore = useAuthStore()
const { handleConnectClick } = useWalletConnect()
const route = useRoute()

// Reactive State
const user = computed(() => authStore.user)
const modalLoading = ref(false)
const isModalOpen = ref(false)
const selectedPerson = ref(null)

// Toolbar states
const searchQuery = ref('')
const sortBy = ref('mcap')
const showWatchlist = ref(false)
const viewMode = ref<'grid' | 'table'>('grid')

// Agents
const agents = computed(() => agentsStore.agents)

/** Filter + sort logic */
const filteredAgents = computed(() => {
  let results = [...agents.value]

  if (showWatchlist.value) {
    results = results.filter(agent => agent.isInWatchlist)
  }

  if (searchQuery.value.trim() !== '') {
    results = results.filter(agent =>
      agent.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  switch (sortBy.value) {
    case 'mcap':
      results.sort((a, b) => b.mcap - a.mcap)
      break
    case 'price':
      results.sort((a, b) => b.price - a.price)
      break
    // add other sort cases if needed
  }

  return results
})

/** Toggle watchlist in the toolbar */
function toggleWatchlist() {
  showWatchlist.value = !showWatchlist.value
}

/**
 * Opens the modal for a person, with a specified state
 * (e.g., 'preview', 'call', 'buy'). If user not connected,
 * triggers wallet connect for 'call' only.
 */
async function openModal(person, state) {
  if (state === 'call' && !user.value) {
    handleConnectClick()
    return
  }

  modalLoading.value = true
  selectedPerson.value = person

  // If using 'slug' param in the route, compare with person's route
  const currentSlug = route.params.slug?.[0]
  if (currentSlug !== person.route) {
    history.replaceState(null, '', `/${person.route}`)
  }

  // Show modal, then let CallModalContent do any "onOpen" logic
  isModalOpen.value = true
  await modalContent.value?.onOpen(state)
  modalLoading.value = false
}

/** Close the modal & reset the URL to `/` */
function closeModal() {
  isModalOpen.value = false
  modalContent.value?.onClose()
  history.replaceState(null, '', '/')
}

/**
 * On first mount:
 * 1) Load agents.
 * 2) If a route param is present, find that agent and open automatically.
 * 3) Otherwise, "preload" the first agent (optional).
 */
onBeforeMount(async () => {
  await agentsStore.getAgents()

  const agentRoute = route.params.slug?.[0] as string | undefined
  if (agentRoute) {
    const person = agentsStore.agents.find(a => a.route === agentRoute)
    if (person) {
      selectedPerson.value = person
      await openModal(person, 'default')
      return
    }
  }

  // preload the first agent if desired
  selectedPerson.value = agentsStore.agents[0]
})
</script>

<style scoped lang="scss">
section.main {
  margin: 2.3rem 5.5rem 0 5.5rem;

  .content-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  .table-agents {
    box-shadow:
      1.39px 1.39px 0 0 #59596D,
      1.39px -2.09px 0 0 #1B1B2A,
      -1.39px -1.39px 0 0 #1B1B2A,
      1.39px 0 0 0 #59596D,
      0 -0.7px 0 0 #000000;
  }
  /* Toolbar is placed above the .content-main in template */

  /* GRID layout (when viewMode === 'grid') */
  .grid-layout {
    min-height: 700px;
    max-width: 2048px;
    margin: auto;
    background: #161622;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.25rem;
    padding: 1.875rem;
    margin-bottom: 1rem;
  }

  /* TABLE layout (when viewMode === 'table') */
  .agents-table {
    width: 100%;
    border-collapse: collapse;
    background: #161622;
    box-shadow:
      1.39px 1.39px 0 0 #59596D,
      1.39px -2.09px 0 0 #1B1B2A,
      -1.39px -1.39px 0 0 #1B1B2A,
      1.39px 0 0 0 #59596D,
      0 -0.7px 0 0 #000000;

    thead {
      background: #1f1f2d;

      th {
        padding: 0.75rem 1rem;
        text-align: left;
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid #333;

        &:hover {
          background: #2b2b3b;
        }

        td {
          padding: 0.75rem 1rem;
        }
      }
    }
  }

  /* Example style for the equalizer component */
  .equalizer {
    height: 120px;
    width: 430px;
  }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  section.main {
    margin: 0.75rem 1.25px 1.25px 1.25px;

    .content-header {
      flex-direction: column;
      align-items: center;
      gap: 1rem;

      h2 {
        text-align: center;
      }

      .equalizer {
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
  }
}

@media (max-width: 500px) {
  section.main {
    .equalizer {
      height: 80px;
    }

    .grid-layout,
    .agents-table {
      padding: 0.75rem;
    }
  }
}
</style>
