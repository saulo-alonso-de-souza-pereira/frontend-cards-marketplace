<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="text-h4 text-weight-bold text-secondary q-my-none">Mercado de Trocas</h1>
        <p class="text-subtitle1 text-grey-7 q-mt-sm">Explore as cartas que outros jogadores estão trocando.</p>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          round
          icon="refresh"
          @click="refreshPublicTradeCards"
          :loading="cardsStore.loading"
          color="primary"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md" v-if="cardsStore.publicTrades.length > 0">
      <div
        v-for="trade in cardsStore.publicTrades"
        :key="trade.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <q-card class="full-height flex column justify-between" flat bordered>
          <q-list class="q-py-sm">
            <TradeCards :trade="trade" readonly @shoppingCart="handleShoppingCart" />
          </q-list>
        </q-card>
      </div>
    </div>

    <div v-if="cardsStore.publicTradesHasMore" class="row justify-center q-mt-xl">
      <q-btn
        outline
        color="primary"
        label="Carregar mais trocas"
        :loading="cardsStore.loading"
        @click="loadMore"
      />
    </div>

    <div v-else-if="!cardsStore.loading && cardsStore.publicTrades.length === 0" class="flex flex-center q-pa-xl column text-grey-6">
      <q-icon name="swap_horizontal_circle" size="80px" class="q-mb-md" />
      <div class="text-h6">Nenhuma troca disponível no momento.</div>
    </div>

    <div v-if="cardsStore.loading && cardsStore.publicTrades.length === 0" class="flex flex-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useCardsStore } from 'src/stores/cards';
  import TradeCards from 'src/components/TradeCards.vue';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();
  const cardsStore = useCardsStore();

  const handleShoppingCart = (id: string) => {
    $q.dialog({
      title: 'Troca adicionada',
      message: `Troca ${id} foi adicionada ao seu carrinho.`,
      cancel: true
    })
  };

  const refreshPublicTradeCards = async () => {

    try {
      await cardsStore.fetchPublicTrades(1, false, true);
    } catch {
      return false;
    }
  };

  onMounted(async () => {
    await cardsStore.fetchPublicTrades(1, false, false);
  });

  const loadMore = async () => {
    const nextPage = cardsStore.publicTradesCurrentPage + 1;
    await cardsStore.fetchPublicTrades(nextPage, true, false);
  };
</script>
