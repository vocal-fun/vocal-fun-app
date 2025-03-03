<template>
  <section class="main">
    <div class="content-header">
      <div>
        <h2>Voice AI agent coins</h2>
        <button>Launch my coin</button>
      </div>
      <EQ class="equalizer" />
    </div>

    <div class="table-agents">
      <Toolbar v-model:sortBy="sortBy" v-model:searchQuery="searchQuery" :showWatchlist="showWatchlist"
        v-model:viewMode="viewMode" :showSort="viewMode === 'grid'" @toggle-watchlist="toggleWatchlist" />

      <div v-if="viewMode === 'grid'" class="agents-grid">
        <Person v-for="person in filteredAgents" :key="person.id" :name="person.name" :image="person.image"
          :id="person.id" :rate="person.rate" :tokenName="person.tokenName" :mcap="person.mcap"
          :createdAt="person.createdAt" :disabled="modalLoading" @open-modal="openModal(person, $event)" />
      </div>

      <div v-else class="table-container">
        <table class="agents-table">
          <thead>
            <tr>
              <th>Vocal agent</th>
              <th v-for="col in columns" :key="col.key" :class="{ sorted: sortBy === col.key, sorting: true }"
                @click="setSort(col.key)">
                <div class="label-wrapper">
                  <p class="column-title">{{ col.label }}</p>
                  <div class="sort-arrows">
                    <NuxtImg class="arrow-up" src="/img/arrow-up.png" width="10" height="6" alt="Up arrow"
                      :style="(sortBy === col.key && sortDirection === 'asc') ? 'opacity:1;' : 'opacity:0.4;'" />
                    <NuxtImg class="arrow-down" src="/img/arrow-up.png" width="10" height="6" alt="Down arrow"
                      :style="(sortBy === col.key && sortDirection === 'desc') ? 'opacity:1; transform:rotate(180deg);' : 'opacity:0.4; transform:rotate(180deg);'" />
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="person in filteredAgents" :key="person.id" @click="goToAgentPage(person)">
              <td class="table-avatar-column">
                <NuxtImg class="avatar-img" sizes="90vw md:400px" format="webp" loading="lazy" width="48" height="48"
                  placeholder="/img/user-avatar.png" placeholder-class="image-placeholder" :src="person.image"
                  :alt="person.name" />
                <div class="person-info">
                  <p class="table-person-name">{{ person.name }}</p>
                  <p class="token-name">${{ person.tokenName }}</p>
                </div>
              </td>
              <td>${{ person.price }}</td>
              <td>${{ formatShortNumber(person.mcap) }}</td>
              <td>${{ person.volume24h }}</td>
              <td :class="{ negative: person.change24h < 0 }">
                {{ person.change24h > 0 ? `+${person.change24h}` : person.change24h }}%
              </td>
              <td :class="{ negative: person.change7d < 0 }">
                {{ person.change7d > 0 ? `+${person.change7d}` : person.change7d }}%
              </td>
              <td>{{ person.holders }}</td>
              <td class="actions-buttons">
                <button @click="openModal(person, 'preview')" class="preview-btn">Preview</button>
                <button @click="openModal(person, 'call')" class="call-btn">Call</button>
                <button class="buy-btn">Buy</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
import { formatShortNumber } from '~/utils/formatters'
import EQ from '~/components/EQ.vue'
import Person from '~/components/Person.vue'
import Modal from '~/components/Modal.vue'
import CallModalContent from '~/components/CallModalContent.vue'
import Toolbar from '~/components/Toolbar.vue'
import type { Agent, OpenModalState } from '~/types'

const modalContent = useTemplateRef('modalContent')
const agentsStore = useAgentsStore()
const authStore = useAuthStore()
const { handleConnectClick } = useWalletConnect()
const route = useRoute()
const router = useRouter()
const user = computed(() => authStore.user)
const modalLoading = ref(false)
const isModalOpen = ref(false)
const selectedPerson = ref<Agent | undefined>(undefined)


const searchQuery = ref('')
const showWatchlist = ref(false)
const viewMode = ref<'grid' | 'table'>('grid')
const sortBy = ref('mcap')
const sortDirection = ref<'asc' | 'desc'>('desc')

const columns = [
  { key: 'price', label: 'Price' },
  { key: 'mcap', label: 'mcap' },
  { key: 'volume24h', label: '24h vol.' },
  { key: 'change24h', label: '24h %' },
  { key: 'change7d', label: '7d %' },
  { key: 'holders', label: 'Holders' }
]


function goToAgentPage(person: Agent) {
  router.push(`/agent/${person.id}`)
}

function setSort(field: string) {
  if (sortBy.value === field) {
    sortDirection.value = (sortDirection.value === 'desc') ? 'asc' : 'desc'
  } else {
    sortBy.value = field
    sortDirection.value = 'desc'
  }
}

const filteredAgents = computed(() => {
  let results = [...agentsStore.agents]

  if (searchQuery.value) {
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
    case 'volume24h':
      results.sort((a, b) => b.volume24h - a.volume24h)
      break
    case 'change24h':
      results.sort((a, b) => b.change24h - a.change24h)
      break
    case 'change7d':
      results.sort((a, b) => b.change7d - a.change7d)
      break
    case 'holders':
      results.sort((a, b) => b.holders - a.holders)
      break
  }
  if (sortDirection.value === 'asc') results.reverse()

  return results
})


function toggleWatchlist() {
  showWatchlist.value = !showWatchlist.value
}

async function openModal(person: Agent, state: OpenModalState) {
  if (state === 'call' && !user.value) {
    handleConnectClick()
    return
  }

  modalLoading.value = true
  selectedPerson.value = person
  const currentSlug = route.params.slug?.[0]
  if (currentSlug !== person.route) {
    history.replaceState(null, '', `/${person.route}`)
  }
  isModalOpen.value = true
  await modalContent.value?.onOpen(state)
  modalLoading.value = false
}

function closeModal() {
  isModalOpen.value = false
  modalContent.value?.onClose()
  history.replaceState(null, '', '/')
}

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

    div:first-child {
      display: flex;
      flex-direction: column;
      gap: 30px;
      font-size: 20px;

      &:hover {
        transition: color 0.2s;
        color: #60FF60;
      }

      h2 {
        color: #FFFFFF;
      }
    }


  }

  .table-agents {
    box-shadow:
      1.39px 1.39px 0 0 #59596D,
      1.39px -2.09px 0 0 #1B1B2A,
      -1.39px -1.39px 0 0 #1B1B2A,
      1.39px 0 0 0 #59596D,
      0 -0.7px 0 0 #000000;
  }

  .agents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    max-width: 2048px;
    margin: auto;
    background: #161622;
    border-top: 2px solid #59596D;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.25rem;
    padding: 1.875rem;
    margin-bottom: 1rem;
  }

  .table-container {
    width: 100%;
    overflow-x: auto;
  }

  .agents-table {
    width: 100%;
    min-width: 1200px;
    border-collapse: collapse;
    background: #161622;
    border-top: 2px solid #59596d;
    box-shadow:
      1.39px 1.39px 0 0 #59596D,
      1.39px -2.09px 0 0 #1B1B2A,
      -1.39px -1.39px 0 0 #1B1B2A,
      1.39px 0 0 0 #59596D,
      0 -0.7px 0 0 #000000;

    .label-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 6px;
    }

    .sort-arrows {
      display: flex;
      flex-direction: column;
      align-items: center;

      .arrow-down {
        margin-right: 1.5px;
      }
    }

    thead {
      background: #161622;
      color: #8989AB;
      font-size: 12px;

      th {
        padding: 1.25rem 0.75rem;
        text-align: left;
        cursor: pointer;

        &.sorted {
          color: white;
        }

        &:hover {
          opacity: 0.8;
        }
      }
    }

    tbody {
      background-color: #000000;

      tr {
        border-bottom: 1px solid #333;

        &:hover {
          cursor: pointer;
          background: #2b2b3b;
        }

        td {
          padding: 0.75rem 1rem;
        }
      }
    }

    .negative {
      color: #FA6400;
    }
  }

  .table-avatar-column {
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: center;
    height: 100%;

    .avatar-img {
      border-radius: 50%;
      object-fit: cover;
    }

    .person-info {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
  }

  .actions-buttons {
    display: flex;
    margin-bottom: 16px;

    .preview-btn {
      padding-right: 0;
      border-right: 1px solid #37D339;
    }

    .call-btn {
      padding-left: 0;
      padding-right: 0;
    }

    .buy-btn {
      padding-left: 0;
    }

    .preview-btn,
    .call-btn,
    .buy-btn {
      padding: 14px;
      background-color: #37D33933;
      display: flex;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background-color: #37D339;
        color: #121212;
      }
    }

    .buy-btn {
      background-color: #00FA00;
      color: #121212;

      &:hover {
        background-color: #60FF60;
        color: #000;
      }
    }
  }

  .equalizer {
    height: 120px;
    width: 430px;
  }
}

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

    .agents-grid,
    .table-container {
      padding: 0.75rem;
    }
  }
}
</style>
