<template>
  <!-- Page header -->
  <div class="page-title-row">
    <button class="back-btn" @click="$router.back()">
      <ArrowLeft :size="16" />
    </button>
    <div class="page-icon-wrap"><GraduationCap :size="18" /></div>
    <div>
      <h3 class="page-title">Education</h3>
      <p class="page-sub">Add or update your academic background</p>
    </div>
  </div>

  <div class="row g-4">
    <!-- ══ LEFT: Form ══ -->
    <div class="col-lg-5">
      <div class="form-card">
        <div class="form-card-header">
          <div class="header-icon-wrap">
            <component :is="editingId ? Pencil : Plus" :size="16" />
          </div>
          <div>
            <h6 class="card-heading">{{ editingId ? 'Edit Record' : 'Add Education' }}</h6>
            <p class="card-sub">{{ editingId ? 'Update the record below' : 'Fill in your education details' }}</p>
          </div>
        </div>

        <div class="form-body">

          <!-- School -->
          <!--
            API field: school → { id, name }
            Send: school_id (existing) OR school_name (new custom)
          -->
          <div class="field-group">
            <label class="field-label">School / University <span class="req">*</span></label>
            <div class="input-wrap">
              <Building2 :size="15" class="input-icon" />
              <input
                v-model="schoolSearch"
                type="text"
                class="f-input"
                placeholder="Search or enter school name…"
                @input="filterSchools"
                @focus="showSchoolDrop = true"
                @blur="delayHide('school')"
              />
            </div>
            <!-- Dropdown -->
            <Transition name="drop">
              <div class="auto-drop" v-if="showSchoolDrop && filteredSchools.length">
                <button
                  class="drop-item"
                  v-for="s in filteredSchools"
                  :key="s.id"
                  @mousedown.prevent="selectSchool(s)"
                >
                  <Building2 :size="12" /> {{ s.name }}
                </button>
              </div>
            </Transition>
            <!-- Selected pill -->
            <div class="selected-pill" v-if="form.school_id && form.school_name">
              <CheckCircle2 :size="11" /> {{ form.school_name }}
              <button class="pill-remove" @click="clearSchool"><X :size="10" /></button>
            </div>
          </div>

          <!-- Degree -->
          <!--
            API field: degree → { id, name }
            Send: degree_id (existing) OR degree_name (new custom)
          -->
          <div class="field-group">
            <label class="field-label">Degree / Level <span class="req">*</span></label>
            <div class="select-wrap">
              <Award :size="15" class="input-icon" />
              <select v-model="form.degree_id" class="f-select" @change="onDegreeChange">
                <option value="" disabled>Select degree level</option>
                <option v-for="d in degrees" :key="d.id" :value="d.id">{{ d.name }}</option>
                <option value="custom">Other (type below)</option>
              </select>
              <ChevronDown :size="14" class="select-arrow" />
            </div>
            <!-- Custom degree input -->
            <div class="input-wrap mt-2" v-if="form.degree_id === 'custom'">
              <Pencil :size="15" class="input-icon" />
              <input v-model="form.degree_name_custom" type="text" class="f-input" placeholder="Enter degree name" />
            </div>
          </div>

          <!-- Subject / Major -->
          <!--
            API field: subject → { id, name }
            Send: subject_id (existing) OR subject_name (new custom)
          -->
          <div class="field-group">
            <label class="field-label">Subject / Major</label>
            <div class="input-wrap">
              <BookOpen :size="15" class="input-icon" />
              <input
                v-model="subjectSearch"
                type="text"
                class="f-input"
                placeholder="Search or enter subject…"
                @input="filterSubjects"
                @focus="showSubjectDrop = true"
                @blur="delayHide('subject')"
              />
            </div>
            <Transition name="drop">
              <div class="auto-drop" v-if="showSubjectDrop && filteredSubjects.length">
                <button
                  class="drop-item"
                  v-for="s in filteredSubjects"
                  :key="s.id"
                  @mousedown.prevent="selectSubject(s)"
                >
                  <BookOpen :size="12" /> {{ s.name }}
                </button>
              </div>
            </Transition>
            <div class="selected-pill" v-if="form.subject_id && form.subject_name">
              <CheckCircle2 :size="11" /> {{ form.subject_name }}
              <button class="pill-remove" @click="clearSubject"><X :size="10" /></button>
            </div>
          </div>

          <!-- Start date / End date -->
          <!--
            API format: start_date → "2023-01"  (YYYY-MM)
                        end_date   → "2026-06"  or null if ongoing
          -->
          <div class="row g-3">
            <div class="col-6">
              <div class="field-group mb-0">
                <label class="field-label">Start Date <span class="req">*</span></label>
                <div class="input-wrap">
                  <CalendarDays :size="15" class="input-icon" />
                  <input v-model="form.start_date" type="month" class="f-input" />
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="field-group mb-0">
                <label class="field-label">End Date</label>
                <div class="input-wrap">
                  <CalendarDays :size="15" class="input-icon" />
                  <input
                    v-model="form.end_date"
                    type="month"
                    class="f-input"
                    :disabled="form.is_current"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Currently studying toggle -->
          <label class="toggle-row mt-3">
            <span class="toggle-label">Currently studying here</span>
            <span class="toggle-wrap">
              <input type="checkbox" v-model="form.is_current" class="toggle-input" @change="onCurrentChange" />
              <span class="toggle-track"><span class="toggle-thumb" /></span>
            </span>
          </label>

          <!-- Description -->
          <!--
            API field: description → plain string
          -->
          <div class="field-group">
            <label class="field-label">Description <span class="optional">(optional)</span></label>
            <textarea
              v-model="form.description"
              class="f-textarea"
              rows="3"
              placeholder="Activities, achievements, GPA…"
              maxlength="500"
            />
            <span class="char-count">{{ form.description?.length ?? 0 }} / 500</span>
          </div>

          <!-- Actions -->
          <div class="form-footer">
            <button v-if="editingId" class="btn-ghost-v" @click="cancelEdit">
              <X :size="14" /> Cancel
            </button>
            <button v-else class="btn-ghost-v" @click="resetForm">
              <RefreshCcw :size="14" /> Reset
            </button>
            <button
              class="btn-save"
              :disabled="saving || !canSubmit"
              @click="save"
            >
              <Loader2 v-if="saving" :size="14" class="spin" />
              <component :is="editingId ? Save : Plus" v-else :size="14" />
              {{ saving ? 'Saving…' : editingId ? 'Update' : 'Add Education' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ RIGHT: Records list ══ -->
    <div class="col-lg-7">
      <div class="form-card">
        <div class="form-card-header">
          <div class="header-icon-wrap" style="background:#f0fdf4;color:#166534;"><ListChecks :size="16" /></div>
          <div>
            <h6 class="card-heading">Education Records</h6>
            <p class="card-sub">{{ educations.length }} record{{ educations.length !== 1 ? 's' : '' }}</p>
          </div>
        </div>

        <!-- Skeleton -->
        <div class="list-skeleton" v-if="loading">
          <div class="sk-row" v-for="n in 3" :key="n">
            <div class="sk sk-circle-sm"></div>
            <div class="flex-grow-1">
              <div class="sk sk-line mb-1" style="width:55%;height:12px;"></div>
              <div class="sk sk-line" style="width:35%;height:10px;"></div>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div class="empty-state" v-else-if="!educations.length">
          <div class="empty-icon"><GraduationCap :size="26" /></div>
          <p class="empty-t">No records yet</p>
          <p class="empty-s">Add your first education entry</p>
        </div>

        <!-- List -->
        <!--
          Each edu item shape from API:
          {
            id, description, start_date, end_date,
            school:  { id, name },
            degree:  { id, name },
            subject: { id, name }
          }
        -->
        <div class="edu-list" v-else>
          <div
            class="edu-row"
            v-for="(edu, i) in educations"
            :key="edu.id"
            :style="`--d:${i * 50}ms`"
            :class="{ 'is-editing': editingId === edu.id }"
          >
            <div class="edu-dot-wrap">
              <div class="edu-dot" />
              <div class="edu-line" v-if="i < educations.length - 1" />
            </div>
            <div class="edu-content flex-grow-1 min-w-0">
              <!-- Degree badge -->
              <span class="degree-badge" v-if="edu.degree?.name">{{ edu.degree.name }}</span>
              <!-- Subject -->
              <p class="edu-subject">{{ edu.subject?.name || '—' }}</p>
              <!-- School -->
              <p class="edu-school">
                <Building2 :size="11" class="me-1" />
                {{ edu.school?.name || '—' }}
              </p>
              <!-- Dates -->
              <p class="edu-dates">
                <CalendarDays :size="11" class="me-1" />
                {{ edu.start_date || '—' }}
                <span v-if="edu.end_date"> → {{ edu.end_date }}</span>
                <span v-else class="current-badge">Ongoing</span>
              </p>
              <!-- Description preview -->
              <p class="edu-desc" v-if="edu.description">{{ edu.description }}</p>
            </div>
            <div class="edu-actions">
              <button class="icon-btn" title="Edit" @click="startEdit(edu)">
                <Pencil :size="14" />
              </button>
              <button class="icon-btn icon-btn-danger" title="Delete" @click="confirmDelete(edu)">
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete confirm modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal-backdrop" v-if="deleteTarget" @click.self="deleteTarget = null">
        <div class="modal-box">
          <div class="modal-icon warn"><AlertTriangle :size="24" /></div>
          <h6 class="modal-title">Delete Education?</h6>
          <p class="modal-msg">
            Remove <strong>{{ deleteTarget?.degree?.name }}</strong> at
            <strong>{{ deleteTarget?.school?.name }}</strong>?
          </p>
          <div class="modal-footer">
            <button class="btn-ghost-v" @click="deleteTarget = null">Cancel</button>
            <button class="btn-danger-v" :disabled="deleting" @click="doDelete">
              <Loader2 v-if="deleting" :size="13" class="spin me-1" />
              <Trash2 v-else :size="13" class="me-1" />
              {{ deleting ? 'Deleting…' : 'Yes, Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Toast -->
  <Transition name="toast">
    <div v-if="toast.show" class="toast-snack" :class="toast.type">
      <CheckCircle2 v-if="toast.type === 'success'" :size="15" />
      <XCircle v-else :size="15" />
      {{ toast.msg }}
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import {
  ArrowLeft, GraduationCap, Plus, Pencil, Save, Trash2, X,
  Building2, Award, BookOpen, CalendarDays, ListChecks,
  RefreshCcw, Loader2, CheckCircle2, XCircle, AlertTriangle,
  ChevronDown
} from "lucide-vue-next"
import { useAuthStores }   from "@/stores/auth"
import { useProfileStore } from "@/stores/profile"

const auth         = useAuthStores()
const profileStore = useProfileStore()

// ──────────────────────────────────────────────────────────
// State
// ──────────────────────────────────────────────────────────
const educations   = ref([])
const loading      = ref(true)
const saving       = ref(false)
const deleting     = ref(false)
const editingId    = ref(null)
const deleteTarget = ref(null)
const toast        = ref({ show: false, msg: "", type: "success" })

// Autocomplete UI state
const schoolSearch    = ref("")
const subjectSearch   = ref("")
const showSchoolDrop  = ref(false)
const showSubjectDrop = ref(false)
const filteredSchools  = ref([])
const filteredSubjects = ref([])

// ──────────────────────────────────────────────────────────
// Static lookup data
// Ideally fetched from API: GET /api/schools, /api/degrees, /api/subjects
// Replace with your actual API calls if available
// ──────────────────────────────────────────────────────────
const allSchools = ref([
  { id: 1, name: "Phnom Penh International University" },
  { id: 2, name: "Royal University of Phnom Penh" },
  { id: 3, name: "Institute of Technology of Cambodia" },
  { id: 4, name: "Norton University" },
  { id: 5, name: "Paragon International University" },
])

const degrees = ref([
  { id: 1, name: "Bachelor"  },
  { id: 2, name: "Master"    },
  { id: 3, name: "PhD"       },
  { id: 4, name: "Associate" },
  { id: 5, name: "Diploma"   },
  { id: 6, name: "Certificate" },
])

const allSubjects = ref([
  { id: 1, name: "Computer Science"     },
  { id: 2, name: "Computer Graphic"     },
  { id: 3, name: "Information Technology" },
  { id: 4, name: "Software Engineering" },
  { id: 5, name: "Business Administration" },
  { id: 6, name: "Data Science"         },
])

// ──────────────────────────────────────────────────────────
// Form model — matches API send payload:
// POST /api/profile/educations
// {
//   school_id?:          number   (if existing school selected)
//   school_name?:        string   (if typed new school)
//   degree_id?:          number
//   degree_name?:        string   (if custom)
//   subject_id?:         number
//   subject_name?:       string   (if typed new)
//   start_date:          "YYYY-MM"
//   end_date:            "YYYY-MM" | null
//   description?:        string
// }
// ──────────────────────────────────────────────────────────
const emptyForm = () => ({
  school_id:          null,
  school_name:        "",
  degree_id:          "",
  degree_name_custom: "",
  subject_id:         null,
  subject_name:       "",
  start_date:         "",
  end_date:           "",
  is_current:         false,
  description:        "",
})
const form = ref(emptyForm())

const canSubmit = computed(() =>
  (form.value.school_id || schoolSearch.value) &&
  form.value.degree_id &&
  form.value.start_date
)

// ──────────────────────────────────────────────────────────
// Load profile → extract educations[]
// ──────────────────────────────────────────────────────────
onMounted(async () => {
  loading.value = true
  try {
    const res = await auth.profile()
    // res.data.data.educations → [{ id, school:{id,name}, degree:{id,name}, subject:{id,name}, description, start_date, end_date }]
    if (res.data.result) educations.value = res.data.data.educations ?? []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})

// ──────────────────────────────────────────────────────────
// Autocomplete helpers
// ──────────────────────────────────────────────────────────
function filterSchools() {
  const q = schoolSearch.value.toLowerCase()
  filteredSchools.value = q
    ? allSchools.value.filter(s => s.name.toLowerCase().includes(q))
    : []
}

function selectSchool(s) {
  form.value.school_id   = s.id
  form.value.school_name = s.name
  schoolSearch.value     = s.name
  showSchoolDrop.value   = false
  filteredSchools.value  = []
}

function clearSchool() {
  form.value.school_id   = null
  form.value.school_name = ""
  schoolSearch.value     = ""
}

function filterSubjects() {
  const q = subjectSearch.value.toLowerCase()
  filteredSubjects.value = q
    ? allSubjects.value.filter(s => s.name.toLowerCase().includes(q))
    : []
}

function selectSubject(s) {
  form.value.subject_id   = s.id
  form.value.subject_name = s.name
  subjectSearch.value     = s.name
  showSubjectDrop.value   = false
  filteredSubjects.value  = []
}

function clearSubject() {
  form.value.subject_id   = null
  form.value.subject_name = ""
  subjectSearch.value     = ""
}

function delayHide(field) {
  setTimeout(() => {
    if (field === "school")  showSchoolDrop.value  = false
    if (field === "subject") showSubjectDrop.value = false
  }, 150)
}

function onDegreeChange() {
  if (form.value.degree_id !== "custom") form.value.degree_name_custom = ""
}

function onCurrentChange() {
  if (form.value.is_current) form.value.end_date = ""
}

// ──────────────────────────────────────────────────────────
// Build API payload from form
// ──────────────────────────────────────────────────────────
function buildPayload() {
  const p = {
    start_date:  form.value.start_date,
    end_date:    form.value.is_current ? null : (form.value.end_date || null),
    description: form.value.description || null,
  }

  // School: prefer id, fall back to typed name
  if (form.value.school_id) {
    p.school_id = form.value.school_id
  } else if (schoolSearch.value) {
    p.school_name = schoolSearch.value
  }

  // Degree: prefer id, fall back to custom text
  if (form.value.degree_id && form.value.degree_id !== "custom") {
    p.degree_id = form.value.degree_id
  } else if (form.value.degree_name_custom) {
    p.degree_name = form.value.degree_name_custom
  }

  // Subject: prefer id, fall back to typed name
  if (form.value.subject_id) {
    p.subject_id = form.value.subject_id
  } else if (subjectSearch.value) {
    p.subject_name = subjectSearch.value
  }

  return p
}

// ──────────────────────────────────────────────────────────
// Save (create or update)
// POST /api/profile/educations        { school_id|school_name, degree_id|degree_name, subject_id|subject_name, start_date, end_date, description }
// PUT  /api/profile/educations/:id    same payload
// Response: { result, code, message, data: { ...full profile including educations[] } }
// ──────────────────────────────────────────────────────────
async function save() {
  saving.value = true
  try {
    const payload = buildPayload()
    let res
    if (editingId.value) {
      res = await profileStore.updateEducation(editingId.value, payload)
    } else {
      res = await profileStore.addEducation(payload)
    }
    // API returns full profile → extract educations[]
    if (res.data.result) {
      educations.value = res.data.data.educations ?? []
      showToast(editingId.value ? "Education updated!" : "Education added!", "success")
      cancelEdit()
    } else {
      showToast(res.data.message || "Failed.", "error")
    }
  } catch (e) {
    showToast("Something went wrong.", "error")
  } finally {
    saving.value = false
  }
}

// ──────────────────────────────────────────────────────────
// Edit — populate form from existing record
// ──────────────────────────────────────────────────────────
function startEdit(edu) {
  editingId.value = edu.id

  // School
  form.value.school_id   = edu.school?.id   ?? null
  form.value.school_name = edu.school?.name ?? ""
  schoolSearch.value     = edu.school?.name ?? ""

  // Degree — check if it matches a known preset
  const matchedDegree = degrees.value.find(d => d.id === edu.degree?.id)
  form.value.degree_id          = matchedDegree ? matchedDegree.id : "custom"
  form.value.degree_name_custom = !matchedDegree ? (edu.degree?.name ?? "") : ""

  // Subject
  form.value.subject_id   = edu.subject?.id   ?? null
  form.value.subject_name = edu.subject?.name ?? ""
  subjectSearch.value     = edu.subject?.name ?? ""

  form.value.start_date  = edu.start_date  ?? ""
  form.value.end_date    = edu.end_date    ?? ""
  form.value.is_current  = !edu.end_date
  form.value.description = edu.description ?? ""

  window.scrollTo({ top: 0, behavior: "smooth" })
}

function cancelEdit() {
  editingId.value = null
  schoolSearch.value  = ""
  subjectSearch.value = ""
  form.value = emptyForm()
}

function resetForm() {
  cancelEdit()
}

// ──────────────────────────────────────────────────────────
// Delete
// DELETE /api/profile/educations/:id
// Response: { result, code, message, data: { ...full profile } }
// ──────────────────────────────────────────────────────────
function confirmDelete(edu) { deleteTarget.value = edu }

async function doDelete() {
  deleting.value = true
  try {
    const res = await profileStore.deleteEducation(deleteTarget.value.id)
    if (res.data.result) {
      educations.value = res.data.data.educations ?? educations.value.filter(e => e.id !== deleteTarget.value.id)
      showToast("Education deleted.", "success")
      deleteTarget.value = null
    } else {
      showToast(res.data.message || "Failed.", "error")
    }
  } catch (e) {
    showToast("Something went wrong.", "error")
  } finally {
    deleting.value = false
  }
}

function showToast(msg, type = "success") {
  toast.value = { show: true, msg, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}
</script>

<style scoped>
:root {
  --v:#6d28d9; --v-l:#ede9fe; --v-m:#7c3aed; --v-d:#4c1d95;
  --border:#e9e3ff; --text:#1e1b4b; --muted:#6b7280;
  --shadow:0 2px 20px rgba(109,40,217,.07); --r:14px;
}

/* ── Layout ── */
.page-title-row { display:flex; align-items:center; gap:12px; margin:32px 0 24px; }
.back-btn {
  width:36px; height:36px; border-radius:9px; border:1.5px solid var(--border);
  background:#fff; display:flex; align-items:center; justify-content:center;
  cursor:pointer; color:var(--text); transition:background .15s, border-color .15s;
}
.back-btn:hover { background:var(--v-l); border-color:var(--v-m); color:var(--v-m); }
.page-icon-wrap { width:38px; height:38px; border-radius:9px; background:var(--v-l); color:var(--v-m); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.page-title { font-size:1.1rem; font-weight:800; color:var(--text); margin:0; letter-spacing:-.025em; }
.page-sub   { font-size:.76rem; color:var(--muted); margin:0; }

/* ── Card ── */
.form-card { background:#fff; border:1px solid var(--border); border-radius:var(--r); box-shadow:var(--shadow); overflow:hidden; margin-bottom:20px; }
.form-card-header { display:flex; align-items:center; gap:12px; padding:18px 22px; border-bottom:1px solid var(--border); background:linear-gradient(135deg,#faf9ff,#f5f3ff); }
.header-icon-wrap { width:36px; height:36px; border-radius:9px; background:var(--v-l); color:var(--v-m); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.card-heading { font-size:.88rem; font-weight:800; color:var(--text); margin:0; }
.card-sub     { font-size:.72rem; color:var(--muted); margin:0; }
.form-body    { padding:22px; }

/* ── Fields ── */
.field-group  { margin-bottom:16px; position:relative; }
.field-label  { display:block; font-size:.7rem; font-weight:800; text-transform:uppercase; letter-spacing:.07em; color:#a78bfa; margin-bottom:6px; }
.req          { color:#ef4444; }
.optional     { font-size:.65rem; color:var(--muted); text-transform:none; font-weight:500; letter-spacing:0; }

.input-wrap   { position:relative; }
.input-icon   { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#a78bfa; pointer-events:none; z-index:1; }
.f-input {
  width:100%; padding:9px 12px 9px 36px; border:1.5px solid var(--border); border-radius:9px;
  font-size:.86rem; color:var(--text); background:#faf9ff; outline:none; font-family:inherit;
  transition:border-color .15s, box-shadow .15s;
}
.f-input:focus { border-color:var(--v-m); box-shadow:0 0 0 3px rgba(124,58,237,.1); background:#fff; }
.f-input:disabled { opacity:.45; }

/* ── Select ── */
.select-wrap  { position:relative; }
.f-select {
  width:100%; padding:9px 36px 9px 36px; border:1.5px solid var(--border); border-radius:9px;
  font-size:.86rem; color:var(--text); background:#faf9ff; outline:none; font-family:inherit;
  appearance:none; cursor:pointer; transition:border-color .15s, box-shadow .15s;
}
.f-select:focus { border-color:var(--v-m); box-shadow:0 0 0 3px rgba(124,58,237,.1); background:#fff; }
.select-arrow { position:absolute; right:12px; top:50%; transform:translateY(-50%); color:#a78bfa; pointer-events:none; }

/* ── Autocomplete dropdown ── */
.auto-drop {
  position:absolute; top:100%; left:0; right:0; z-index:50;
  background:#fff; border:1.5px solid var(--border); border-radius:10px;
  box-shadow:0 8px 24px rgba(109,40,217,.12); overflow:hidden; margin-top:4px;
}
.drop-item {
  display:flex; align-items:center; gap:8px; width:100%;
  padding:9px 14px; font-size:.83rem; font-weight:500;
  background:none; border:none; cursor:pointer; text-align:left;
  color:var(--text); font-family:inherit; transition:background .12s;
}
.drop-item:hover { background:var(--v-l); color:var(--v-m); }
.drop-enter-active, .drop-leave-active { transition:opacity .15s, transform .15s; }
.drop-enter-from, .drop-leave-to       { opacity:0; transform:translateY(-4px); }

/* ── Selected pill ── */
.selected-pill {
  display:inline-flex; align-items:center; gap:5px;
  background:var(--v-l); color:var(--v-d); font-size:.74rem; font-weight:700;
  padding:3px 10px; border-radius:20px; border:1px solid #ddd6fe; margin-top:6px;
}
.pill-remove { background:none; border:none; cursor:pointer; color:#a78bfa; display:inline-flex; padding:0; }
.pill-remove:hover { color:#dc2626; }

/* ── Toggle ── */
.toggle-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; cursor:pointer; }
.toggle-label { font-size:.83rem; font-weight:500; color:var(--text); }
.toggle-wrap  { position:relative; }
.toggle-input { position:absolute; opacity:0; width:0; height:0; }
.toggle-track { display:block; width:40px; height:22px; border-radius:11px; background:#e5e7eb; transition:background .2s; position:relative; }
.toggle-input:checked + .toggle-track { background:var(--v-m); }
.toggle-thumb { position:absolute; top:3px; left:3px; width:16px; height:16px; border-radius:50%; background:#fff; transition:left .2s; box-shadow:0 1px 3px rgba(0,0,0,.2); }
.toggle-input:checked + .toggle-track .toggle-thumb { left:21px; }

/* ── Textarea ── */
.f-textarea {
  width:100%; padding:10px 12px; border:1.5px solid var(--border); border-radius:9px;
  font-size:.86rem; color:var(--text); background:#faf9ff; outline:none;
  resize:vertical; min-height:80px; font-family:inherit; line-height:1.6;
  transition:border-color .15s, box-shadow .15s;
}
.f-textarea:focus { border-color:var(--v-m); box-shadow:0 0 0 3px rgba(124,58,237,.1); background:#fff; }
.char-count { font-size:.68rem; color:#a78bfa; float:right; margin-top:4px; }

/* ── Footer buttons ── */
.form-footer { display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid var(--border); }
.btn-save { display:inline-flex; align-items:center; gap:6px; background:var(--v-m); color:#fff; border:none; border-radius:9px; padding:9px 20px; font-size:.84rem; font-weight:600; cursor:pointer; font-family:inherit; box-shadow:0 3px 12px rgba(109,40,217,.28); transition:background .15s, transform .1s; }
.btn-save:hover:not(:disabled) { background:var(--v-d); transform:translateY(-1px); }
.btn-save:disabled { opacity:.5; cursor:not-allowed; }
.btn-ghost-v { display:inline-flex; align-items:center; gap:6px; background:var(--v-l); color:var(--v-m); border:1px solid #ddd6fe; border-radius:9px; padding:8px 18px; font-size:.84rem; font-weight:600; cursor:pointer; font-family:inherit; transition:background .15s; }
.btn-ghost-v:hover { background:#ddd6fe; }

/* ── Skeleton ── */
.list-skeleton { padding:18px 22px; display:flex; flex-direction:column; gap:14px; }
.sk-row { display:flex; align-items:center; gap:12px; }
.sk { background:linear-gradient(90deg,#f3f0ff 25%,#e9e3ff 50%,#f3f0ff 75%); background-size:300% 100%; animation:shimmer 1.5s infinite; border-radius:6px; display:block; }
.sk-circle-sm { width:32px; height:32px; border-radius:50%; flex-shrink:0; }
@keyframes shimmer { from { background-position:100% 0; } to { background-position:-100% 0; } }

/* ── Empty ── */
.empty-state { padding:40px 20px; text-align:center; display:flex; flex-direction:column; align-items:center; }
.empty-icon { width:52px; height:52px; border-radius:13px; background:var(--v-l); color:var(--v-m); display:flex; align-items:center; justify-content:center; margin-bottom:12px; }
.empty-t { font-size:.9rem; font-weight:700; color:var(--text); margin:0 0 4px; }
.empty-s { font-size:.78rem; color:var(--muted); margin:0; }

/* ── Edu list ── */
.edu-list { padding:14px 8px; }
.edu-row {
  display:flex; align-items:flex-start; gap:0;
  padding:0 8px 0 0;
  animation:rowIn .3s var(--d,0ms) both;
  border-radius:10px; transition:background .15s;
}
.edu-row:hover { background:#faf9ff; }
.edu-row.is-editing { background:var(--v-l); border:1px solid #ddd6fe; }
@keyframes rowIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:none; } }

/* Timeline line + dot */
.edu-dot-wrap { display:flex; flex-direction:column; align-items:center; width:28px; flex-shrink:0; padding-top:4px; }
.edu-dot  { width:11px; height:11px; border-radius:50%; background:var(--v-m); border:2.5px solid var(--v-l); flex-shrink:0; }
.edu-line { flex:1; width:2px; background:var(--border); min-height:20px; margin-top:4px; }

.edu-content { padding:4px 0 16px 6px; min-width:0; }
.degree-badge { display:inline-block; background:var(--v-l); color:var(--v-d); font-size:.68rem; font-weight:800; padding:2px 9px; border-radius:20px; border:1px solid #ddd6fe; margin-bottom:4px; }
.edu-subject { font-size:.9rem; font-weight:700; color:var(--text); margin:0 0 2px; }
.edu-school  { font-size:.76rem; color:var(--muted); margin:0 0 2px; display:flex; align-items:center; }
.edu-dates   { font-size:.73rem; color:#a78bfa; margin:0 0 4px; display:flex; align-items:center; gap:3px; }
.edu-desc    { font-size:.76rem; color:var(--muted); margin:0; line-height:1.5; font-style:italic; }
.current-badge { background:#dcfce7; color:#166534; font-size:.64rem; font-weight:700; padding:1px 6px; border-radius:10px; margin-left:4px; }

.edu-actions { display:flex; gap:4px; flex-shrink:0; padding-top:4px; }
.icon-btn { width:30px; height:30px; border-radius:7px; border:1px solid var(--border); background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--muted); transition:all .15s; }
.icon-btn:hover { background:var(--v-l); color:var(--v-m); border-color:#ddd6fe; }
.icon-btn-danger:hover { background:#fff1f2; color:#dc2626; border-color:#fecaca; }
.min-w-0 { min-width:0; }
.flex-grow-1 { flex-grow:1; }

/* ── Modal ── */
.modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.4); display:flex; align-items:center; justify-content:center; z-index:1050; backdrop-filter:blur(4px); }
.modal-box { background:#fff; border-radius:16px; padding:32px 28px; max-width:380px; width:90%; text-align:center; }
.modal-icon { width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; }
.modal-icon.warn { background:#fef9c3; color:#ca8a04; }
.modal-title { font-size:.95rem; font-weight:800; color:var(--text); margin:0 0 8px; }
.modal-msg   { font-size:.82rem; color:var(--muted); margin:0 0 22px; line-height:1.6; }
.modal-footer { display:flex; gap:10px; justify-content:center; }
.btn-danger-v { display:inline-flex; align-items:center; gap:5px; background:#dc2626; color:#fff; border:none; border-radius:9px; padding:9px 20px; font-size:.84rem; font-weight:600; cursor:pointer; font-family:inherit; transition:background .15s; }
.btn-danger-v:hover:not(:disabled) { background:#b91c1c; }
.btn-danger-v:disabled { opacity:.5; cursor:not-allowed; }
.modal-enter-active, .modal-leave-active { transition:opacity .2s; }
.modal-enter-from, .modal-leave-to       { opacity:0; }
.modal-enter-active .modal-box { animation:popIn .25s cubic-bezier(.22,1,.36,1); }
@keyframes popIn { from { transform:scale(.92); opacity:0; } to { transform:scale(1); opacity:1; } }

/* ── Toast ── */
.toast-snack { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); display:inline-flex; align-items:center; gap:8px; padding:11px 22px; border-radius:10px; font-size:.84rem; font-weight:600; box-shadow:0 6px 24px rgba(0,0,0,.15); z-index:9999; white-space:nowrap; }
.toast-snack.success { background:#6d28d9; color:#fff; }
.toast-snack.error   { background:#dc2626; color:#fff; }
.toast-enter-active, .toast-leave-active { transition:opacity .25s, transform .25s; }
.toast-enter-from, .toast-leave-to       { opacity:0; transform:translateX(-50%) translateY(10px); }
.spin { animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
</style>