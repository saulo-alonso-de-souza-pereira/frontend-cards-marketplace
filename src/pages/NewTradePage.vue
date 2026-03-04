<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row q-col-gutter-lg">
      <div class="col-12 flex justify-between items-center">
        <div class="text-h5 text-weight-bold text-secondary">Nova Solicitação de Troca</div>
        <q-btn flat icon="arrow_back" label="Voltar" :to="{ name: 'dashboard' }" />
      </div>

      <div class="col-12 col-md-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="bg-white text-primary">
            <div class="text-h6">Minhas Cartas (Oferta)</div>
            <div class="text-caption">Selecione as cartas que deseja oferecer</div>
          </q-card-section>

          <q-card-section class="q-pa-none scroll" style="max-height: 60vh">
            <q-list separator>
              <q-item v-for="card in authStore.myCards" :key="card.id" tag="label" v-ripple>
                <q-item-section side>
                  <q-checkbox v-model="form.cardsOffer" :val="card.id" />
                </q-item-section>
                <q-item-section avatar>
                  <q-avatar rounded size="48px">
                    <img :src="card.imageUrl">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ card.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="bg-white text-secondary">
            <div class="text-h6">Cartas Desejadas</div>
            <div class="text-caption">Role para carregar mais cartas</div>
          </q-card-section>

          <q-card-section class="q-pa-none scroll" style="max-height: 60vh">
            <q-infinite-scroll @load="onLoadMoreCards" :offset="250" :disable="!cardsStore.hasMore">
              <q-list separator>
                <q-item v-for="card in cardsStore.cards" :key="card.id" tag="label" v-ripple>
                  <q-item-section side>
                    <q-checkbox v-model="form.cardsReceiving" :val="card.id" />
                  </q-item-section>
                  <q-item-section avatar>
                    <q-avatar rounded size="48px">
                      <img :src="card.imageUrl">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ card.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <template v-slot:loading>
                <div class="row justify-center q-my-md">
                  <q-spinner-dots color="secondary" size="40px" />
                </div>
              </template>
            </q-infinite-scroll>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 flex justify-center">
        <q-btn
          color="positive"
          size="lg"
          label="Enviar Proposta de Troca"
          icon="swap_horiz"
          :loading="submitting"
          :disabled="!canSubmit"
          @click="submitTrade"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from 'src/stores/auth';
  import { useCardsStore } from 'src/stores/cards';

  const authStore = useAuthStore();
  const cardsStore = useCardsStore();
  const router = useRouter();

  const submitting = ref(false);
  const form = ref({
    cardsOffer: [] as string[],
    cardsReceiving: [] as string[]
  });

  const canSubmit = computed(() =>
    form.value.cardsOffer.length > 0 && form.value.cardsReceiving.length > 0
  );

  async function submitTrade() {
    submitting.value = true;
    const success = await cardsStore.createTrade(form.value.cardsOffer, form.value.cardsReceiving);
    if (success) {
      await router.push({ name: 'dashboard' });
    }
    submitting.value = false;
  }

  async function onLoadMoreCards(index: number, done: (stop?: boolean) => void) {
    if (cardsStore.hasMore) {
      await cardsStore.fetchCards(cardsStore.currentPage + 1, true);
      done(!cardsStore.hasMore);
    } else {
      done(true);
    }
  }

  onMounted(async () => {
    await authStore.fetchMe();
    await cardsStore.fetchCards(1, false);
  });
</script>
