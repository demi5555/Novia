<template>
  <main class="login-page">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">

        <!-- Login Card -->
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card login-card">
            <div class="card-body">

              <!-- Header -->
              <div class="login-header text-center">
                <h2 class="card-title">Welcome Back</h2>
                <p class="card-text">Sign in to your account</p>
              </div>

              <!-- Form -->
              <form @submit.prevent="handleLogin">

                <!-- Email or Phone -->
                <div class="form-group">
                  <label class="custom-label">Email or Phone</label>
                  <input
                    v-model="email_or_phone"
                    type="text"
                    class="custom-input"
                    placeholder="Enter your email or phone"
                  />
                  <p v-if="err.email_or_phone" class="field-error">
                    {{ err.email_or_phone }}
                  </p>
                </div>

                <!-- Password -->
                <div class="form-group">
                  <label class="custom-label">Password</label>
                  <div class="input-group">
                    <input
                      v-model="password"
                      :type="passwordType"
                      class="custom-input"
                      placeholder="Enter your password"
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
                  <div class="col-6">
                    <label class="remember-label">
                      <input type="checkbox" v-model="rememberMe" class="custom-check" />
                      Remember me
                    </label>
                  </div>
                  <div class="col-6 text-end">
                    <router-link to="/forget-password" class="forgot-link">
                      Forgot password?
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
                  <span v-else>Sign In</span>
                </button>

                <!-- Redirect -->
                <p class="redirect-text text-center">
                  Don’t have an account?
                  <router-link to="/register" class="register-link">
                    Register
                  </router-link>
                </p>

              </form>

            </div>
          </div>
        </div>

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
    notifier.success('Login Successfully!', '/')
  } catch (error) {
    notifier.error('Invalid email or password')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

/* Page */
.login-page {
  min-height: 100vh;
  background: #0f172a;
  display: flex;
  align-items: center;
  font-family: "Poppins", sans-serif;
}

/* Card */
.login-card {
  background: #1e293b;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  animation: fadeIn 0.4s ease;
}

.card-title {
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 600;
}

.card-text {
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 20px;
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
  width: 100%;
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
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
  outline: none;
}

/* Password */
.input-group {
  position: relative;
}

.password-eye {
  position: absolute;
  right: 12px;
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

.remember-label {
  color: #cbd5f5;
  display: flex;
  align-items: center;
  gap: 6px;
}

.custom-check {
  accent-color: #6366f1;
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
  width: 100%;
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
</style>