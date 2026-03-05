import { boot } from 'quasar/wrappers';
import axios from 'axios';
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse
} from 'axios';
import { Notify } from 'quasar';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

interface ApiErrorResponse {
  message?: string;
}

const api: AxiosInstance = axios.create({
  baseURL: 'https://cards-marketplace-api.onrender.com/',
  timeout: 15000,
});

export default boot(({ app }) => {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = localStorage.getItem('token');

      if (token !== null && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: unknown) => {
      return Promise.reject(error as Error)
    }
  );

  api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    (error: AxiosError<ApiErrorResponse>) => {
      let message = 'Ocorreu um erro inesperado';

      if (error.response) {
        if (error.response.status === 401) {
          message = 'Sessão expirada. Por favor, faça login novamente.';
          localStorage.removeItem('token');
        } else {
          message = error.response.data?.message ?? 'Erro na comunicação com o servidor';
        }
      } else if (error.request) {
        message = 'O servidor está demorando a responder (hibernação).';
      }

      Notify.create({
        type: 'negative',
        message,
      });

      return Promise.reject(error as Error);
    }
  );

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
