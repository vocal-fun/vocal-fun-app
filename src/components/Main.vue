<template>
  <section class="main">
    <div class="content-header">
      <h2>Talk to realtime AI agents</h2>
      <EQ />
    </div>
    <div class="content-main">
      <Person
          @open-modal="openModal(person)"
          v-for="person in celebrities"
          :key="person.name"
          :avatar="person.avatar"
          :name="person.name"
          :twitter="person.twitter"
      />
      <Modal :isOpen="isModalOpen" @close="closeModal">
        <ModalContent :person="selectedPerson" />
      </Modal>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

import Modal from './Modal.vue';
import ModalContent from "~/components/ModalContent.vue";
import { celebrities } from '~/consts';

const isModalOpen = ref(false);
const selectedPerson = ref(null);

const openModal = (person) => {
  selectedPerson.value = person;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedPerson.value = null;
};
</script>

<style scoped>
section.main {
  margin: 37px 88px 0 88px;
  height: calc(100svh - 41px - 37px - 20px);

  .content-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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
    margin: 12px 20px 0 20px;

    .content-header {
      margin-bottom: 1rem;
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
