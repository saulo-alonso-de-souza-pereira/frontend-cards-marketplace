<template>
  <q-item :class="`${props.readonly ? 'q-py-md' : 'q-py-md trade-item-container'}`">
    <q-item-section>
      <div class="row items-center justify-center q-gutter-md">

        <div class="column items-center">
          <q-img
            :src="offeringCard?.card.imageUrl"
            class="rounded-borders shadow-2"
            fit="contain"
            :width="$q.screen.lt.md ? '60px' : '120px'"
          >
            <q-tooltip anchor="center left" self="center left" :offset="[80, 10]" class="bg-accent text-primary">
              {{ offeringCard?.card.name }}
            </q-tooltip>
          </q-img>
          <q-badge color="info" label="OFFERING" class="q-mt-sm" />
        </div>

        <div class="column items-center">
          <q-icon name="swap_horizontal_circle" color="secondary" :size="$q.screen.lt.md ? 'sm' : 'md'" />
        </div>

        <div class="column items-center">
          <q-img
            :src="receivingCard?.card.imageUrl"
            class="rounded-borders shadow-2"
            fit="contain"
            :width="$q.screen.lt.md ? '60px' : '120px'"
          >
            <q-tooltip anchor="center right" self="center right" :offset="[80, 10]" class="bg-accent text-primary">
              {{ receivingCard?.card.name }}
            </q-tooltip>
          </q-img>
          <q-badge color="secondary" label="RECEIVING" class="q-mt-sm" />
        </div>

      </div>
    </q-item-section>

    <q-item-section side v-if="!readonly">
      <q-btn flat round color="negative" icon="delete" @click="$emit('delete', trade.id)" :size="$q.screen.lt.md ? 'sm' : 'md'">
        <q-tooltip>Cancelar Troca</q-tooltip>
      </q-btn>
    </q-item-section>

    <q-item-section side v-if="readonly && authStore.isAuthenticated">
      <q-btn flat round color="info" icon="shopping_cart" @click="$emit('shoppingCart', trade.id)" :size="$q.screen.lt.md ? 'sm' : 'md'">
        <q-tooltip>Adicionar ao Carrinho</q-tooltip>
      </q-btn>
    </q-item-section>

  </q-item>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useAuthStore } from 'src/stores/auth';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();

  const authStore = useAuthStore();
  const props = defineProps<{
    trade: {
      id: string;
      tradeCards: Array<{
        id: string;
        type: 'OFFERING' | 'RECEIVING';
        card: {
          imageUrl: string,
          name: string
        };
      }>;
    };
    readonly?: boolean;
  }>();


  defineEmits(['delete', 'shoppingCart']);

  const offeringCard = computed(() =>
    props.trade.tradeCards.find(tc => tc.type === 'OFFERING')
  );

  const receivingCard = computed(() =>
    props.trade.tradeCards.find(tc => tc.type === 'RECEIVING')
  );

</script>

<style scoped lang="scss">
  .trade-item-container {
    border-bottom: 1px solid $secondary;
  }
</style>
