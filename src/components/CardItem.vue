<template>
  <q-card class="card-item no-shadow bordered full-height column">
    <q-img
      :src="card.imageUrl"
      :ratio="1"
      class="rounded-borders"
      fit="contain"
    >
      <template v-slot:loading>
        <q-spinner-oval color="primary" />
      </template>
    </q-img>

    <q-card-section class="col">
      <div class="text-subtitle1 text-weight-bold ellipsis-2-lines">{{ card.name }}</div>
      <div class="text-caption text-grey-8 q-mt-sm ellipsis-3-lines">
        {{ card.description }}
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn
        v-if="authStore.isAuthenticated"
        flat
        color="primary"
        label="Adicionar à Conta"
        icon="add_circle"
        @click="$emit('add', card)"
      />
      <q-badge v-else outline color="grey-7" label="Logue para colecionar" class="q-ma-sm" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import type { ICard } from 'src/types';
  import { useAuthStore } from 'src/stores/auth';
  const authStore = useAuthStore();

  defineProps<{
    card: ICard
  }>();

  defineEmits<{
    (e: 'add', card: ICard): void
  }>();
  </script>

  <style lang="scss" scoped>
  .card-item {
    transition: transform 0.2s ease-in-out;
    &:hover {
      transform: translateY(-4px);
    }
  }
</style>
