import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type { ICard, IPaginatedCards, ITrade, IPaginatedTrades } from 'src/types';
import { useAuthStore } from './auth';
import { Notify } from 'quasar';

export const useCardsStore = defineStore('cards', {
  state: () => ({
    cards: [] as ICard[],
    myTrades: [] as ITrade[],
    loading: false,
    hasMore: true,
    currentPage: 1,
    publicTrades: [] as ITrade[],
    publicTradesHasMore: true,
    publicTradesCurrentPage: 1,
  }),
  actions: {
    async fetchCards(page = 1, append = false) {

      if (this.cards.length > 0 && page === 1) return;

      this.loading = true;
      try {
        const pageNumber = Number(page) || 1;
        const response = await api.get<IPaginatedCards>('/cards', { params: { page: pageNumber, rpp: 10} });

        if (append) {
          this.cards = [...this.cards, ...response.data.list];
        } else {
          this.cards.push(...response.data.list);
        }

        this.currentPage = response.data.page;
        this.hasMore = response.data.more;
      } finally {
        this.loading = false;
      }
    },
    async createTrade(cardOfferId: string, cardReceivingId: string) {
      try {
        const payload = {
          cards: [
            {
              cardId: cardOfferId,
              type: 'OFFERING'
            },
            {
              cardId: cardReceivingId,
              type: 'RECEIVING'
            }
          ]
        };

        await api.post('/trades', payload);

        Notify.create({
          type: 'positive',
          message: 'Solicitação de troca enviada!',
        });

        return true;

      } catch (error) {
        console.error('Erro ao criar troca:', error);
        return false;
      }
    },
    async fetchMyTrades() {
      this.loading = true;
      const authStore = useAuthStore();
      try {
        const response = await api.get<IPaginatedTrades>('/trades', {
          params: {
            page: 1,
            rpp: 50
          }
        });
        this.myTrades = response.data.list.filter(t => t.userId === authStore.user?.id);
        console.log('Minhas trocas:', this.myTrades);
      } finally {
        this.loading = false;
      }
    },

    async deleteTrade(tradeId: string) {
      try {
        await api.delete(`/trades/${tradeId}`);

        this.myTrades = this.myTrades.filter(t => t.id !== tradeId);

        Notify.create({
          type: 'positive',
          message: 'Solicitação de troca removida com sucesso.'
        });
        return true;
      } catch {
        return false;
      }
    },

    async fetchPublicTrades(page = 1, append = false) {
      this.loading = true;
      try {
        const pageNumber = Number(page) || 1;
        const response = await api.get<IPaginatedTrades>('/trades', {
          params: {
            page: pageNumber,
            rpp: 12
          }
        });

        if (append) {
          this.publicTrades = [...this.publicTrades, ...response.data.list];
        } else {
          this.publicTrades = response.data.list;
        }

        this.publicTradesCurrentPage = response.data.page;
        this.publicTradesHasMore = response.data.more;

      } catch (error) {
        console.error('Erro ao buscar mercado de trocas:', error);
      } finally {
        this.loading = false;
      }
    }
  }

});
