<template>
  <div class="register-box">
    <div class="register-card">

      <!-- LEFT PANEL: Form -->
      <div class="left-panel">
        <h4 class="title">បង្កើតគណនី</h4>
        <p class="subtitle mt-2">បង្កើតគណនីថ្មី</p>

        <form @submit.prevent="handleRegister" novalidate>

          <!-- Full Name -->
          <div class="field-group">
            <div class="field-wrap" :class="{ error: errors.full_name }">
              <i class="bi bi-person-fill"></i>
              <input
                v-model="form.full_name"
                type="text"
                placeholder="ឈ្មោះពេញ"
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
                placeholder="អ៊ីមែល"
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
                placeholder="លេខទូរស័ព្ទ"
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
                placeholder="លេខសង្ងាត់ (លើស 4 តួអក្សរ)"
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
                placeholder="បញ្ចាក់ពាក្យសម្ងាត់"
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
            <span v-else>ចុះឈ្មោះ</span>
          </button>

          <!-- Remember + Forgot -->
          <div class="row-links" >
         
            <router-link to="/forget-password" class="forgot-link " >ភ្លេចពាក្យសម្ងាត់​?</router-link>
          </div>

        </form>

        <!-- Divider -->
        <div class="divider">
          <span class="line"></span>
          <span class="divider-text">ឬបន្តជាមួយ</span>
          <span class="line"></span>
        </div>

        <p class="login-redirect">
          មានគណនីរួចហើយ?
          <router-link to="/login" class="login-link">ចូលគណនី</router-link>
        </p>
      </div>

      <!-- RIGHT PANEL: Welcome -->
      <div class="right-panel">
        <h1>បង្កើត<br>គណនីថ្មី!</h1>
        <p>ចូលរួមជាមួយយើង<br>ដើម្បីទទួលបានសេវាកម្មពេញលេញ។</p>
      </div>

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
    errors.value.full_name = "ឈ្មោះពេញត្រូវតែមានយ៉ាងហោចណាស់ 2 តួអក្សរ។";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email.trim()) {
    errors.value.email = "Email is required.";
  } else if (!emailRegex.test(form.value.email.trim())) {
    errors.value.email = "សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ។";
  }

  const phoneRegex = /^[0-9]{9,15}$/;
  if (!form.value.phone.trim()) {
    errors.value.phone = "Phone number is required.";
  } else if (!phoneRegex.test(form.value.phone.trim())) {
    errors.value.phone = "ត្រូវមានលេខ​ 0 នៅខាងមុខនឹង​ 10-12 លេខឡើងទៅ។";
  }

  if (!form.value.password.trim()) {
    errors.value.password = "Password is required.";
  } else if (form.value.password.length < 4) {
    errors.value.password = "ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ 4 តួអក្សរ។";
  }

  if (!form.value.confirmPassword.trim()) {
    errors.value.confirmPassword = "Confirm password is required.";
  } else if (form.value.confirmPassword !== form.value.password) {
    errors.value.confirmPassword = "ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ";
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

    notifier.success("ចុះឈ្មោះដោយជោគជ័យ!", "/login");

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
html, body, #app {
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

/* Page */
.register-box {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  font-family: "Poppins", sans-serif;
  padding: 2rem 1rem;
}

/* Card — split layout */
.register-card {
  display: flex;
  width: 860px;
  max-width: 98vw;
  min-height: 560px;
  border-radius: 16px;
  border: 2px solid #a855f7;
  box-shadow:
    0 0 14px rgba(168, 85, 247, 0.6),
    0 0 50px rgba(168, 85, 247, 0.2),
    0 0 100px rgba(168, 85, 247, 0.08);
  animation: fadeIn 0.5s ease;
  position: relative;
  overflow: hidden;
}

/* LEFT PANEL */
.left-panel {
  width: 60%;
  background: #1e293b;
  padding: 0.50rem 6.9rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
}

.subtitle {
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 1.2rem;
}

/* Form fields */
.field-group {
  margin-bottom: 0.85rem;
}

.field-wrap {
  display: flex;
  align-items: center;
  background: #0f172a;
  border-radius: 10px;
  padding: 0 14px;
  gap: 10px;
  border: 1px solid #334155;
  transition: 0.3s;
}

.field-wrap i {
  color: #94a3b8;
  font-size: 0.9rem;
}

.field-wrap input {
  flex: 1;
  padding: 11px 0;
  border: none;
  outline: none;
  background: transparent;
  color: #ffffff;
  font-size: 0.85rem;
  font-family: "Poppins", sans-serif;
}

.field-wrap input::placeholder {
  color: #64748b;
}

.field-wrap:focus-within {
  border-color: #a855f7;
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
}

.field-wrap.error {
  border-color: #f87171;
}

.field-error {
  font-size: 0.72rem;
  color: #f87171;
  margin-top: 4px;
  padding-left: 4px;
}

.eye-btn {
  cursor: pointer;
  color: #94a3b8;
}

.eye-btn:hover {
  color: #ffffff;
}

/* Submit button */
.submit-btn {
  width: 80%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #c77dff;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 0.5rem;
  letter-spacing: 0.02em;
}

.submit-btn:hover {
  background: #4f46e5;
}

.submit-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* Row links */
.row-links {
 text-align: center;
  
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

.forgot-link {
  font-size: 0.8rem;
  color: #94a3b8;
  text-decoration: none;

}

.forgot-link:hover {
  color: #ffffff;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  margin: 1rem 0;
}

.line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
}

.divider-text {
  padding: 0 10px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
}

/* Login redirect */
.login-redirect {
  text-align: center;
  font-size: 0.85rem;
  color: #94a3b8;
}

.login-link {
  color: #6366f1;
  font-weight: 600;
  text-decoration: none;
}

.login-link:hover {
  color: #ffffff;
  text-decoration: underline;
}

/* RIGHT PANEL */
.right-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 44%;
  background: linear-gradient(135deg, #3b0764 0%, #7c3aed 50%, #c77dff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 2rem 2.5rem 5rem;
  clip-path: polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%);
  text-align: center;
  z-index: 2;
}

.right-panel h1 {
  color: #fff;
  font-size: 2.4rem;
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
  from { opacity: 0; transform: translateY(25px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 640px) {
  .register-card {
    flex-direction: column;
    width: 95vw;
    min-height: unset;
  }

  .left-panel {
    width: 100%;
    padding: 2rem 1.5rem;
  }

  .right-panel {
    position: relative;
    left: unset;
    clip-path: none;
    padding: 2rem 1.5rem;
    min-height: 200px;
  }

  .right-panel h1 {
    font-size: 1.8rem;
  }
}
</style>