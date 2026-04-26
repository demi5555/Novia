<template>
  <aside :class="['novia-sidebar', { 'is-open': isOpen, 'is-mobile': !isDesktop }]">
    
    <!-- Overlay (Mobile) -->
    <div v-if="isOpen && !isDesktop" class="sidebar-overlay" @click="$emit('close')"></div>

    <div class="sidebar-content">

      <!-- Mobile Header -->
      <div class="sidebar-mobile-header">
        <div class="brand-sm">
          <i class="bi bi-hexagon-fill"></i>
          <span>Novia</span>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">

        <!-- Main -->
        <div class="nav-group">
          <span class="nav-label">Main Menu</span>
          <ul>
            <li v-for="item in menuItems" :key="item.key">
              <router-link
                :to="item.to"
                class="nav-link"
                :class="{ active: activeItem === item.key }"
                @click="setActive()"
              >
                <span class="link-icon">
                  <i :class="['bi', item.icon]"></i>
                </span>
                <span class="link-text">{{ item.label }}</span>
                <span v-if="activeItem === item.key" class="active-indicator"></span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Settings -->
        <div class="nav-group">
          <span class="nav-label">Settings</span>
          <ul>
            <li v-for="item in settingsItems" :key="item.key">
              <router-link
                :to="item.to"
                class="nav-link"
                :class="{ active: activeItem === item.key }"
                @click="setActive()"
              >
                <span class="link-icon">
                  <i :class="['bi', item.icon]"></i>
                </span>
                <span class="link-text">{{ item.label }}</span>
                <span v-if="activeItem === item.key" class="active-indicator"></span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Help & Info -->
        <div class="nav-group">
          <span class="nav-label">Help & Info</span>
          <ul>
            <li v-for="item in helpItems" :key="item.key">
              <router-link
                :to="item.to"
                class="nav-link"
                :class="{ active: activeItem === item.key }"
                @click="setActive()"
              >
                <span class="link-icon">
                  <i :class="['bi', item.icon]"></i>
                </span>
                <span class="link-text">{{ item.label }}</span>
                <span v-if="activeItem === item.key" class="active-indicator"></span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Logout -->
        <div class="nav-group bottom">
          <span class="nav-label">Account</span>
          <button class="nav-link logout" @click="handleLogout">
            <span class="link-icon">
              <i class="bi bi-box-arrow-left"></i>
            </span>
            <span class="link-text">Log Out</span>
          </button>
        </div>

      </nav>
    </div>
  </aside>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStores } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const auth = useAuthStores()
const router = useRouter()
const route  = useRoute()

const windowWidth = ref(window.innerWidth)
const isDesktop = computed(() => windowWidth.value >= 992)

/* Menu */
const menuItems = [
  { key: 'home',     label: 'Home',    icon: 'bi-house-door', to: '/' },
  { key: 'messages', label: 'Message', icon: 'bi-chat-dots',  to: '/messages' },
]

const settingsItems = [
  { key: 'settings', label: 'Settings',          icon: 'bi-gear',         to: '/settings' },
  { key: 'privacy',  label: 'Privacy & Security', icon: 'bi-shield-check', to: '/privacy' },
]

const helpItems = [
  { key: 'about', label: 'About Novia', icon: 'bi-info-circle',    to: '/about' },
  { key: 'faq',   label: 'FAQ',         icon: 'bi-question-circle', to: '/faq' },
  { key: 'help',  label: 'Help Center', icon: 'bi-life-preserver',  to: '/help' },
]

const allItems = [...menuItems, ...settingsItems, ...helpItems]

/* Derive active key directly from the current route — no manual tracking */
const activeItem = computed(() => {
  const match = allItems.find(item => item.to === route.path)
  return match?.key ?? ''
})

/* On mobile, close the drawer after navigation */
const setActive = () => {
  if (!isDesktop.value) emit('close')
}

const handleLogout = async () => {
  try {
    await auth.logout()
  } catch {
    // even if the API call fails, clear local state
    localStorage.removeItem('token')
  }
  router.push('/login')
}

/* Resize listener */
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

/* Lock body scroll on mobile */
watch(() => props.isOpen, (val) => {
  if (!isDesktop.value) {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})
</script>
<style scoped>
.novia-sidebar {
  width: 260px;
  height: calc(100vh - 70px);
  position: fixed;
  left: 0;
  top: 70px;
  background: rgba(255, 255, 255, 0.98);
  border-right: 1px solid #e2e8f0;
  z-index: 1020;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

/* Mobile Styles */
.novia-sidebar.is-mobile {
  transform: translateX(-100%);
  top: 0;
  height: 100vh;
  z-index: 1040;
  background: white;
}

.novia-sidebar.is-mobile.is-open {
  transform: translateX(0);
}

.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  overflow-y: auto;
}

/* Mobile Header */
.sidebar-mobile-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

@media (max-width: 991px) {
  .sidebar-mobile-header {
    display: flex;
  }
}

.brand-sm {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.brand-sm i {
  color: #6366f1;
  font-size: 1.5rem;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
  transform: rotate(90deg);
}

/* Navigation */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.nav-group {
  margin-bottom: 2rem;
}

.nav-group.bottom {
  margin-top: auto;
  margin-bottom: 0;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
}

.nav-label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-left: 1rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.nav-link:hover {
  background: #f8fafc;
  color: #6366f1;
  transform: translateX(4px);
}

.nav-link.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3);
}

.link-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.nav-link:hover .link-icon {
  background: rgba(99, 102, 241, 0.1);
}

.nav-link.active .link-icon {
  background: rgba(255, 255, 255, 0.2);
}

.link-text {
  flex: 1;
  font-size: 0.95rem;
}

.active-indicator {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

/* Logout */
.nav-link.logout {
  color: #ef4444;
}

.nav-link.logout:hover {
  background: #fef2f2;
  color: #dc2626;
}

.nav-link.logout .link-icon {
  background: #fef2f2;
}
/* Overlay */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1030;
}

/* Fix mobile header always hidden on desktop */
.sidebar-mobile-header {
  display: none;
}

@media (max-width: 991px) {
  .sidebar-mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
  }
}

/* Better sidebar layering */
.novia-sidebar {
  z-index: 1040;
}

/* Improve button reset */
.nav-link.logout {
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}
</style>