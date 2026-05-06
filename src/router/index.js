import { useAuthStores } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LandingView from '@/views/LandingView.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegitsterView.vue'
import ProfileDetailsView from '../views/ProfileDetailsView.vue'
import MyProfileView from '../views/ProfileView.vue'
import MessagePanelView from '@/views/MessagePanelView.vue'
import PrivacySecurityView from '@/views/PrivacySecurityView.vue'

// Public routes (no auth needed)
const publicRoutes = ['login', 'register', 'landing', 'forget-password', 'verify-otp', 'reset-password']

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }, 
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/forget-password',
      name: 'forget-password',
      component: () => import('@/views/Auth/Forgetpw.vue'),
    },
    {
      path: '/verify-otp',
      name: 'verify-otp',
      component: () => import('@/views/Auth/VerifyOtp.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/Auth/ResetPassword.vue'),
    },
    {
      path: '/landing',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/profileDetail',
      name: 'profileDetail',
      component: ProfileDetailsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/:id',
      name: 'profileById',
      component: () => import('@/views/ProfileDetailsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: MyProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/editProfile',
      name: 'editProfile',
      component: () => import('@/views/Editprofileinfoview.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/editEducation',
      name: 'editEducation',
      component: () => import('@/views/Editeducationview.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/editProject',
      name: 'editProject',
      component: () => import('@/views/Editprojectview.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/create-post',
      name: 'CreatePost',
      component: () => import('@/views/CreatePostView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/messages',
      name: 'messages',
      component: MessagePanelView,
      meta: { requiresAuth: true },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacySecurityView,
      meta: { requiresAuth: true },
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/HelpView.vue'),
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FaqView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/ForbiddenView.vue'),
    },
  ],
})


router.beforeEach((to) => {
  const auth = useAuthStores()

  // If route requires auth and user is not logged in → redirect to login
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login' }
  }

  // If user is already logged in and tries to access login/register → redirect to home
  if (auth.isLoggedIn && publicRoutes.includes(to.name)) {
    return { name: 'home' }
  }

  return true
})

export default router
