<template>
  <section class="main">
    <div class="content-header">
      <h2>Talk to realtime AI agents</h2>
      <EQ />
    </div>
    <div class="content-main">
      <Person
        v-for="person in agents"
        :key="person.id"
        :name="person.name"
        :image="person.image"
        :id="person.id"
        :rate="person.rate"
        :disabled="modalLoading"
        @open-modal="openModal(person, $event)"
      />
      <Modal :isOpen="isModalOpen" @close="closeModal">
        <ClientOnly>
          <CallModalContent ref="modalContent" :person="selectedPerson" @close="closeModal" />
        </ClientOnly>
      </Modal>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Agent, OpenModalState } from '~/types';

const modalContent = useTemplateRef('modalContent');
const agentsStore = useAgentsStore();
const authStore = useAuthStore();
const { handleConnectClick } = useWalletConnect();
const user = computed(() => authStore.user);
const route = useRoute();

const modalLoading = ref<boolean>(false);
const isModalOpen = ref<boolean>(false);
const selectedPerson = ref<Agent | undefined>(undefined);

const agents = computed(() => agentsStore.agents);

const openModal = async (person: Agent, state: OpenModalState) => {
  if (state === 'call' && !user.value) {
    handleConnectClick();
    return;
  }

  modalLoading.value = true;
  selectedPerson.value = person;
  if (route.params.id !== person.route) {
    history.replaceState(null, '', `/${person.route}`);
  }
  isModalOpen.value = true; // TODO: move this line after await if need to wait
  await modalContent.value?.onOpen(state);
  modalLoading.value = false;
};

const closeModal = () => {
  isModalOpen.value = false;
  modalContent.value?.onClose();
  history.replaceState(null, '', '/');
};

onBeforeMount(async () => {
  await agentsStore.getAgents();
  const agentRoute = route.params.slug?.[0] as string | undefined;
  if (agentRoute) {
    const person = agentsStore.agents.find((agent) => agent.route === agentRoute);
    if (person) {
      selectedPerson.value = person;
      await openModal(person, 'default');
      return;
    }
  }
  // preload first agent
  selectedPerson.value = agentsStore.agents[0];
});
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

  .content-main {
    min-height: 700px;
    max-width: 2048px;
    margin: auto;
    background: #161622;
    box-shadow:
        1.39px 1.39px 0 0 #59596D,
        1.39px -2.09px 0 0 #1B1B2A,
        -1.39px -1.39px 0 0 #1B1B2A,
        1.39px 0 0 0 #59596D,
        0 -0.7px 0 0 #000000;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.25rem;
    padding: 1.875rem;
    margin-bottom: 1rem;
  }

  .equalizer {
    height: 120px;
    width: 430px;
  }
}

@media (max-width: 1024px) {
  section.main {
    margin: .75rem 1.25px 1.25px 1.25px;

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
    .content-main {
      padding: .75rem;
    }
  }
}
</style>
