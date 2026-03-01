import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import type { IUser, ILoginResponse, ICard, IMeResponse } from 'src/types';
import { useCardsStore } from './cards';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as IUser | null,
    token: localStorage.getItem('token') || '',
    myCards: [] as ICard[],
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
    },
    async addCardToMe(cardId: string) {
      try {
        await api.post('/me/cards', {
          cardIds: [cardId]
        });
        console.log('Carta adicionada ao inventário do usuário ', cardId);

        Notify.create({
          message: `Carta adicionada ao seu inventário!`,
          color: 'positive',
          icon: 'check_circle'
        });

        return true;
      } catch {
        return false;
      }
    },
    async fetchMe() {
      try {
        const response = await api.get<IMeResponse>('/me');
        this.user = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email
        };
        this.myCards = response.data.cards;
      } catch {
        return false;
      }
    },
  }
});
