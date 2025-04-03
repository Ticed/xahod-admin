import { createRouter, createWebHistory, type RouteMeta } from 'vue-router'
import DashboardLayoutVue from '@/layouts/dashboard.vue';

interface IRouteMeta {
  title: string
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard/home',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: 'Login',
      } as RouteMeta & IRouteMeta,
    },
    {
      path: '/dashboard',
      component: DashboardLayoutVue,
      redirect: '/dashboard/home',
      meta: {
        title: 'Dashboard',
      },
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/dashboard/Home.vue'),
          meta: {
            title: 'Dashboard',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: () => import('@/views/dashboard/transactions/Index.vue'),
          meta: {
            title: 'Transactions',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'transactions/:id',
          name: 'transaction_details',
          component: () => import('@/views/dashboard/transactions/Details.vue'),
          meta: {
            title: 'Transaction Details',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'trades',
          name: 'trades',
          component: () => import('@/views/dashboard/trades/Index.vue'),
          meta: {
            title: 'Trades',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'trades/:id',
          name: 'trade_details',
          component: () => import('@/views/dashboard/trades/Details.vue'),
          meta: {
            title: 'Trade Details',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'market',
          name: 'market',
          component: () => import('@/views/dashboard/market/Index.vue'),
          meta: {
            title: 'Market Overview',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: () => import('@/views/dashboard/analytics/Index.vue'),
          meta: {
            title: 'Analytics',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'user',
          name: 'user_index',
          component: () => import('@/views/dashboard/examples/user/Index.vue'),
          meta: {
            title: 'User',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'settings',
          name: 'settings_index',
          component: () => import('@/views/dashboard/settings/Index.vue'),
          meta: {
            title: 'Settings',
          } as RouteMeta & IRouteMeta
        },
      ],
    },
    {
      path: '/:pathMatch(.*)',
      name: 'not-found',
      component: () => import('@/views/404.vue'),
      meta: {
        title: 'Page Not Found',
      } as RouteMeta & IRouteMeta,
    },
  ]
});

router.beforeEach((loc) => {
  document.title = loc.meta.title as string;
})

export default router
