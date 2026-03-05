import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type { ICard, IPaginatedCards, ITrade, IPaginatedTrades } from 'src/types';
import { useAuthStore } from './auth';
import { Notify } from 'quasar';


const CACHE_TTL = 300000; // 5 minutos

export const useCardsStore = defineStore('cards', {
  state: () => ({

    cards: [] as ICard[],
    hasMore: true,
    currentPage: 1,
    cardsLastFetch: 0,


    myTrades: [] as ITrade[],
    myTradesLastFetch: 0,


    publicTrades: [] as ITrade[],
    publicTradesHasMore: true,
    publicTradesCurrentPage: 1,
    publicTradesLastFetch: 0,

    loading: false,
  }),

  actions: {

    async fetchCards(page = 1, append = false, forceRefresh = false) {
      const now = Date.now();


      if (!append && !forceRefresh && this.cards.length > 0 && (now - this.cardsLastFetch < CACHE_TTL)) {
        return;
      }

      this.loading = true;
      try {
        const pageNumber = Number(page) || 1;
        const response = await api.get<IPaginatedCards>('/cards', {
          params: { page: pageNumber, rpp: 10 }
        });

        if (append) {
          this.cards = [...this.cards, ...response.data.list];
        } else {
          this.cards = response.data.list;
          this.cardsLastFetch = Date.now();
        }

        this.currentPage = response.data.page;
        this.hasMore = response.data.more;
      } finally {
        this.loading = false;
      }
    },

    async fetchPublicTrades(page = 1, append = false, forceRefresh = false) {
      const now = Date.now();

      if (!append && !forceRefresh && this.publicTrades.length > 0 && (now - this.publicTradesLastFetch < CACHE_TTL)) {
        return;
      }

      this.loading = true;
      try {
        const pageNumber = Number(page) || 1;
        const response = await api.get<IPaginatedTrades>('/trades', {
          params: { page: pageNumber, rpp: 12 }
        });

        if (append) {
          this.publicTrades = [...this.publicTrades, ...response.data.list];
        } else {
          this.publicTrades = response.data.list;
          this.publicTradesLastFetch = Date.now();
        }

        this.publicTradesCurrentPage = response.data.page;
        this.publicTradesHasMore = response.data.more;

      } catch {
        return false;
      } finally {
        this.loading = false;
      }
    },

    async fetchMyTrades(forceRefresh = false) {
      const now = Date.now();
      const authStore = useAuthStore();

      if (!forceRefresh && this.myTrades.length > 0 && (now - this.myTradesLastFetch < CACHE_TTL)) {
        return;
      }

      this.loading = true;
      try {
        const response = await api.get<IPaginatedTrades>('/trades', {
          params: { page: 1, rpp: 50 }
        });

        this.myTrades = response.data.list.filter(t => t.userId === authStore.user?.id);
        this.myTradesLastFetch = Date.now();

      } finally {
        this.loading = false;
      }
    },

    async createTrade(cardOfferId: string, cardReceivingId: string) {
      try {
        const payload = {
          cards: [
            { cardId: cardOfferId, type: 'OFFERING' },
            { cardId: cardReceivingId, type: 'RECEIVING' }
          ]
        };

        await api.post('/trades', payload);

        Notify.create({ type: 'positive', message: 'Solicitação de troca enviada!' });

        this.myTradesLastFetch = 0;
        this.publicTradesLastFetch = 0;

        return true;
      } catch {
        return false;
      }
    },

    async deleteTrade(tradeId: string) {
      try {
        await api.delete(`/trades/${tradeId}`);

        this.myTrades = this.myTrades.filter(t => t.id !== tradeId);

        this.publicTradesLastFetch = 0;

        Notify.create({ type: 'positive', message: 'Solicitação de troca removida com sucesso.' });
        return true;
      } catch {
        return false;
      }
    }
  }
});
