import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type { IUser, ILoginResponse } from 'src/types';
import { useCardsStore } from './cards';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as IUser | null,
    token: localStorage.getItem('token') || '',
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials: Record<string, string>) {
      const response = await api.post<ILoginResponse>('/login', credentials);
      this.token = response.data.token;
      this.user = response.data.user;
      localStorage.setItem('token', this.token);
    },
    async register(userData: Record<string, string>) {
      await api.post('/register', userData);
    },
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      const cardsStore = useCardsStore();
      cardsStore.$reset();
    }
  }
});
