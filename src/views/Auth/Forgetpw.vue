<template>
  <div class="forgot-wrapper">
    <div class="forgot-card">

      <!-- Icon -->
      <div class="icon-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </div>

      <h1>Forgot Password?</h1>
      <p class="sub-text">Enter your email address and we'll send you a verification code.</p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email Address</label>
          <div class="input-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              autocomplete="email"
              :disabled="isLoading"
            />
          </div>
          <span v-if="emailError" class="field-error">{{ emailError }}</span>
        </div>

        <button type="submit" class="btn-submit" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span>{{ isLoading ? 'Sending...' : 'Send OTP Code' }}</span>
        </button>
      </form>

      <router-link to="/login" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Login
      </router-link>

    </div>
  </div>
</template>

<script setup>
import { useAuthStores } from '@/stores/auth'
import { notify } from '@/utils/toast'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router   = useRouter()
const notifier = notify(router)
const auth     = useAuthStores()

let email      = ref('')
let emailError = ref('')
let isLoading  = ref(false)

function validateEmail() {
  emailError.value = ''
  if (!email.value.trim()) {
    emailError.value = 'Email address is required.'
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email address.'
    return false
  }
  return true
}

async function handleSubmit() {
  if (!validateEmail()) return
  isLoading.value = true
  try {
    await auth.forgotPassword(email.value)
    notifier.success('OTP code sent! Please check your inbox.')
    router.push({ name: 'verify-otp', query: { email: email.value } })
  } catch (err) {
    notifier.error('Failed to send OTP. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

.forgot-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  background-attachment: fixed;
  background-size: cover;
  padding: 2rem 1rem;
  font-family: "Poppins", sans-serif;
}

.forgot-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  padding: 2.75rem 2.25rem 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 40px rgba(80, 0, 160, 0.35);
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  text-align: center;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Icon ── */
.icon-wrap {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #ffffff;
}
.icon-wrap svg { width: 26px; height: 26px; }

/* ── Typography ── */
h1 {
  font-size: 22px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
}

.sub-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.65;
  margin-bottom: 2rem;
}

/* ── Form ── */
.form-group {
  margin-bottom: 1.25rem;
  text-align: left;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 6px;
}

.input-wrap { position: relative; }

.input-wrap svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.input-wrap input {
  width: 100%;
  padding: 0 12px 0 40px;
  height: 46px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 14px;
  font-family: "Poppins", sans-serif;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.input-wrap input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.input-wrap input:focus {
  border-color: #6366f1;
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 0 0 3px rgba(155, 48, 255, 0.2);
}

.input-wrap input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.field-error {
  display: block;
  font-size: 12px;
  color: #ffaaaa;
  margin-top: 5px;
  padding-left: 2px;
}

/* ── Button ── */
.btn-submit {
  width: 100%;
  height: 46px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #9b30ff, #c77dff);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  letter-spacing: 0.02em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 18px rgba(155, 48, 255, 0.45);
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(155, 48, 255, 0.55);
  background: linear-gradient(135deg, #a94dff, #d18bff);
}

.btn-submit:active { transform: scale(0.98); }

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* ── Spinner ── */
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Back link ── */
.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: color 0.15s;
}
.back-link:hover { color: #ffffff; }
.back-link svg { width: 14px; height: 14px; }
</style>