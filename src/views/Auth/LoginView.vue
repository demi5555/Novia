<template>
  <main class="login-page">
    <div class="login-card">

      <!-- LEFT PANEL: Form -->
      <div class="left-panel">
        <div class="login-header text-center mb-4">
          <h2 class="card-title">សូមស្វាគមន៍មកកាន់គណនី</h2>
          <p class="card-text mt-2">ចូលគណនីរបស់អ្នក</p>
        </div>

        <form @submit.prevent="handleLogin">

          <!-- Email or Phone -->
          <div class="form-group">
            <label class="custom-label">អ៊ីមែល ឬលេខទូរស័ព្ទ</label>
            <input
              v-model="email_or_phone"
              type="text"
              class="custom-input"
              placeholder="បញ្ចូលអ៊ីមែល ឬទូរស័ព្ទរបស់អ្នក"
            />
            <p v-if="err.email_or_phone" class="field-error">
              {{ err.email_or_phone }}
            </p>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label class="custom-label">លេខសង្ងាត់</label>
            <div class="input-group">
              <input
                v-model="password"
                :type="passwordType"
                class="custom-input"
                placeholder="បញ្ចូលពាក្យសម្ងាត់របស់អ្នក"
              />
              <span class="password-eye" @click="togglePassword">
                <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
              </span>
            </div>
            <p v-if="err.password" class="field-error">
              {{ err.password }}
            </p>
          </div>

          <!-- Options -->
          <div class="row login-options">
            <div class="col-12 text-center">
              <router-link to="/forget-password" class="forgot-link">
                ភ្លេចពាក្យសម្ងាត់​ ?
              </router-link>
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="login-btn"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
            <span v-else>ចូលគណនី</span>
          </button>

          <!-- Redirect -->
          <p class="redirect-text text-center">
            មិនមានគណនីទេ ?
            <router-link to="/register" class="register-link">
              ចុះឈ្មោះ
            </router-link>
          </p>

        </form>
      </div>

      <!-- RIGHT PANEL: Welcome -->
      <div class="right-panel">
        <h1>សូមស្វាគមន៍<br><br>មកវិញ!</h1>
        <p>ចូលគណនីរបស់អ្នក<br>ដើម្បីបន្តប្រើប្រាស់សេវាកម្ម។</p>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStores } from '@/stores/auth'
import { notify } from '@/utils/toast'

const router = useRouter()
const notifier = notify(router)
const auth = useAuthStores()

const email_or_phone = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const showPassword = ref(false)

const err = reactive({
  email_or_phone: '',
  password: ''
})

const passwordType = computed(() =>
  showPassword.value ? 'text' : 'password'
)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

function validator() {
  err.email_or_phone = !email_or_phone.value.trim()
    ? 'Email or phone is required'
    : ''

  err.password = !password.value.trim()
    ? 'Password is required'
    : ''

  return !err.email_or_phone && !err.password
}

async function handleLogin() {
  if (!validator()) return

  isLoading.value = true

  try {
    await auth.login(email_or_phone.value, password.value)
    notifier.success('ចូលគណនីដោយជោគជ័យ!', '/')
  } catch (error) {
    notifier.error('អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>

/* Page */
.login-page {
  min-height: 100vh;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Card */
.login-card {
  display: flex;
  width: 780px;
  max-width: 98vw;
  min-height: 420px;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #a855f7;
  box-shadow:
    0 0 14px rgba(168, 85, 247, 0.6),
    0 0 50px rgba(168, 85, 247, 0.2),
    0 0 100px rgba(168, 85, 247, 0.08);
  animation: fadeIn 0.4s ease;
  position: relative;
}

/* LEFT PANEL */
.left-panel {
  width: 58%;
  background: #1e293b;
  padding: 2.8rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 2;
  /* diagonal cut: top-right corner pulls inward */
  clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
}

.card-title {
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
}

.card-text {
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 0;
}

/* Form */
.form-group {
  margin-bottom: 16px;
}

.custom-label {
  font-size: 0.8rem;
  color: #cbd5f5;
  margin-bottom: 6px;
  display: block;
}

.custom-input {
  width: 90%;
  padding: 12px;
  border-radius: 10px;
  background: #0f172a;
  border: 1px solid #334155;
  color: #ffffff;
  transition: 0.3s;
}

.custom-input::placeholder {
  color: #64748b;
}

.custom-input:focus {
  border-color: #a855f7;
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
  outline: none;
}

/* Password */
.input-group {
  position: relative;
}

.password-eye {
  position: absolute;
  right: 50px;

  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #94a3b8;
}

/* Options */
.login-options {
  margin: 12px 0;
  font-size: 0.8rem;
}

/* Links */
.forgot-link {
  color: #94a3b8;
  text-decoration: none;
}

.forgot-link:hover {
  color: #ffffff;
}

/* Button */
.login-btn {
  width: 90%;
  margin-top: 10px;
  padding: 12px;
  border-radius: 10px;
  background: #c77dff;
  color: #ffffff;
  border: none;
  font-weight: 600;
  transition: 0.3s;
}

.login-btn:hover {
  background: #4f46e5;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Footer */
.redirect-text {
  margin-top: 18px;
  font-size: 0.8rem;
  color: #94a3b8;
}

.register-link {
  color: #6366f1;
  font-weight: 500;
}

/* Error */
.field-error {
  font-size: 0.75rem;
  color: #f87171;
  margin-top: 4px;
}

/* RIGHT PANEL */
.right-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  /* starts exactly where left panel diagonal ends */
  left: 48%;
  background: linear-gradient(135deg, #3b0764 0%, #7c3aed 50%, #c77dff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 2rem 2.5rem 5rem;
  /* matching diagonal on left edge */
  clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%);
  text-align: center;
  z-index: 1;
}

.right-panel h1 {
  color: #fff;
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1rem;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.3);
}

.right-panel p {
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.9rem;
  line-height: 1.65;
  margin: 0;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .login-card {
    flex-direction: column;
    width: 95vw;
    min-height: unset;
  }

  .left-panel {
    width: 100%;
    clip-path: none;
    padding: 2rem 1.5rem;
  }

  .right-panel {
    position: relative;
    left: unset;
    clip-path: none;
    padding: 2rem 1.5rem;
    min-height: 180px;
  }

  .right-panel h1 {
    font-size: 1.6rem;
  }
}
</style>