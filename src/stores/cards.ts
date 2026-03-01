import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type { ICard, IPaginatedCards } from 'src/types';
import { Notify } from 'quasar';

export const useCardsStore = defineStore('cards', {
  state: () => ({
    cards: [] as ICard[],
    loading: false,
    hasMore: true,
    currentPage: 1
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
    async createTrade(cardsOffer: string[], cardsReceiving: string[]) {
      try {
        const payload = {
          cards: [
            ...cardsOffer.map(id => ({
              cardId: id,
              type: 'OFFERING'
            })),
            ...cardsReceiving.map(id => ({
              cardId: id,
              type: 'RECEIVING'
            }))
          ]
        };

        await api.post('/trades', payload);

        Notify.create({
          type: 'positive',
          message: 'Solicitação de troca enviada!',
        });

        return true;

      } catch {
        return false;
      }
    }
  }

});
