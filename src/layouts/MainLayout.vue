<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="text-h4 q-mt-md">
          Cards Marketplace
        </q-toolbar-title>
      </q-toolbar>
      <q-toolbar>
        <q-btn v-if="authStore.isAuthenticated" flat icon="menu" aria-label="Menu" @click="toggleLeftDrawer" exact/>


        <q-btn flat label="Cartas" class="q-mr-sm" :to="{ name: 'cards' }" exact/>
        <q-btn flat label="Trocas" :to="{ name: 'home' }" exact/>
        <q-space />
        <template v-if="!authStore.isAuthenticated">
          <q-btn flat class="q-mr-sm" label="Entrar" :to="{ name: 'login' }" exact/>
          <q-btn color="white" text-color="primary" label="Registrar" :to="{ name: 'register' }" exact/>
        </template>

        <template v-else>
          <q-btn flat label="Sair" icon-right="logout" @click="handleLogout" exact/>
        </template>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="authStore.isAuthenticated"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>Menu Dashboard</q-item-label>
        <q-item clickable v-ripple :to="{ name: 'dashboard' }">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Meu Painel de Trocas</q-item-section>
        </q-item>
        <q-item clickable v-ripple :to="{ name: 'my-cards' }">
          <q-item-section avatar><q-icon name="portrait" /></q-item-section>
          <q-item-section>Meu Inventário</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from 'src/stores/auth';

  const authStore = useAuthStore();
  const router = useRouter();
  const leftDrawerOpen = ref(false);

  function toggleLeftDrawer () {
    leftDrawerOpen.value = !leftDrawerOpen.value;
  }

  async function handleLogout() {
    authStore.logout();
    await router.push({ name: 'login' });
  }
</script>
