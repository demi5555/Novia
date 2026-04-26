import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css' // ✅ toast styles

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import * as LucideIcons from 'lucide-vue-next'

import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ToastPlugin)

for (const [key, component] of Object.entries(LucideIcons)) {
  app.component(key, component);
}

// Initialize user data if token exists
const initApp = async () => {
  const { useAuthStores } = await import('./stores/auth')
  const auth = useAuthStores()
  
  if (auth.isLoggedIn) {
    try {
      await auth.fetchUser()
    } catch (error) {
      console.error('Failed to initialize user data:', error)
    }
  }
}

initApp().then(() => {
  app.mount('#app')
})
