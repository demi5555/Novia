import api from '@/api/http'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStores = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const isLoggedIn = computed(() => !!token.value)

  async function login(email_or_phone, password) {
    try {
      const form = new FormData()
      form.append('email_or_phone', email_or_phone)
      form.append('password', password)

      const res = await api.post('/api/login', form)
      if (!res.data.result) {
        throw new Error(res.data.message || 'Login failed')
      }

      user.value = res.data.data.user
      token.value = res.data.data.token
      localStorage.setItem('token', token.value)
    } catch (error) {
      throw error.response || error
    }
  }

  async function logout() {
    await api.delete('/api/logout')
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  async function register({ full_name, email, phone, password, password_confirmation }) {
    try {
      const form = { full_name, email, phone, password, password_confirmation }
      const res = await api.post('/api/register', form)

      if (!res.data.result) {
        throw new Error(res.data.message || 'Register failed')
      }

      return res.data
    } catch (error) {
      if (error.response?.status === 422) {
        throw {
          message: error.response.data.message,
          errors: error.response.data.data,
        }
      }
      throw new Error(error.response?.data?.message || error.message || 'Something went wrong')
    }
  }

  async function forgotPassword(email) {
    try {
      const form = new FormData()
      form.append('email', email)
      const res = await api.post('/api/forgot/pass', form)

      if (!res.data.result) {
        throw new Error(res.data.message || 'Failed to send OTP')
      }

      return res.data
    } catch (error) {
      throw error.response || error
    }
  }

  async function verifyOtp(email, otp) {
    try {
      const form = new FormData()
      form.append('email', email)
      form.append('otp', otp)
      const res = await api.post('/api/forgot/verify-otp', form)

      if (!res.data.result) {
        throw new Error(res.data.message || 'Invalid OTP')
      }

      return res.data
    } catch (error) {
      throw error.response || error
    }
  }

  async function profile() {
    return await api.get('/api/profile')
  }

  async function fetchUser() {
    if (!token.value) return

    try {
      const res = await api.get('/api/profile')
      if (res.data.result) {
        user.value = res.data.data
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      // Only clear the session when the server explicitly rejects the token (401).
      // Network errors, 500s, or CORS issues should NOT log the user out.
      if (error.response?.status === 401) {
        token.value = null
        localStorage.removeItem('token')
      }
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    login,
    logout,
    register,
    forgotPassword,
    verifyOtp,
    profile,
    fetchUser,
  }
})
