import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserView from '../views/UserView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import Layout from '../views/Layout.vue'
import BookView from '../views/BookView.vue'
import BookType from '../views/BookType.vue'
import Role from '../views/Role.vue'
import AuditView from '../views/AuditView.vue'
import HotelView from '@/views/HotelView.vue'
import ReserveView from '../views/ReserveView.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'home',
        component: HomeView
      },
      {
        path: '/user',
        name: 'user',
        component: UserView
      },
      {
        path: '/book',
        name: 'book',
        component: BookView
      },
      {
        path: '/bookType',
        name: 'bookType',
        component: BookType
      },
      {
        path: '/role',
        name: 'role',
        component: Role
      },
      {
        path: '/audit',
        name: 'audit',
        component: AuditView
      },
      {
        path: '/hotel',
        name: 'hotel',
        component: HotelView
      },
      {
        path: '/reserve',
        name: 'reserve',
        component: ReserveView
      },
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView 
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView 
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  console.log('全局前置守卫',to.name)
  // 如果目标路由不是登录页或注册页
  if (to.name !== 'login' && to.name !== 'register') {
    // 检查是否有用户信息
    const user = localStorage.getItem("user");
    if (!user) {
      // 如果没有用户信息，重定向到登录页
      next({ name: 'login' });
    } else {
      // 如果有用户信息，继续导航
      next();
    }
  } else {
    // 如果目标路由是登录页或注册页，继续导航
    next();
  }
});

export default router
