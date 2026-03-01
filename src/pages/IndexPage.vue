<template>
  <q-page class="q-pa-md bg-grey-1">
    <div v-if="authStore.user" class="row q-col-gutter-md">
      <div class="col-12">
        <q-card flat bordered class="bg-primary text-white">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-h5 text-weight-bold">Olá, {{ authStore.user.name }}!</div>
              <div class="text-subtitle2 text-grey-4">Gerencie seu inventário e solicitações de troca.</div>
            </div>
            <div class="col-auto">
              <q-btn
                color="white"
                text-color="primary"
                round
                icon="add"
                :to="{ name: 'new-trade' }"
              >
                <q-tooltip>Nova Troca</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="full-height">
          <q-item>
            <q-item-section avatar>
              <q-icon name="style" color="primary" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6">{{ authStore.myCards.length }}</q-item-label>
              <q-item-label caption>Cartas na sua conta</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat color="primary" label="Ver Inventário" :to="{ name: 'my-cards' }" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-weight-bold text-grey-8">Minhas Solicitações de Troca</div>
            <q-space />
            <q-btn flat round icon="refresh" @click="cardsStore.fetchMyTrades()" :loading="cardsStore.loading" />
          </q-card-section>

          <q-card-section>
            <q-list separator v-if="cardsStore.myTrades.length > 0">
              <q-item v-for="trade in cardsStore.myTrades" :key="trade.id" class="q-py-md">
                <q-item-section avatar>
                  <q-icon name="swap_horizontal_circle" color="secondary" size="md" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-medium">
                    Troca #{{ trade.id.split('-')[0] }}
                  </q-item-label>
                  <q-item-label caption>
                    Criada em: {{ new Date(trade.createdAt).toLocaleDateString() }}
                  </q-item-label>
                  <div class="row q-gutter-xs q-mt-xs" v-if="trade.cards">
                    <q-badge color="positive" label="Oferta">
                      {{ countType(trade, 'OFFERING') }}
                    </q-badge>
                    <q-badge color="orange" label="Desejo">
                      {{ countType(trade, 'RECEIVING') }}
                    </q-badge>
                  </div>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete"
                    @click="confirmDelete(trade.id)"
                  >
                    <q-tooltip>Cancelar Troca</q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>

            <div v-else class="text-center q-pa-xl text-grey-5">
              <q-icon name="history" size="48px" />
              <div>Nenhuma troca ativa no momento.</div>
              <q-btn flat color="primary" label="Criar Proposta" :to="{ name: 'new-trade' }" class="q-mt-sm" />
            </div>
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
import type { ITrade } from 'src/types';

const $q = useQuasar();
const authStore = useAuthStore();
const cardsStore = useCardsStore();

const countType = (trade: ITrade, type: 'OFFERING' | 'RECEIVING') => {
  return trade.cards?.filter(c => c.type === type).length || 0;
};

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
