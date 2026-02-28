import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type { ICard, IPaginatedCards } from 'src/types';

export const useCardsStore = defineStore('cards', {
  state: () => ({
    cards: [] as ICard[],
    loading: false,
    hasMore: true,
    currentPage: 1
  }),
  actions: {
    async fetchCards(page = 1) {

      if (this.cards.length > 0 && page === 1) return;

      this.loading = true;
      try {
        const pageNumber = Number(page) || 1;
        const response = await api.get<IPaginatedCards>('/cards', { params: { page: pageNumber, rpp: 10} });
        console.log('Resposta da API:', response.data);
        if (page === 1) {
          this.cards = response.data.list;
        } else {
          this.cards.push(...response.data.list);
        }
        this.hasMore = response.data.more;
        this.currentPage = response.data.page;
      } finally {
        this.loading = false;
      }
    }
  }
});
