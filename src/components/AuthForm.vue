<template>
  <div class="col">
    <q-card flat bordered class="auth-card q-pa-lg">
      <q-card-section class="text-center">
        <div class="text-h5 text-weight-bold">{{ isLogin ? 'Entrar' : 'Criar Conta' }}</div>
        <div class="text-subtitle2 text-grey-7">
          {{ isLogin ? 'Acesse seu marketplace de cartas' : 'Cadastre-se marketplace de cartas' }}
        </div>
      </q-card-section>

      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input
          v-if="!isLogin"
          v-model="form.name"
          label="Nome Completo"
          outlined
          lazy-rules
          :rules="[val => !!val || 'O nome é obrigatório']"
        />

        <q-input
          v-model="form.email"
          type="email"
          label="E-mail"
          outlined
          lazy-rules
          :rules="[val => !!val || 'E-mail é obrigatório']"
        />

        <q-input
          v-model="form.password"
          type="password"
          label="Senha"
          outlined
          lazy-rules
          :rules="[
            val => !!val || 'Senha é obrigatória',
            val => val.length >= 6 || 'Mínimo de 6 caracteres'
          ]"
        />

        <div class="column q-gutter-y-sm">
          <q-btn
            :label="isLogin ? 'Login' : 'Registrar'"
            type="submit"
            color="primary"
            unelevated
            class="full-width"
            :loading="loading"
          />

          <q-btn
            flat
            :label="isLogin ? 'Não tem uma conta? Registre-se' : 'Já possui conta? Faça login'"
            :to="isLogin ? '/auth/register' : '/auth/login'"
            color="secondary"
            class="full-width"
          />
        </div>
      </q-form>
    </q-card>
    <q-card-section class="row justify-around">
      <q-btn flat label="Cartas" :to="{ name: 'home' }"/>
      <q-btn flat label="Trocas" :to="{ name: 'trades-market' }"/>
    </q-card-section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';

const props = defineProps<{
  mode: 'login' | 'register'
}>();

const isLogin = props.mode === 'login';
const auth = useAuthStore();
const router = useRouter();
const loading = ref(false);

const form = reactive({
  name: '',
  email: '',
  password: ''
});

async function handleSubmit() {
  loading.value = true;
  try {
    if (isLogin) {
      await auth.login({ email: form.email, password: form.password });
      await router.push({name: "dashboard"});
    } else {
      await auth.register(form);
      Notify.create({ type: 'positive', message: 'Cadastro realizado! Agora faça seu login.' });
      await router.push({ name: 'login' });
    }
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error instanceof Error ? `Ocorreu um erro: ${error.message}` : 'Ocorreu um erro'
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 450px;
}
</style>
