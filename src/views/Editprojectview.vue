<template>
 <div class="container">
  <!-- Page header -->
  <div class="page-title-row">
    <button class="back-btn" @click="$router.back()">
      <ArrowLeft :size="16" />
    </button>
    <div class="page-icon-wrap"><FolderOpen :size="18" /></div>
    <div>
      <h3 class="page-title">Projects</h3>
      <p class="page-sub">Showcase your work and portfolio</p>
    </div>
  </div>

  <div class="row g-4">
    <div class="col-lg-5">
      <div class="form-card">
        <div class="form-card-header">
          <div class="header-icon-wrap">
            <component :is="editingId ? Pencil : Plus" :size="16" />
          </div>
          <div>
            <h6 class="card-heading">{{ editingId ? 'Edit Project' : 'Add Project' }}</h6>
            <p class="card-sub">{{ editingId ? 'Update project details' : 'Add a project to your profile' }}</p>
          </div>
        </div>

        <div class="form-body">

          <div class="field-group">
            <label class="field-label">Project Title <span class="req">*</span></label>
            <div class="input-wrap">
              <FolderOpen :size="15" class="input-icon" />
              <input
                v-model="form.title"
                type="text"
                class="f-input"
                placeholder="e.g. DCC Government Portal"
                maxlength="120"
              />
            </div>
            <span class="char-count">{{ form.title?.length ?? 0 }} / 120</span>
          </div>

          <div class="field-group">
            <label class="field-label">Project URL <span class="req">*</span></label>
            <div class="input-wrap">
              <LinkIcon :size="15" class="input-icon" />
              <input
                v-model="form.link"
                type="url"
                class="f-input"
                placeholder="https://dcc.gov.kh"
                @blur="validateUrl"
              />
            </div>
            <p class="field-error" v-if="urlError">{{ urlError }}</p>
            <a
              class="url-preview"
              v-if="validUrl && !urlError"
              :href="form.link"
              target="_blank"
            >
              <Globe :size="11" />
              {{ shortLink(form.link) }}
              <ExternalLink :size="10" />
            </a>
          </div>

          <div class="form-footer">
            <button v-if="editingId" class="btn-ghost-v text-black" @click="cancelEdit">
              <X :size="14" /> Cancel
            </button>
            <button v-else class="btn-ghost-v" @click="resetForm">
              <RefreshCcw :size="14" /> Reset
            </button>
            <button
              class="btn-save text-black"
              :disabled="saving || !form.title.trim() || !validUrl"
              @click="save"
            >
              <Loader2 v-if="saving" :size="14" class="spin" />
              <component :is="editingId ? Save : Plus" v-else :size="14" />
              {{ saving ? 'Saving…' : editingId ? 'Update' : 'Add Project' }}
            </button>
          </div>
        </div>
      </div>

      <div class="info-box">
        <Info :size="13" class="info-icon" />
        <p>
          Each project stores a <strong>title</strong> and a <strong>link</strong>.
          The API returns the full profile after each save — the project list is refreshed automatically.
        </p>
      </div>
    </div>

    <div class="col-lg-7">
      <div class="form-card">
        <div class="form-card-header">
          <div class="header-icon-wrap" style="background:#fef3c7;color:#92400e;"><ListChecks :size="16" /></div>
          <div>
            <h6 class="card-heading">Your Projects</h6>
            <p class="card-sub">{{ projects.length }} project{{ projects.length !== 1 ? 's' : '' }}</p>
          </div>
        </div>

        <!-- Skeleton -->
        <div class="list-skeleton" v-if="loading">
          <div class="sk-proj-row" v-for="n in 3" :key="n">
            <div class="sk sk-proj-icon"></div>
            <div class="flex-grow-1">
              <div class="sk sk-line mb-1" style="width:50%;height:12px;"></div>
              <div class="sk sk-line" style="width:35%;height:10px;"></div>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div class="empty-state" v-else-if="!projects.length">
          <div class="empty-icon"><FolderOpen :size="26" /></div>
          <p class="empty-t">No projects yet</p>
          <p class="empty-s">Add your first project on the left</p>
        </div>

        <div class="proj-list" v-else>
          <div
            class="proj-row"
            v-for="(proj, i) in projects"
            :key="proj.id"
            :style="`--d:${i * 50}ms`"
            :class="{ 'is-editing': editingId === proj.id }"
          >
            <!-- Icon -->
            <div class="proj-icon-box">
              <FolderOpen :size="16" />
            </div>

            <!-- Info -->
            <div class="flex-grow-1 min-w-0">
              <p class="proj-title">{{ proj.title }}</p>
              <a :href="proj.link" target="_blank" class="proj-url">
                <Globe :size="10" class="me-1" />
                {{ shortLink(proj.link) }}
                <ExternalLink :size="10" class="ms-1" />
              </a>
            </div>

            <!-- Editing badge -->
            <span class="editing-badge" v-if="editingId === proj.id">Editing</span>

            <!-- Actions -->
            <div class="proj-actions">
              <button class="icon-btn" title="Edit" @click="startEdit(proj)">
                <Pencil :size="14" />
              </button>
              <button class="icon-btn icon-btn-danger" title="Delete" @click="confirmDelete(proj)">
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
          <h6 class="modal-title">Delete Project?</h6>
          <p class="modal-msg">
            Remove <strong>{{ deleteTarget?.title }}</strong>?
            This cannot be undone.
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
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import {
  ArrowLeft, FolderOpen, Plus, Pencil, Save, Trash2, X,
  Link as LinkIcon, Globe, ExternalLink, ListChecks,
  RefreshCcw, Loader2, CheckCircle2, XCircle,
  AlertTriangle, Info
} from "lucide-vue-next"
import { useAuthStores }   from "@/stores/auth"
import { useProfileStore } from "@/stores/profile"

const auth         = useAuthStores()
const profileStore = useProfileStore()

const projects     = ref([])
const loading      = ref(true)
const saving       = ref(false)
const deleting     = ref(false)
const editingId    = ref(null)
const deleteTarget = ref(null)
const urlError     = ref("")
const toast        = ref({ show: false, msg: "", type: "success" })

const emptyForm = () => ({ title: "", link: "" })
const form      = ref(emptyForm())

const validUrl = computed(() => {
  try { return form.value.link.trim() !== "" && !!new URL(form.value.link) }
  catch { return false }
})

onMounted(async () => {
  loading.value = true
  try {
    const res = await auth.profile()
    // res.data.data.projects → [ { id, title, link }, ... ]
    if (res.data.result) projects.value = res.data.data.projects ?? []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})

// ──────────────────────────────────────────────────────────
// URL validation on blur
// ──────────────────────────────────────────────────────────
function validateUrl() {
  if (!form.value.link.trim()) { urlError.value = ""; return }
  try {
    new URL(form.value.link)
    urlError.value = ""
  } catch {
    urlError.value = "Please enter a valid URL (include https://)"
  }
}

// ──────────────────────────────────────────────────────────
// Save (create or update)
//
// POST /api/profile/projects
//   payload: { title: string, link: string }
//
// PUT  /api/profile/projects/:id
//   payload: { title: string, link: string }
//
// Response shape (same for both):
// {
//   result: true,
//   code: 1,
//   message: "Add project successful." | "Update project successful.",
//   data: {
//     id, full_name, ...,
//     projects: [ { id, title, link }, ... ]   ← updated list
//   }
// }
// ──────────────────────────────────────────────────────────
async function save() {
  if (!validUrl.value) { validateUrl(); return }
  saving.value = true
  try {
    // Payload exactly as API expects: { title, link }
    const payload = {
      title: form.value.title.trim(),
      link:  form.value.link.trim(),
    }

    let res
    if (editingId.value) {
      res = await profileStore.updateProject(editingId.value, payload)
    } else {
      res = await profileStore.addProject(payload)
    }

    if (res.data.result) {
      // Refresh from returned data.projects[]
      projects.value = res.data.data.projects ?? []
      showToast(editingId.value ? "Project updated!" : "Project added!", "success")
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
// Edit — populate form with { title, link } from existing project
// ──────────────────────────────────────────────────────────
function startEdit(proj) {
  editingId.value = proj.id
  form.value = {
    title: proj.title ?? "",
    link:  proj.link  ?? "",
  }
  urlError.value = ""
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function cancelEdit() { editingId.value = null; resetForm() }
function resetForm()  { form.value = emptyForm(); urlError.value = "" }

// ──────────────────────────────────────────────────────────
// Delete
//
// DELETE /api/profile/projects/:id
// Response:
// {
//   result: true,
//   code: 1,
//   message: "Delete project successful.",
//   data: {
//     ...,
//     projects: [ ... ]   ← updated list without deleted item
//   }
// }
// ──────────────────────────────────────────────────────────
function confirmDelete(proj) { deleteTarget.value = proj }

async function doDelete() {
  deleting.value = true
  try {
    const res = await profileStore.deleteProject(deleteTarget.value.id)
    if (res.data.result) {
      // Use returned projects[] or filter locally as fallback
      projects.value = res.data.data?.projects
        ?? projects.value.filter(p => p.id !== deleteTarget.value.id)
      showToast("Project deleted.", "success")
      deleteTarget.value = null
      if (editingId.value === deleteTarget.value?.id) cancelEdit()
    } else {
      showToast(res.data.message || "Failed.", "error")
    }
  } catch (e) {
    showToast("Something went wrong.", "error")
  } finally {
    deleting.value = false
  }
}

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────
function shortLink(url) {
  try { return new URL(url).hostname.replace("www.", "") }
  catch { return url }
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
.back-btn { width:36px; height:36px; border-radius:9px; border:1.5px solid var(--border); background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text); transition:background .15s, border-color .15s; }
.back-btn:hover { background:var(--v-l); border-color:var(--v-m); color:var(--v-m); }
.page-icon-wrap { width:38px; height:38px; border-radius:9px; background:#fef3c7; color:#92400e; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.page-title { font-size:1.1rem; font-weight:800; color:var(--text); margin:0; letter-spacing:-.025em; }
.page-sub   { font-size:.76rem; color:var(--muted); margin:0; }

/* ── Card ── */
.form-card { background:#fff; border:1px solid var(--border); border-radius:var(--r); box-shadow:var(--shadow); overflow:hidden; margin-bottom:12px; }
.form-card-header { display:flex; align-items:center; gap:12px; padding:18px 22px; border-bottom:1px solid var(--border); background:linear-gradient(135deg,#faf9ff,#f5f3ff); }
.header-icon-wrap { width:36px; height:36px; border-radius:9px; background:var(--v-l); color:var(--v-m); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.card-heading { font-size:.88rem; font-weight:800; color:var(--text); margin:0; }
.card-sub     { font-size:.72rem; color:var(--muted); margin:0; }
.form-body    { padding:22px; }

/* ── Fields ── */
.field-group  { margin-bottom:16px; }
.field-label  { display:block; font-size:.7rem; font-weight:800; text-transform:uppercase; letter-spacing:.07em; color:#a78bfa; margin-bottom:6px; }
.req { color:#ef4444; }
.field-error  { font-size:.74rem; color:#dc2626; margin-top:5px; display:flex; align-items:center; gap:4px; }

.input-wrap { position:relative; }
.input-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#a78bfa; pointer-events:none; }
.f-input {
  width:100%; padding:9px 12px 9px 36px; border:1.5px solid var(--border); border-radius:9px;
  font-size:.86rem; color:var(--text); background:#faf9ff; outline:none; font-family:inherit;
  transition:border-color .15s, box-shadow .15s;
}
.f-input:focus { border-color:var(--v-m); box-shadow:0 0 0 3px rgba(124,58,237,.1); background:#fff; }
.char-count { font-size:.68rem; color:#a78bfa; float:right; margin-top:4px; }

/* URL preview */
.url-preview {
  display:inline-flex; align-items:center; gap:4px;
  font-size:.72rem; color:var(--v-m); font-weight:600;
  background:var(--v-l); padding:3px 10px; border-radius:20px;
  margin-top:6px; border:1px solid #ddd6fe; text-decoration:none;
  transition:background .15s;
}
.url-preview:hover { background:#ddd6fe; }

/* Info box */
.info-box {
  display:flex; align-items:flex-start; gap:8px;
  background:#f5f3ff; border:1px solid var(--border); border-radius:10px;
  padding:12px 14px; font-size:.76rem; color:var(--muted); line-height:1.55;
}
.info-icon { color:#a78bfa; flex-shrink:0; margin-top:1px; }

/* Footer */
.form-footer { display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid var(--border); }
.btn-save { display:inline-flex; align-items:center; gap:6px; background:var(--v-m); color:#fff; border:none; border-radius:9px; padding:9px 20px; font-size:.84rem; font-weight:600; cursor:pointer; font-family:inherit; box-shadow:0 3px 12px rgba(109,40,217,.28); transition:background .15s, transform .1s; }
.btn-save:hover:not(:disabled) { background:var(--v-d); transform:translateY(-1px); }
.btn-save:disabled { opacity:.5; cursor:not-allowed; }
.btn-ghost-v { display:inline-flex; align-items:center; gap:6px; background:var(--v-l); color:var(--v-m); border:1px solid #ddd6fe; border-radius:9px; padding:8px 18px; font-size:.84rem; font-weight:600; cursor:pointer; font-family:inherit; transition:background .15s; }
.btn-ghost-v:hover { background:#ddd6fe; }

/* Skeleton */
.list-skeleton { padding:18px 22px; display:flex; flex-direction:column; gap:16px; }
.sk-proj-row { display:flex; align-items:center; gap:12px; }
.sk { background:linear-gradient(90deg,#f3f0ff 25%,#e9e3ff 50%,#f3f0ff 75%); background-size:300% 100%; animation:shimmer 1.5s infinite; border-radius:6px; display:block; }
.sk-proj-icon { width:38px; height:38px; border-radius:9px; flex-shrink:0; }
@keyframes shimmer { from { background-position:100% 0; } to { background-position:-100% 0; } }

/* Empty */
.empty-state { padding:40px 20px; text-align:center; display:flex; flex-direction:column; align-items:center; }
.empty-icon { width:52px; height:52px; border-radius:13px; background:#fef3c7; color:#92400e; display:flex; align-items:center; justify-content:center; margin-bottom:12px; }
.empty-t { font-size:.9rem; font-weight:700; color:var(--text); margin:0 0 4px; }
.empty-s { font-size:.78rem; color:var(--muted); margin:0; }

/* Project list */
.proj-list { padding:10px 8px; }
.proj-row {
  display:flex; align-items:center; gap:12px;
  padding:12px 14px; border-radius:10px;
  transition:background .15s;
  animation:rowIn .3s var(--d,0ms) both;
}
.proj-row:hover { background:#faf9ff; }
.proj-row.is-editing { background:var(--v-l); border:1px solid #ddd6fe; }
@keyframes rowIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:none; } }

.proj-icon-box { width:38px; height:38px; border-radius:10px; background:var(--v-l); color:var(--v-m); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.proj-title { font-size:.88rem; font-weight:700; color:var(--text); margin:0 0 3px; }
.proj-url { font-size:.74rem; color:var(--v-m); text-decoration:none; display:inline-flex; align-items:center; }
.proj-url:hover { text-decoration:underline; }
.min-w-0 { min-width:0; }
.flex-grow-1 { flex-grow:1; }

.editing-badge { font-size:.66rem; font-weight:700; background:#fef9c3; color:#92400e; padding:2px 8px; border-radius:20px; border:1px solid #fde68a; white-space:nowrap; }

.proj-actions { display:flex; gap:4px; flex-shrink:0; }
.icon-btn { width:30px; height:30px; border-radius:7px; border:1px solid var(--border); background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--muted); transition:all .15s; }
.icon-btn:hover { background:var(--v-l); color:var(--v-m); border-color:#ddd6fe; }
.icon-btn-danger:hover { background:#fff1f2; color:#dc2626; border-color:#fecaca; }

/* Modal */
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

/* Toast */
.toast-snack { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); display:inline-flex; align-items:center; gap:8px; padding:11px 22px; border-radius:10px; font-size:.84rem; font-weight:600; box-shadow:0 6px 24px rgba(0,0,0,.15); z-index:9999; white-space:nowrap; }
.toast-snack.success { background:#6d28d9; color:#fff; }
.toast-snack.error   { background:#dc2626; color:#fff; }
.toast-enter-active, .toast-leave-active { transition:opacity .25s, transform .25s; }
.toast-enter-from, .toast-leave-to       { opacity:0; transform:translateX(-50%) translateY(10px); }
.spin { animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
</style>  