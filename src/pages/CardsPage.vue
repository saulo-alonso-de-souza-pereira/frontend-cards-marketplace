<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="text-h4 text-weight-bold text-secondary q-my-none">Cartas</h1>
        <p class="text-subtitle1 text-grey-7 q-mt-sm">Explore todas cartas do catálogo.</p>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          round
          icon="refresh"
          :loading="cardsStore.loading"
          @click="refreshCards"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <template v-if="cardsStore.loading && cardsStore.cards.length === 0">
        <div v-for="n in 8" :key="n" class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-card flat bordered>
            <q-skeleton height="250px" square />
            <q-card-section>
              <q-skeleton type="text" width="50%" />
              <q-skeleton type="text" />
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template v-else>
        <div
          v-for="card in cardsStore.cards"
          :key="card.id"
          class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
        >
          <card-item :card="card" />
        </div>
      </template>

      <div v-if="cardsStore.hasMore" class="col-12 flex justify-center q-mt-lg">
        <q-btn
          outline
          label="Carregar mais cartas"
          color="primary"
          :loading="cardsStore.loading"
          @click="loadMore"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useCardsStore } from 'src/stores/cards';
  import CardItem from 'src/components/CardItem.vue';

  const cardsStore = useCardsStore();

  onMounted(async () => {
    try {
      await cardsStore.fetchCards();
    } catch {
      // Silencia o erro
    }
  });

  const refreshCards = async () => {

    try {
      await cardsStore.fetchCards(1);
    } catch {
      // Silencia o erro
    }
  };

  const loadMore = async () => {
    try {
      await cardsStore.fetchCards(cardsStore.currentPage + 1);
    } catch {
      // Silencia o erro
    }
  };

</script>
