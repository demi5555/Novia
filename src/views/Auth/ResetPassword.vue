<template>
  <div class="rp-page">
    <div class="rp-card">

      <!-- Icon -->
      <div class="rp-icon-wrap">
        <div class="rp-icon-circle">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
           
          </svg>
        </div>
      </div>

      <!-- Heading -->
      <h1 class="rp-title">Create new password</h1>
      <p class="rp-subtitle">Your new password must be at least 8 characters.</p>

      <!-- New Password -->
      <div class="rp-field">
        <label class="rp-label">New password</label>
        <div class="rp-input-wrap" :class="{ 'is-focused': focusPass, 'has-error': errors.new_pass }">
          <input
            v-model="new_pass"
            :type="showPass ? 'text' : 'password'"
            placeholder="Enter new password"
            :disabled="loading"
            class="rp-input"
            @focus="focusPass = true"
            @blur="focusPass = false"
          />
          <button type="button" class="rp-eye" @click="showPass = !showPass" tabindex="-1">
            <svg v-if="!showPass" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </button>
        </div>

        <!-- Password strength -->
        <div v-if="new_pass" class="rp-strength">
          <div class="rp-strength-bars">
            <span class="rp-bar" :class="strength >= 1 ? 'active-' + strengthLabel : ''"></span>
            <span class="rp-bar" :class="strength >= 2 ? 'active-' + strengthLabel : ''"></span>
            <span class="rp-bar" :class="strength >= 3 ? 'active-' + strengthLabel : ''"></span>
            <span class="rp-bar" :class="strength >= 4 ? 'active-' + strengthLabel : ''"></span>
          </div>
          <span class="rp-strength-label" :class="'label-' + strengthLabel">{{ strengthLabel }}</span>
        </div>

        <span v-if="errors.new_pass" class="rp-error">{{ errors.new_pass }}</span>
      </div>

      <!-- Confirm Password -->
      <div class="rp-field">
        <label class="rp-label">Confirm password</label>
        <div class="rp-input-wrap" :class="{ 'is-focused': focusConfirm, 'has-error': errors.new_pass_confirmation, 'is-match': matchOk }">
          <input
            v-model="new_pass_confirmation"
            :type="showConfirm ? 'text' : 'password'"
            placeholder="Re-enter new password"
            :disabled="loading"
            class="rp-input"
            @focus="focusConfirm = true"
            @blur="focusConfirm = false"
          />
          <span v-if="matchOk" class="rp-check">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
          <button v-else type="button" class="rp-eye" @click="showConfirm = !showConfirm" tabindex="-1">
            <svg v-if="!showConfirm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </button>
        </div>
        <span v-if="errors.new_pass_confirmation" class="rp-error">{{ errors.new_pass_confirmation }}</span>
      </div>

      <!-- Submit Button -->
      <button class="rp-btn" :disabled="loading" @click="handleSubmit">
        <span v-if="loading" class="rp-spinner"></span>
        <span>{{ loading ? 'Resetting...' : 'Reset Password' }}</span>
      </button>

      <!-- Back Link -->
      <div class="rp-back">
        <router-link to="/verify-otp" class="rp-back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to verify OTP
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api/http'
import { notify } from '@/utils/toast'

const router = useRouter()
const route  = useRoute()
const toast  = notify(router)

const email = computed(() => route.query.email || '')
const otp   = computed(() => route.query.otp   || '')

const new_pass              = ref('')
const new_pass_confirmation = ref('')
const showPass              = ref(false)
const showConfirm           = ref(false)
const focusPass             = ref(false)
const focusConfirm          = ref(false)
const loading               = ref(false)
const errors                = ref({ new_pass: '', new_pass_confirmation: '' })

// Password strength score (1–4)
const strength = computed(() => {
  const p = new_pass.value
  if (!p) return 0
  let score = 0
  if (p.length >= 8)             score++
  if (/[A-Z]/.test(p))          score++
  if (/[0-9]/.test(p))          score++
  if (/[^A-Za-z0-9]/.test(p))  score++
  return score
})

const strengthLabel = computed(() => {
  if (strength.value <= 1) return 'weak'
  if (strength.value === 2) return 'fair'
  if (strength.value === 3) return 'good'
  return 'strong'
})

// Passwords match indicator
const matchOk = computed(() =>
  new_pass_confirmation.value.length > 0 &&
  new_pass.value === new_pass_confirmation.value
)

onMounted(() => {
  if (!email.value || !otp.value) {
    router.replace({ name: 'forget-password' })
  }
})

function validate() {
  errors.value = { new_pass: '', new_pass_confirmation: '' }
  let valid = true

  if (!new_pass.value) {
    errors.value.new_pass = 'New password is required.'
    valid = false
  } else if (new_pass.value.length < 8) {
    errors.value.new_pass = 'Password must be at least 8 characters.'
    valid = false
  }

  if (!new_pass_confirmation.value) {
    errors.value.new_pass_confirmation = 'Please confirm your password.'
    valid = false
  } else if (new_pass.value !== new_pass_confirmation.value) {
    errors.value.new_pass_confirmation = 'Passwords do not match.'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) return

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('email',                 email.value)
    formData.append('otp',                   otp.value)
    formData.append('new_pass',              new_pass.value)
    formData.append('new_pass_confirmation', new_pass_confirmation.value)

    const res = await api.post('/api/reset/pass', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (res.data.result) {
      toast.success(res.data.message || 'Password reset successfully!', '/')
    } else {
      toast.error(res.data.message || 'Something went wrong. Please try again.')
    }
  } catch (err) {
    toast.error(err?.data?.message || err?.message || 'Network error. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ─── Page ─── */
.rp-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%);
  padding: 1.5rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ─── Card ─── */
.rp-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 2.5rem 2.25rem 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 2px 0 #e0e7ff, 0 20px 60px rgba(99, 102, 241, 0.1);
  animation: slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* ─── Icon ─── */
.rp-icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.rp-icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
}

/* ─── Heading ─── */
.rp-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin: 0 0 0.35rem;
  letter-spacing: -0.4px;
}

.rp-subtitle {
  font-size: 13.5px;
  color: #9ca3af;
  text-align: center;
  margin: 0 0 2rem;
  line-height: 1.5;
}

/* ─── Field ─── */
.rp-field {
  margin-bottom: 1.25rem;
}

.rp-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 7px;
}

/* ─── Input wrapper ─── */
.rp-input-wrap {
  display: flex;
  align-items: center;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}

.rp-input-wrap.is-focused {
  border-color: #6366f1;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.rp-input-wrap.has-error {
  border-color: #f87171;
  box-shadow: 0 0 0 4px rgba(248, 113, 113, 0.1);
}

.rp-input-wrap.is-match {
  border-color: #34d399;
  box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.1);
}

.rp-input {
  flex: 1;
  height: 46px;
  border: none;
  background: transparent;
  padding: 0 12px;
  font-size: 14px;
  color: #111827;
  outline: none;
  font-family: inherit;
}

.rp-input::placeholder { color: #d1d5db; }
.rp-input:disabled { opacity: 0.5; cursor: not-allowed; }

/* ─── Eye / check ─── */
.rp-eye {
  background: none;
  border: none;
  padding: 0 12px;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  height: 46px;
  transition: color 0.15s;
}

.rp-eye:hover { color: #6366f1; }

.rp-check {
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: #10b981;
  height: 46px;
}

/* ─── Strength ─── */
.rp-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.rp-strength-bars {
  display: flex;
  gap: 4px;
  flex: 1;
}

.rp-bar {
  flex: 1;
  height: 4px;
  border-radius: 99px;
  background: #e5e7eb;
  transition: background 0.3s;
}

.rp-bar.active-weak   { background: #f87171; }
.rp-bar.active-fair   { background: #fb923c; }
.rp-bar.active-good   { background: #facc15; }
.rp-bar.active-strong { background: #34d399; }

.rp-strength-label {
  font-size: 12px;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
  text-transform: capitalize;
}

.label-weak   { color: #f87171; }
.label-fair   { color: #fb923c; }
.label-good   { color: #ca8a04; }
.label-strong { color: #10b981; }

/* ─── Error ─── */
.rp-error {
  display: block;
  font-size: 12px;
  color: #ef4444;
  margin-top: 5px;
}

/* ─── Button ─── */
.rp-btn {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  letter-spacing: 0.2px;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
  transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
}

.rp-btn:hover:not(:disabled) {
  opacity: 0.92;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
}

.rp-btn:active:not(:disabled) { transform: scale(0.98); }

.rp-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

/* ─── Spinner ─── */
.rp-spinner {
  width: 16px;
  height: 16px;
  border: 2.5px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}

/* ─── Back ─── */
.rp-back { text-align: center; }

.rp-back-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.15s;
}

.rp-back-link:hover { color: #6366f1; }

/* ─── Animations ─── */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>