import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth';

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some(record => record.name === 'dashboard' || record.path.includes('/dashboard'));
    const isAuthPage = to.path.startsWith('/auth');

    if (requiresAuth && !authStore.isAuthenticated) {
      next({ name: 'login' });
    } else if (isAuthPage && authStore.isAuthenticated) {
      next({ name: 'dashboard' });
    } else {
      next();
    }
  });

  return Router;
});
