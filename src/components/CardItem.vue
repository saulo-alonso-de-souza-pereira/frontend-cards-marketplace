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

    <q-card-actions align="right" v-if="!hideAddButton">
      <q-btn
        v-if="authStore.isAuthenticated"
        flat
        color="primary"
        label="Adicionar"
        icon="add_circle"
        :loading="submitting"
        @click="handleAction"
      />
      <q-badge v-else outline color="grey-7" label="Logue para colecionar" class="q-ma-sm" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import type { ICard } from 'src/types';
  import { useAuthStore } from 'src/stores/auth';


  const props = defineProps<{
    card: ICard,
    hideAddButton?: boolean
  }>();

  const authStore = useAuthStore();
  const submitting = ref(false);

  async function handleAction() {
    submitting.value = true;
    try {
      await authStore.addCardToMe(props.card.id);
    } finally {
      submitting.value = false;
    }
  }
  </script>

  <style lang="scss" scoped>
  .card-item {
    transition: transform 0.2s ease-in-out;
    &:hover {
      transform: translateY(-4px);
    }
  }
</style>
