<template>
  <section class="main">
    <div class="content-header">
      <h2>Talk to realtime AI agents</h2>
      <EQ />
    </div>
    <div class="content-main">
      <Person
        v-for="person in celebrities"
        :key="person.name"
        :name="person.name"
        :display-name="person.displayName"
        :twitter="person.twitter"
        :img-format="person.imgFormat"
        @open-modal="openModal(person)"
      />
      <Modal v-if="selectedPerson" :isOpen="isModalOpen" @close="closeModal">
        <ModalContent :person="selectedPerson" @close="closeModal" />
      </Modal>
    </div>
  </section>
</template>

<script setup lang="ts">
import { celebrities } from '~/consts';
import type { CelebrityItem } from '~/types';

const isModalOpen = ref<boolean>(false);
const selectedPerson = ref<CelebrityItem | null>(null);

const openModal = (person: CelebrityItem) => {
  selectedPerson.value = person;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedPerson.value = null;
};
</script>

<style scoped lang="scss">
section.main {
  margin: 37px 88px 0 88px;

  .content-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .content-main {
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
    gap: 15px;
    padding: 30px;
  }

  .equalizer {
    height: 120px;
    width: 500px;
  }
}

@media (max-width: 1024px) {
  section.main {
    margin: 12px 20px 20px 20px;

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
      padding: 12px;
    }
  }
}
</style>
