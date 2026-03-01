<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row q-col-gutter-lg">
      <div class="col-12 flex justify-between items-center">
        <div class="text-h5 text-weight-bold">Nova Solicitação de Troca</div>
        <q-btn flat icon="arrow_back" label="Voltar" :to="{ name: 'dashboard' }" />
      </div>

      <div class="col-12 col-md-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="bg-primary text-white">
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
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">Cartas Desejadas</div>
            <div class="text-caption">Selecione as cartas que deseja receber</div>
          </q-card-section>

          <q-card-section class="q-pa-none scroll" style="max-height: 60vh">
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
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 flex justify-center q-mt-md">
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

  onMounted(async () => {
    await authStore.fetchMe();
    await cardsStore.fetchCards();
  });
</script>
