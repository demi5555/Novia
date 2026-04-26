<template>
    <div class="container">
  <!-- Page header -->
  <div class="page-title-row">
    <button class="back-btn" @click="$router.back()">
      <ArrowLeft :size="16" />
    </button>
    <div class="page-icon-wrap"><UserCog :size="18" /></div>
    <div>
      <h3 class="page-title">Edit Profile</h3>
      <p class="page-sub">Update your personal & professional details</p>
    </div>
  </div>

  <div class="row g-4">
    <!-- ── LEFT: Personal Info ── -->
    <div class="col-lg-6">
      <div class="form-card">
        <div class="form-card-header">
          <div class="header-icon-wrap"><User :size="16" /></div>
          <div>
            <h6 class="card-heading">Personal Information</h6>
            <p class="card-sub">Basic details about you</p>
          </div>
        </div>

        <div class="form-body">
          <!-- Full name -->
          <div class="field-group">
            <label class="field-label">Full Name <span class="req">*</span></label>
            <div class="input-wrap">
              <User :size="15" class="input-icon" />
              <input v-model="personal.full_name" type="text" class="f-input" placeholder="Your full name" />
            </div>
          </div>

          <!-- Date of birth -->
          <div class="field-group">
            <label class="field-label">Date of Birth</label>
            <div class="input-wrap">
              <CalendarDays :size="15" class="input-icon" />
              <input v-model="personal.dob" type="date" class="f-input" />
            </div>
          </div>

          <!-- Gender -->
          <div class="field-group">
            <label class="field-label">Gender</label>
            <div class="gender-row">
              <label class="gender-opt" :class="{ active: personal.gender === 1 }">
                <input type="radio" v-model="personal.gender" :value="1" hidden />
                <span class="gender-icon">♂</span> Male
              </label>
              <label class="gender-opt" :class="{ active: personal.gender === 2 }">
                <input type="radio" v-model="personal.gender" :value="2" hidden />
                <span class="gender-icon">♀</span> Female
              </label>
              <label class="gender-opt" :class="{ active: personal.gender === 3 }">
                <input type="radio" v-model="personal.gender" :value="3" hidden />
                <span class="gender-icon">◎</span> Other
              </label>
            </div>
          </div>

          <!-- Phone -->
          <div class="field-group">
            <label class="field-label">Phone Number</label>
            <div class="input-wrap">
              <Phone :size="15" class="input-icon" />
              <input v-model="personal.phone" type="tel" class="f-input" placeholder="e.g. 012 345 678" />
            </div>
          </div>

          <!-- Current city / Hometown (side by side) -->
          <div class="row g-3">
            <div class="col-6">
              <div class="field-group mb-0">
                <label class="field-label">Current City</label>
                <div class="input-wrap">
                  <MapPin :size="15" class="input-icon" />
                  <input v-model="personal.current_city" type="text" class="f-input" placeholder="City" />
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="field-group mb-0">
                <label class="field-label">Home Town</label>
                <div class="input-wrap">
                  <Home :size="15" class="input-icon" />
                  <input v-model="personal.home_town" type="text" class="f-input" placeholder="Town" />
                </div>
              </div>
            </div>
          </div>

          <!-- Portfolio link -->
          <div class="field-group">
            <label class="field-label">Portfolio / Website</label>
            <div class="input-wrap">
              <Globe :size="15" class="input-icon" />
              <input v-model="personal.portfolio_link" type="url" class="f-input" placeholder="https://yoursite.com" />
            </div>
          </div>

          <!-- Save personal -->
          <div class="form-footer">
            <button class="btn-ghost-v" @click="$router.back()">Cancel</button>
            <button class="btn-save" :disabled="savingPersonal" @click="savePersonal">
              <Loader2 v-if="savingPersonal" :size="14" class="spin me-1" />
              <Save v-else :size="14" class="me-1 text-black" />
              <div class="text-black">{{ savingPersonal ? 'Saving…' : 'Save Personal' }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── RIGHT: Professional Info ── -->
    <div class="col-lg-6">
      <div class="form-card">
        <div class="form-card-header">
          <div class="header-icon-wrap" style="background:#fef3c7;color:#92400e;"><Briefcase :size="16" /></div>
          <div>
            <h6 class="card-heading">Professional Information</h6>
            <p class="card-sub">Your work & career details</p>
          </div>
        </div>

        <div class="form-body">
          <!-- Job title -->
          <div class="field-group">
            <label class="field-label">Job Title</label>
            <div class="input-wrap">
              <Briefcase :size="15" class="input-icon" />
              <input v-model="professional.job_title" type="text" class="f-input" placeholder="e.g. Frontend Developer" />
            </div>
          </div>

          <!-- Company -->
          <div class="field-group">
            <label class="field-label">Company</label>
            <div class="input-wrap">
              <Building2 :size="15" class="input-icon" />
              <input v-model="professional.company_name" type="text" class="f-input" placeholder="Company name" />
            </div>
          </div>

          <!-- Responsibility -->
          <div class="field-group">
            <label class="field-label">Responsibility</label>
            <textarea
              v-model="professional.responsibility"
              class="f-textarea"
              rows="4"
              placeholder="Describe your key responsibilities…"
            />
            <span class="char-count">{{ professional.responsibility?.length ?? 0 }} / 500</span>
          </div>

          <!-- Change password section -->
          <div class="divider-section">
            <span>Change Password</span>
          </div>

          <div class="field-group">
            <label class="field-label">Current Password</label>
            <div class="input-wrap">
              <KeyRound :size="15" class="input-icon" />
              <input v-model="passwords.current" :type="showPwd[0] ? 'text' : 'password'" class="f-input pe-10" placeholder="Current password" />
              <button class="pwd-toggle" @click="showPwd[0] = !showPwd[0]">
                <Eye v-if="!showPwd[0]" :size="14" /><EyeOff v-else :size="14" />
              </button>
            </div>
          </div>
          <div class="row g-3">
            <div class="col-6">
              <div class="field-group mb-0">
                <label class="field-label">New Password</label>
                <div class="input-wrap">
                  <KeyRound :size="15" class="input-icon" />
                  <input v-model="passwords.password" :type="showPwd[1] ? 'text' : 'password'" class="f-input pe-10" placeholder="New password" />
                  <button class="pwd-toggle" @click="showPwd[1] = !showPwd[1]">
                    <Eye v-if="!showPwd[1]" :size="14" /><EyeOff v-else :size="14" />
                  </button>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="field-group mb-0">
                <label class="field-label">Confirm Password</label>
                <div class="input-wrap">
                  <KeyRound :size="15" class="input-icon" />
                  <input v-model="passwords.password_confirmation" :type="showPwd[2] ? 'text' : 'password'" class="f-input pe-10" placeholder="Confirm" />
                  <button class="pwd-toggle" @click="showPwd[2] = !showPwd[2]">
                    <Eye v-if="!showPwd[2]" :size="14" /><EyeOff v-else :size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Save professional -->
          <div class="form-footer">
            <button
              class="btn-ghost-v"
              :disabled="!passwords.current"
              @click="savePassword"
            >
              <KeyRound :size="13" class="me-1" /> Update Password
            </button>
            <button class="btn-save" :disabled="savingPro" @click="saveProfessional">
              <Loader2 v-if="savingPro" :size="14" class="spin me-1 " />
              <Save v-else :size="14" class="me-1 text-black"  />
                <div class="text-black">{{ savingPro ? 'Saving…' : 'Save Professional' }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast -->
  <Transition name="toast">
    <div v-if="toast.show" class="toast-snack" :class="toast.type">
      <CheckCircle2 v-if="toast.type === 'success'" :size="15" />
      <XCircle      v-else :size="15" />
      {{ toast.msg }}
    </div>
  </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import {
  ArrowLeft, UserCog, User, CalendarDays, Phone,
  MapPin, Home, Globe, Briefcase, Building2, Save,
  Loader2, CheckCircle2, XCircle, KeyRound, Eye, EyeOff
} from "lucide-vue-next"
import { useAuthStores }   from "@/stores/auth"
import { useProfileStore } from "@/stores/profile"

const auth         = useAuthStores()
const profileStore = useProfileStore()

// ── State ──────────────────────────────────────────────────
const personal = ref({
  full_name:      "",
  dob:            "",
  gender:         1,
  phone:          "",
  current_city:   "",
  home_town:      "",
  portfolio_link: "",
})

const professional = ref({
  job_title:      "",
  company_name:   "",
  responsibility: "",
})

const passwords = ref({
  current:               "",
  password:              "",
  password_confirmation: "",
})

const showPwd       = ref([false, false, false])
const savingPersonal = ref(false)
const savingPro      = ref(false)
const toast          = ref({ show: false, msg: "", type: "success" })

// ── Load existing data ─────────────────────────────────────
onMounted(async () => {
  try {
    const res = await auth.profile()
    // res.data → { result, code, message, data: { full_name, dob, gender, phone, current_city, home_town, portfolio_link, professional: { job_title, company_name, responsibility } } }
    if (res.data.result) {
      const d = res.data.data
      personal.value = {
        full_name:      d.full_name      ?? "",
        dob:            d.dob?.split("T")[0] ?? "",   // trim ISO time if present
        gender:         d.gender         ?? 1,
        phone:          d.phone          ?? "",
        current_city:   d.current_city   ?? "",
        home_town:      d.home_town      ?? "",
        portfolio_link: d.portfolio_link ?? "",
      }
      professional.value = {
        job_title:      d.professional?.job_title      ?? "",
        company_name:   d.professional?.company_name   ?? "",
        responsibility: d.professional?.responsibility ?? "",
      }
    }
  } catch (e) {
    console.error("Failed to load profile", e)
  }
})

// ── Save personal info ─────────────────────────────────────
// Calls PUT /api/profile/personal
// payload: { full_name, dob, gender, current_city, home_town, phone, portfolio_link }
async function savePersonal() {
  savingPersonal.value = true
  try {
    const res = await profileStore.updatePersonalInfo(personal.value)
    if (res.data.result) showToast("Personal info saved!", "success")
    else showToast(res.data.message || "Failed to save.", "error")
  } catch (e) {
    showToast("Something went wrong.", "error")
  } finally {
    savingPersonal.value = false
  }
}

// ── Save professional info ─────────────────────────────────
// Calls PUT /api/profile/professional
// payload: { job_title, company_name, responsibility }
async function saveProfessional() {
  savingPro.value = true
  try {
    const res = await profileStore.updateProfessional(professional.value)
    if (res.data.result) showToast("Professional info saved!", "success")
    else showToast(res.data.message || "Failed to save.", "error")
  } catch (e) {
    showToast("Something went wrong.", "error")
  } finally {
    savingPro.value = false
  }
}

// ── Change password ────────────────────────────────────────
// Calls PUT /api/profile/password
// payload: { current_password, password, password_confirmation }
async function savePassword() {
  if (passwords.value.password !== passwords.value.password_confirmation) {
    showToast("Passwords do not match.", "error"); return
  }
  try {
    const res = await profileStore.changePassword({
      current_password:      passwords.value.current,
      password:              passwords.value.password,
      password_confirmation: passwords.value.password_confirmation,
    })
    if (res.data.result) {
      showToast("Password updated!", "success")
      passwords.value = { current: "", password: "", password_confirmation: "" }
    } else {
      showToast(res.data.message || "Failed.", "error")
    }
  } catch (e) {
    showToast("Something went wrong.", "error")
  }
}

// ── Toast helper ───────────────────────────────────────────
function showToast(msg, type = "success") {
  toast.value = { show: true, msg, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}
</script>

<style scoped>
/* ── Tokens ── */
:root {
  --v:      #6d28d9;
  --v-l:    #ede9fe;
  --v-m:    #7c3aed;
  --v-d:    #4c1d95;
  --border: #e9e3ff;
  --text:   #1e1b4b;
  --muted:  #6b7280;
  --shadow: 0 2px 20px rgba(109,40,217,.07);
  --r:      14px;
}

/* ── Page header ── */
.page-title-row { display:flex; align-items:center; gap:12px; margin:32px 0 24px; }
.back-btn {
  width:36px; height:36px; border-radius:9px;
  border:1.5px solid var(--border); background:#fff;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; color:var(--text);
  transition:background .15s, border-color .15s;
}
.back-btn:hover { background:var(--v-l); border-color:var(--v-m); color:var(--v-m); }
.page-icon-wrap {
  width:38px; height:38px; border-radius:9px;
  background:var(--v-l); color:var(--v-m);
  display:flex; align-items:center; justify-content:center;
}
.page-title { font-size:1.1rem; font-weight:800; color:var(--text); margin:0; letter-spacing:-.025em; }
.page-sub   { font-size:.76rem; color:var(--muted); margin:0; }

/* ── Form card ── */
.form-card {
  background:#fff;
  border:1px solid var(--border);
  border-radius:var(--r);
  box-shadow:var(--shadow);
  overflow:hidden;
  margin-bottom:20px;
}
.form-card-header {
  display:flex; align-items:center; gap:12px;
  padding:18px 22px;
  border-bottom:1px solid var(--border);
  background:linear-gradient(135deg,#faf9ff,#f5f3ff);
}
.header-icon-wrap {
  width:36px; height:36px; border-radius:9px;
  background:var(--v-l); color:var(--v-m);
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0;
}
.card-heading { font-size:.88rem; font-weight:800; color:var(--text); margin:0; }
.card-sub     { font-size:.72rem; color:var(--muted); margin:0; }

.form-body { padding:22px; }

/* ── Fields ── */
.field-group { margin-bottom:18px; }
.field-label {
  display:block; font-size:.7rem; font-weight:800;
  text-transform:uppercase; letter-spacing:.07em;
  color:#a78bfa; margin-bottom:6px;
}
.req { color:#ef4444; }

.input-wrap { position:relative; }
.input-icon {
  position:absolute; left:12px; top:50%; transform:translateY(-50%);
  color:#a78bfa; pointer-events:none;
}
.f-input {
  width:100%; padding:9px 12px 9px 36px;
  border:1.5px solid var(--border);
  border-radius:9px; font-size:.86rem;
  color:var(--text); background:#faf9ff;
  outline:none; transition:border-color .15s, box-shadow .15s;
  font-family:inherit;
}
.f-input:focus {
  border-color:var(--v-m);
  box-shadow:0 0 0 3px rgba(124,58,237,.1);
  background:#fff;
}
.f-input.pe-10 { padding-right:38px; }

.f-textarea {
  width:100%; padding:10px 12px;
  border:1.5px solid var(--border);
  border-radius:9px; font-size:.86rem;
  color:var(--text); background:#faf9ff;
  outline:none; resize:vertical; min-height:96px;
  transition:border-color .15s, box-shadow .15s;
  font-family:inherit; line-height:1.6;
}
.f-textarea:focus {
  border-color:var(--v-m);
  box-shadow:0 0 0 3px rgba(124,58,237,.1);
  background:#fff;
}
.char-count { font-size:.68rem; color:#a78bfa; float:right; margin-top:4px; }

.pwd-toggle {
  position:absolute; right:10px; top:50%; transform:translateY(-50%);
  background:none; border:none; cursor:pointer;
  color:var(--muted); padding:2px;
}
.pwd-toggle:hover { color:var(--v-m); }

/* ── Gender ── */
.gender-row { display:flex; gap:8px; flex-wrap:wrap; }
.gender-opt {
  flex:1; min-width:80px;
  display:flex; align-items:center; justify-content:center; gap:6px;
  padding:8px 10px; border-radius:9px;
  border:1.5px solid var(--border); background:#faf9ff;
  font-size:.82rem; font-weight:500; cursor:pointer;
  transition:all .15s; color:var(--muted);
}
.gender-opt.active {
  border-color:var(--v-m); background:var(--v-l);
  color:var(--v-m); font-weight:700;
}
.gender-icon { font-size:1rem; }

/* ── Divider ── */
.divider-section {
  display:flex; align-items:center; gap:10px;
  font-size:.72rem; font-weight:700; text-transform:uppercase;
  letter-spacing:.07em; color:#a78bfa;
  margin:22px 0 16px;
}
.divider-section::before, .divider-section::after {
  content:""; flex:1; height:1px; background:var(--border);
}

/* ── Footer buttons ── */
.form-footer {
  display:flex; justify-content:flex-end; gap:10px;
  margin-top:22px; padding-top:18px;
  border-top:1px solid var(--border);
}
.btn-save {
  display:inline-flex; align-items:center; gap:6px;
  background:var(--v-m); color:#fff;
  border:none; border-radius:9px;
  padding:9px 20px; font-size:.84rem; font-weight:600;
  cursor:pointer; font-family:inherit;
  box-shadow:0 3px 12px rgba(109,40,217,.28);
  transition:background .15s, transform .1s;
}
.btn-save:hover:not(:disabled) { background:var(--v-d); transform:translateY(-1px); }
.btn-save:disabled { opacity:.55; cursor:not-allowed; }

.btn-ghost-v {
  display:inline-flex; align-items:center; gap:6px;
  background:var(--v-l); color:var(--v-m);
  border:1px solid #ddd6fe; border-radius:9px;
  padding:8px 18px; font-size:.84rem; font-weight:600;
  cursor:pointer; font-family:inherit;
  transition:background .15s;
}
.btn-ghost-v:hover:not(:disabled) { background:#ddd6fe; }
.btn-ghost-v:disabled { opacity:.45; cursor:not-allowed; }

/* ── Spinner ── */
.spin { animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

/* ── Toast ── */
.toast-snack {
  position:fixed; bottom:28px; left:50%; transform:translateX(-50%);
  display:inline-flex; align-items:center; gap:8px;
  padding:11px 22px; border-radius:10px;
  font-size:.84rem; font-weight:600;
  box-shadow:0 6px 24px rgba(0,0,0,.15);
  z-index:9999; white-space:nowrap;
}
.toast-snack.success { background:#6d28d9; color:#fff; }
.toast-snack.error   { background:#dc2626; color:#fff; }
.toast-enter-active, .toast-leave-active { transition:opacity .25s, transform .25s; }
.toast-enter-from, .toast-leave-to       { opacity:0; transform:translateX(-50%) translateY(10px); }
</style>