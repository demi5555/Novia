<template>
  <div class="otp-wrapper">
    <div class="otp-card">

      <!-- Icon -->
      <div class="icon-wrap">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6z"/>
          <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/>
        </svg>
      </div>

      <h1>Check your email</h1>
      <p class="sub-text">We sent a 6-character code to</p>
      <p class="email-text">{{ email }}</p>

      <!-- OTP Boxes -->
      <div class="otp-row">
        <input
          v-for="(digit, index) in otpDigits"
          :key="index"
          :ref="el => { if (el) otpRefs[index] = el }"
          v-model="otpDigits[index]"
          type="text"
          maxlength="1"
          autocomplete="off"
          :disabled="isLoading"
          :class="['otp-box', { 'otp-box--filled': digit, 'otp-box--error': otpError }]"
          @input="onInput(index)"
          @keydown="onKeydown($event, index)"
          @paste="onPaste($event)"
        />
      </div>

      <!-- Progress dots -->
      <div class="progress-dots">
        <div
          v-for="(d, i) in otpDigits"
          :key="i"
          class="dot"
          :class="{ 'dot--filled': d }"
        />
      </div>

      <!-- Error -->
      <div v-if="otpError" class="error-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ otpError }}</span>
      </div>

      <!-- Submit Button -->
      <button
        :disabled="isLoading || otpValue.length < 6"
        class="btn-submit"
        :class="{ 'btn-submit--active': otpValue.length === 6 && !isLoading }"
        @click="handleSubmit"
      >
        <span v-if="isLoading" class="spinner"></span>
        <span>{{ isLoading ? 'Verifying...' : 'Verify Code' }}</span>
        <svg v-if="!isLoading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </button>

      <!-- Divider -->
      <div class="divider">
        <span class="line"></span>
        <span class="divider-text">or</span>
        <span class="line"></span>
      </div>

      <!-- Resend -->
      <p class="resend-text">
        Didn't get the code?
        <span
          @click="handleResend"
          class="resend-link"
          :class="{ 'resend-link--disabled': resendCooldown > 0 }"
        >
          {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code' }}
        </span>
      </p>

      <!-- Back -->
      <router-link to="/forget-password" class="back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to forgot password
      </router-link>

    </div>
  </div>
</template>

<script setup>
import { useAuthStores } from '@/stores/auth'
import { notify } from '@/utils/toast'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router   = useRouter()
const route    = useRoute()
const notifier = notify(router)
const auth     = useAuthStores()

const email          = computed(() => route.query.email || '')
const otpDigits      = ref(['', '', '', '', '', ''])
const otpRefs        = ref([])
const otpError       = ref('')
const isLoading      = ref(false)
const resendCooldown = ref(0)
let timer = null

onMounted(() => {
  if (!email.value) {
    router.replace({ name: 'forget-password' })
    return
  }
  setTimeout(() => otpRefs.value[0]?.focus(), 200)
})

onUnmounted(() => clearInterval(timer))

function onInput(index) {
  otpError.value = ''
  const cleaned = otpDigits.value[index].replace(/[^a-zA-Z0-9]/g, '')
  otpDigits.value[index] = cleaned.slice(-1)
  if (otpDigits.value[index] && index < 5) {
    nextTick(() => otpRefs.value[index + 1]?.focus())
  }
}

function onKeydown(e, index) {
  if (e.key === 'Backspace') {
    if (otpDigits.value[index]) {
      otpDigits.value[index] = ''
    } else if (index > 0) {
      otpDigits.value[index - 1] = ''
      nextTick(() => otpRefs.value[index - 1]?.focus())
    }
    e.preventDefault()
  }
}

function onPaste(e) {
  e.preventDefault()
  const text = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6)
  text.split('').forEach((char, i) => { if (i < 6) otpDigits.value[i] = char })
  const nextEmpty = otpDigits.value.findIndex(d => !d)
  nextTick(() => otpRefs.value[nextEmpty === -1 ? 5 : nextEmpty]?.focus())
}

const otpValue = computed(() => otpDigits.value.join(''))

async function handleSubmit() {
  otpError.value = ''
  if (otpValue.value.length < 6) {
    otpError.value = 'Please enter the complete 6-character OTP code.'
    return
  }
  isLoading.value = true
  try {
    await auth.verifyOtp(email.value, otpValue.value)
    notifier.success('OTP verified!')
    router.push({ name: 'reset-password', query: { email: email.value, otp: otpValue.value } })
  } catch (err) {
    otpError.value = 'Invalid OTP. Please try again.'
    otpDigits.value = ['', '', '', '', '', '']
    nextTick(() => otpRefs.value[0]?.focus())
  } finally {
    isLoading.value = false
  }
}

async function handleResend() {
  if (resendCooldown.value > 0) return
  try {
    await auth.forgotPassword(email.value)
    notifier.success('A new OTP has been sent to your email.')
    otpDigits.value = ['', '', '', '', '', '']
    nextTick(() => otpRefs.value[0]?.focus())
    resendCooldown.value = 60
    timer = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (err) {
    notifier.error('Failed to resend OTP. Please try again.')
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

/* ── Page ── */
.otp-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2d0060, #6a0dad, #9b30ff);
  background-attachment: fixed;
  background-size: cover;
  padding: 2rem 1rem;
  font-family: "Poppins", sans-serif;
}

/* ── Card ── */
.otp-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  padding: 2.75rem 2.25rem 2rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 10px 40px rgba(80, 0, 160, 0.35);
  text-align: center;
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Icon ── */
.icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

/* ── Typography ── */
h1 {
  font-size: 22px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px;
}

.sub-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 4px;
}

.email-text {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 2rem;
  word-break: break-all;
}

/* ── OTP Row ── */
.otp-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1rem;
}

.otp-box {
  width: 52px;
  height: 58px;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  outline: none;
  caret-color: #fff;
  transition: border-color 0.2s, background 0.2s, transform 0.12s;
  flex-shrink: 0;
  padding: 0;
}

.otp-box:focus {
  border-color: rgba(200, 150, 255, 0.9);
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 0 0 3px rgba(155, 48, 255, 0.25);
  transform: translateY(-2px);
}

.otp-box--filled {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(200, 150, 255, 0.6);
}

.otp-box--error {
  border-color: #ff8080 !important;
  background: rgba(255, 100, 100, 0.1) !important;
}

.otp-box:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Progress dots ── */
.progress-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1.25rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.25s;
}

.dot--filled {
  width: 20px;
  background: #c77dff;
}

/* ── Error ── */
.error-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(255, 100, 100, 0.15);
  border: 1px solid rgba(255, 150, 150, 0.3);
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 1.25rem;
  color: #ffaaaa;
  font-size: 13px;
}

/* ── Submit ── */
.btn-submit {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.4);
  font-size: 15px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  cursor: not-allowed;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1.5rem;
  transition: all 0.2s;
}

.btn-submit--active {
  background: linear-gradient(135deg, #9b30ff, #c77dff);
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(155, 48, 255, 0.45);
}

.btn-submit--active:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(155, 48, 255, 0.55);
  background: linear-gradient(135deg, #a94dff, #d18bff);
}

.btn-submit--active:active { transform: scale(0.98); }

/* ── Spinner ── */
.spinner {
  width: 15px;
  height: 15px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Divider ── */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.25rem;
}
.line { flex: 1; height: 1px; background: rgba(255, 255, 255, 0.15); }
.divider-text { font-size: 12px; color: rgba(255, 255, 255, 0.4); }

/* ── Resend ── */
.resend-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.5rem;
}

.resend-link {
  font-weight: 600;
  margin-left: 4px;
  color: #c77dff;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.15s;
}
.resend-link:hover { color: #ffffff; }

.resend-link--disabled {
  color: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
  text-decoration: none;
}

/* ── Back link ── */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  transition: color 0.15s;
}
.back-link:hover { color: #ffffff; }
</style>