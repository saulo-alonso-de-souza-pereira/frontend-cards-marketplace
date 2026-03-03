<template>
  <q-page class="q-pa-md bg-grey-1">
    <div v-if="authStore.user" class="row q-col-gutter-md">
      <div class="col-12">
        <q-card flat bordered class="text-secondary">
          <q-item>
            <q-item-section>
              <q-item-label class="text-h5 text-bold">Olá, {{ authStore.user.name }}!</q-item-label>
              <q-item-label class="text-subtitle2 text-grey-7">Gerencie seu inventário e solicitações de troca.</q-item-label>
            </q-item-section>
            <q-card-actions align="right">
              <q-btn icon="add" color="info" label="nova troca" :to="{ name: 'new-trade' }" />
            </q-card-actions>
          </q-item>
        </q-card>
      </div>

      <div class="col-12">
        <q-card flat bordered class="full-height">
          <q-item>
            <q-item-section avatar>
              <q-icon name="style" color="primary" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6">{{ authStore.myCards.length }}</q-item-label>
              <q-item-label caption>Cartas na sua conta</q-item-label>
            </q-item-section>
            <q-card-actions align="right">
              <q-btn icon="style" color="info" label="Ver Inventário" :to="{ name: 'my-cards' }" />
            </q-card-actions>
          </q-item>
        </q-card>
      </div>

      <div class="col-12">
        <q-card id="my-trades-card" flat bordered>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-weight-bold text-grey-8">Minhas Solicitações de Troca</div>
            <q-space />
            <q-btn flat round icon="refresh" @click="cardsStore.fetchMyTrades()" :loading="cardsStore.loading" />
          </q-card-section>

          <q-card-section>
            <q-list v-if="cardsStore.myTrades.length > 0">
              <TradeCard
                v-for="trade in cardsStore.myTrades"
                :key="trade.id"
                :trade="trade"
                @delete="confirmDelete"
              />
            </q-list>

          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-else class="flex flex-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useCardsStore } from 'src/stores/cards';
import { useQuasar } from 'quasar';
import TradeCard from 'src/components/TradeCards.vue';

const $q = useQuasar();
const authStore = useAuthStore();
const cardsStore = useCardsStore();


const confirmDelete = (id: string) => {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: 'Deseja realmente cancelar esta solicitação de troca?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    void cardsStore.deleteTrade(id);
  });
};

onMounted(async () => {
  await Promise.all([
    authStore.fetchMe(),
    cardsStore.fetchMyTrades()
  ]);
});
</script>
