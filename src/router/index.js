import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import application from '../views/application.vue'
import WorkView from '../views/WorkView.vue'
import AuctionView from '../views/AuctionView.vue'
import AuctionsView from '../views/AuctionsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LoginView',
      component: LoginView,
    },
    { path: '/register',
      name: 'RegisterView',
      component:RegisterView,
    },
    { path: '/home',
      name: 'HomeView',
      component:HomeView,
    },
    { path: '/application',
      name: 'application',
      component:application,
    },
    { path: '/WorkView',
      name: 'WorkView',
      component:WorkView,
    },
    { path: '/AuctionView',
      name: 'AuctionView',
      component:AuctionView,
    },
    { path: '/AuctionsView',
      name: 'AuctionsView',
      component:AuctionsView,
    }

    
]})


export default router
