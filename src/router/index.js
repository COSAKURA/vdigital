import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 重定向根路径到登录页面
    {
      path: '/',
      redirect: '/login',
    },
    // 登录页面
    {
      path: '/login',
      name: 'LoginView',
      component: () => import('@/views/LoginView.vue'), // 动态加载
    },
    // 注册页面
    {
      path: '/register',
      name: 'RegisterView',
      component: () => import('@/views/RegisterView.vue'), // 动态加载
    },
    // 首页
    {
      path: '/home',
      name: 'HomeView',
      component: () => import('@/views/HomeView.vue'), // 动态加载
    },
    // 申请页面
    {
      path: '/application',
      name: 'ApplicationView', 
      component: () => import('@/views/application.vue'), // 动态加载
    },
    // 作品页面
    {
      path: '/workview',
      name: 'WorkView',
      component: () => import('@/views/WorkView.vue'), // 动态加载
    },
    // 拍卖市场页面
    {
      path: '/auctionview',
      name: 'AuctionView',
      component: () => import('@/views/AuctionView.vue'), // 动态加载
    },
    // 拍品详情页面
    {
      path: '/auctionsview',
      name: 'AuctionsView',
      component: () => import('@/views/AuctionsView.vue'), // 动态加载
    },
    // 用户详情页面
    {
      path: '/userInfoView',
      name: 'UserInfoView',
      component: () => import('@/views/UserInfoView.vue'), // 动态加载
    },
    {
      path: '/AilView',
      name: 'AilView',
      component: () => import('@/views/AilView.vue'), // 动态加载
    },
    {
      path: '/BlockHashView',
      name: 'BlockHashView',
      component: () => import('@/views/BlockHashView.vue'), // 动态加载
    },
    {
      path: '/TransactionInfoView',
      name: 'TransactionInfoView',
      component: () => import('@/views/TransactionInfoView.vue'), // 动态加载
    },
  ],                       
});

export default router;
