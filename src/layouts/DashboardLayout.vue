<template>
  <div class="dashboard-shell">
    <!-- Fixed Navbar -->
    <Navbar @toggle-sidebar="handleToggleSidebar" />

    <!-- Layout Body -->
    <div class="dashboard-body">
      <!-- Fixed Sidebar -->
      <Sidebar :is-open="isSidebarOpen" @close="closeSidebar" />

      <!-- Main Content Area - Pages inject here via <slot> -->
      <main class="main-content" :class="{ 'sidebar-closed': !isSidebarOpen && isDesktop }">
        <div class="content-wrapper">
          <!-- 🔥 CONTENT INJECTION POINT -->
          <slot />
        </div>
      </main>

      <!-- Mobile Overlay -->
      <Transition name="fade">
        <div v-if="isSidebarOpen && !isDesktop" class="mobile-overlay" @click="closeSidebar"></div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'

// --- Sidebar State Management ---
const isSidebarOpen = ref(true)
const windowWidth = ref(1024) // Default to desktop to prevent hydration mismatch

const isDesktop = computed(() => windowWidth.value >= 992)

// Handle responsive behavior
const handleResize = () => {
  windowWidth.value = window.innerWidth
  // Auto-adjust sidebar based on breakpoint
  isSidebarOpen.value = isDesktop.value
}

const handleToggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

// Lifecycle
onMounted(() => {
  windowWidth.value = window.innerWidth
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard-shell {
  width: 100%;
  min-height: 100vh;
  /* background-color: #0f172a; */
  margin-left: 120px;
  /* Dark futuristic base */
  /* background-image:
    radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.1) 0px, transparent 50%); */
  color: #e2e8f0;
}

.dashboard-body {
  display: flex;
  position: relative;
  padding-top: 70px;
  min-height: 100vh;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Main Content Area */
.main-content {
  /* width: 1000px; */
  flex: 1;
  margin-left: 200px;
  /* Match sidebar width exactly */
  min-height: calc(100vh - 70px);
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.main-content.sidebar-closed {
  margin-left: 0;
}

.content-wrapper {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 70px);
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  z-index: 1015;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
/* @media (max-width: 991px) {
  .main-content {
    margin-left: 0;
  }

  .content-wrapper {
    padding: 1rem;
  }
} */
 /* Update these styles in DashboardLayout.vue */
.dashboard-shell {
  width: 100%;
  min-height: 100vh;
  margin-left: 0; /* REMOVED: was 120px */
  overflow-x: hidden; /* Safety lock */
  color: #e2e8f0;
}

.dashboard-body {
  display: flex;
  position: relative;
  padding-top: 70px;
  min-height: 100vh;
  width: 100%; /* Ensure it doesn't exceed parent */
}

.main-content {
  flex: 1;
  /* Sync this with Sidebar width (260px) */
  margin-left: 260px; 
  min-width: 0; /* Crucial for flexbox overflow issues */
  min-height: calc(100vh - 70px);
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.main-content.sidebar-closed {
  margin-left: 0;
}

.content-wrapper {
  padding: 2rem;
  max-width: 100%; /* Prevent fixed width overflow */
  margin: 0 auto;
}

@media (max-width: 991px) {
  .main-content {
    margin-left: 0 !important; /* Force zero on mobile */
  }
  .content-wrapper {
    padding: 1rem;
  }
}
</style>