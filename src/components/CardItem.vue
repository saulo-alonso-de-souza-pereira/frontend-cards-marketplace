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
        flat
        color="primary"
        label="Adicionar"
        icon="add"
        @click="$emit('add', card)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import type { ICard } from 'src/types';

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
