<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row q-col-gutter-md">
      <div class="col-12 flex justify-between items-center q-mb-md">
        <div class="text-h5 text-weight-bold text-primary">Meu Inventário</div>
        <q-btn flat round icon="refresh" :loading="loading" @click="fetchMyCards" />
      </div>

      <div v-if="!loading && myCards.length === 0" class="col-12 text-center q-pa-xl">
        <q-icon name="style" size="64px" color="grey-4" />
        <div class="text-h6 text-grey-5">Você ainda não possui cartas.</div>
        <q-btn color="primary" label="Explorar Marketplace" to="/" class="q-mt-md" />
      </div>

      <div
        v-for="card in myCards"
        :key="card.id"
        class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
      >
        <card-item :card="card" hide-add-button />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import CardItem from 'src/components/CardItem.vue';
import type { ICard, IMeResponse } from 'src/types';

const myCards = ref<ICard[]>([]);
const loading = ref(false);

const fetchMyCards = async () => {
  loading.value = true;
  try {
    const response = await api.get<IMeResponse>('/me');
    myCards.value = response.data.cards;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchMyCards);
</script>
