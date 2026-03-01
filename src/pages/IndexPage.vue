<template>
  <q-page class="q-pa-md bg-grey-1">
    <div v-if="authStore.user" class="row q-col-gutter-md">
      <div class="col-12">
        <q-card flat bordered class="bg-primary text-white">
          <q-card-section>
            <div class="text-h5 text-weight-bold">Olá, {{ authStore.user.name }}!</div>
            <div class="text-subtitle2">Gerencie sua coleção e visualize suas trocas.</div>
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
    </div>

    <div v-else class="flex flex-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from 'src/stores/auth';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.fetchMe();
});
</script>
