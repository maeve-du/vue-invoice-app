import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import InvoiceView from '@/views/InvoiceView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/invoice/:invoiceId',
    name: 'invoice',
    component: InvoiceView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
