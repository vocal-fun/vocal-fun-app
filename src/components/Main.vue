<template>
  <section class="main">
    <div class="content-header">
      <h2>Talk to realtime AI agents</h2>
      <EQ />
    </div>
    <div class="content-main">
      <Person
        v-for="person in agents"
        :key="person.name"
        :name="person.name"
        :twitter="person.twitter"
        :image="person.image"
        :_id="person._id"
        :rate="person.rate"
        :disabled="modalLoading"
        @open-modal="openModal(person, $event)"
      />
      <Modal :isOpen="isModalOpen" @close="closeModal">
        <ModalContent ref="modalContent" :person="selectedPerson" @close="closeModal" />
      </Modal>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AgentDto, OpenModalState } from '~/types';

const modalContent = useTemplateRef('modalContent');
const agentsStore = useAgentsStore();

const modalLoading = ref<boolean>(false);
const isModalOpen = ref<boolean>(false);
const selectedPerson = ref<AgentDto | undefined>(undefined);

const agents = computed(() => agentsStore.agents);

const openModal = async (person: AgentDto, state: OpenModalState) => {
  // modalLoading.value = true;
  selectedPerson.value = person;
  modalContent.value?.onOpen(state); // TODO: await modalContent.value?.onOpen(state); if need to wait
  isModalOpen.value = true;
  // modalLoading.value = false;
};

const closeModal = () => {
  isModalOpen.value = false;
  modalContent.value?.hangUp();
};

onBeforeMount(async () => {
  await agentsStore.getAgents();
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
