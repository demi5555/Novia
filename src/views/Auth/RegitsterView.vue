<template>
  <div class="register-box">
    <div class="register-card">
      <h2 class="title">Register</h2>
      <p class="subtitle">Create new account</p>

      <form @submit.prevent="handleRegister" novalidate>

        <!-- Full Name -->
        <div class="field-group">
          <div class="field-wrap" :class="{ error: errors.full_name }">
            <i class="bi bi-person-fill"></i>
            <input
              v-model="form.full_name"
              type="text"
              placeholder="Full Name"
              autocomplete="name"
            />
          </div>
          <p v-if="errors.full_name" class="field-error">{{ errors.full_name }}</p>
        </div>

        <!-- Email -->
        <div class="field-group">
          <div class="field-wrap" :class="{ error: errors.email }">
            <i class="bi bi-envelope-fill"></i>
            <input
              v-model="form.email"
              type="text"
              placeholder="Email"
              autocomplete="email"
            />
          </div>
          <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
        </div>

        <!-- Phone -->
        <div class="field-group">
          <div class="field-wrap" :class="{ error: errors.phone }">
            <i class="bi bi-telephone-fill"></i>
            <input
              v-model="form.phone"
              type="text"
              placeholder="Phone Number"
              autocomplete="tel"
            />
          </div>
          <p v-if="errors.phone" class="field-error">{{ errors.phone }}</p>
        </div>

        <!-- Password -->
        <div class="field-group">
          <div class="field-wrap" :class="{ error: errors.password }">
            <i class="bi bi-lock-fill"></i>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password (min 4 characters)"
              autocomplete="new-password"
            />
            <span class="eye-btn" @click="togglePassword">
              <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
            </span>
          </div>
          <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password -->
        <div class="field-group">
          <div class="field-wrap" :class="{ error: errors.confirmPassword }">
            <i class="bi bi-lock-fill"></i>
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm Password"
              autocomplete="new-password"
            />
            <span class="eye-btn" @click="toggleConfirmPassword">
              <i :class="showConfirmPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
            </span>
          </div>
          <p v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</p>
        </div>

        <!-- Submit -->
        <button :disabled="isLoading" type="submit" class="submit-btn">
          <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
          <span v-else>Sign Up</span>
        </button>

        <!-- Remember + Forgot -->
        <div class="row-links">
          <label class="remember-label">
            <input type="checkbox" v-model="rememberMe" hidden />
            <span class="check-circle" :class="{ active: rememberMe }">
              <i v-if="rememberMe" class="bi bi-check"></i>
            </span>
            Remember me
          </label>
          <router-link to="/forget-password" class="forgot-link">Forgot password?</router-link>
        </div>

      </form>

      <!-- Divider -->
      <div class="divider">
        <span class="line"></span>
        <span class="divider-text">Or continue with</span>
        <span class="line"></span>
      </div>

      <p class="login-redirect">
        Already have an account?
        <router-link to="/login" class="login-link">Login</router-link>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStores } from "@/stores/auth";
import { notify } from "@/utils/toast";

const router = useRouter();
const notifier = notify(router);
const auth = useAuthStores();

// UI state
const isLoading = ref(false);
const rememberMe = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Form fields
const form = ref({
  full_name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const errors = ref({});

// Toggle password fields
const togglePassword = () => (showPassword.value = !showPassword.value);
const toggleConfirmPassword = () =>
  (showConfirmPassword.value = !showConfirmPassword.value);

// Validate form
function validateForm() {
  errors.value = {};

  if (!form.value.full_name.trim()) {
    errors.value.full_name = "Full name is required.";
  } else if (form.value.full_name.trim().length < 2) {
    errors.value.full_name = "Full name must be at least 2 characters.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email.trim()) {
    errors.value.email = "Email is required.";
  } else if (!emailRegex.test(form.value.email.trim())) {
    errors.value.email = "Please enter a valid email.";
  }

  const phoneRegex = /^[0-9]{9,15}$/;
  if (!form.value.phone.trim()) {
    errors.value.phone = "Phone number is required.";
  } else if (!phoneRegex.test(form.value.phone.trim())) {
    errors.value.phone = "Phone must be 9–15 digits.";
  }

  if (!form.value.password.trim()) {
    errors.value.password = "Password is required.";
  } else if (form.value.password.length < 4) {
    errors.value.password = "Password must be at least 4 characters.";
  }

  if (!form.value.confirmPassword.trim()) {
    errors.value.confirmPassword = "Confirm password is required.";
  } else if (form.value.confirmPassword !== form.value.password) {
    errors.value.confirmPassword = "Passwords do not match.";
  }

  return Object.keys(errors.value).length === 0;
}

// Submit register form
async function handleRegister() {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    await auth.register({
      full_name: form.value.full_name.trim(),
      email: form.value.email.trim(),
      phone: form.value.phone.trim(),
      password: form.value.password,
      password_confirmation: form.value.confirmPassword,
    });

    notifier.success("Register Successfully!", "/login");

  } catch (err) {
    const backendError =
      err?.errors?.email?.[0] ||
      err?.errors?.phone?.[0] ||
      "Registration failed.";

    notifier.error(backendError);

  } finally {
    isLoading.value = false;
  }
}
</script>

<style>
/* Global (must be outside scoped) */
html,
body,
#app {
  min-height: 100%;
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.register-box {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  background-attachment: fixed;
  background-size: cover;
  font-family: "Poppins", sans-serif;
  padding: 2rem 1rem;
}

.register-card {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  border-radius: 20px;
  background: #1e293b;
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(25px); }
  to   { opacity: 1; transform: translateY(0); }
}

.title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
}

.subtitle {
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 1.5rem;
}

.field-group { margin-bottom: 1rem; }

.field-wrap {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 0 14px;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: 0.3s;
}

.field-wrap i {
  color: #ffffff;
  font-size: 0.9rem;
}

.field-wrap input {
  flex: 1;
  padding: 13px 0;
  border: none;
  outline: none;
  background: transparent;
  color: #ffffff;
  font-size: 0.9rem;
  font-family: "Poppins", sans-serif;
}

.field-wrap input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.field-wrap:focus-within {
  border: 1px solid rgba(200, 150, 255, 0.8);
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 0 0 3px rgba(155, 48, 255, 0.2);
}

.field-wrap.error {
  border: 1px solid #ff6b6b;
}

.field-error {
  font-size: 0.75rem;
  color: #ffaaaa;
  margin-top: 4px;
  padding-left: 4px;
}

.eye-btn {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
}

.eye-btn:hover {
  color: #ffffff;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #9b30ff, #c77dff);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 0.5rem;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 18px rgba(155, 48, 255, 0.45);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(155, 48, 255, 0.55);
  background: linear-gradient(135deg, #a94dff, #d18bff);
}

.submit-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.row-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.remember-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.check-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.check-circle.active {
  background: #9b30ff;
  border-color: #c77dff;
}

.forgot-link {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #ffffff;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.2rem 0;
}

.line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.divider-text {
  padding: 0 10px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
}

.login-redirect {
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
}

.login-link {
  color: #6366f1;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.login-link:hover {
  color: #ffffff;
  text-decoration: underline;
}
</style>