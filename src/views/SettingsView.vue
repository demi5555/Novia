<template>
    <DashboardLayout>
    <div class="container">
        <div class="settings-page-wrapper">
            <div class="settings-page">
                <!-- Page Header -->
                <header class="page-header mb-5">
                    <div class="d-flex align-items-center gap-3">
                        <div class="header-icon">
                            <i class="bi bi-gear-wide-connected"></i>
                        </div>
                        <div>
                            <h1 class="page-title">ការកំណត់</h1>
                            <p class="page-subtitle">គ្រប់គ្រងសុវត្ថិភាព និងចំណូលចិត្តគណនីរបស់អ្នក</p>
                        </div>
                    </div>
                </header>

                <!-- Change Password Section -->
                <section class="settings-section mb-5">
                    <div class="glass-card">
                        <div class="section-header">
                            <div class="d-flex align-items-center gap-3">
                                <div class="icon-box primary">
                                    <i class="bi bi-shield-lock-fill"></i>
                                </div>
                                <div>
                                    <h2 class="section-title">សុវត្ថិភាព</h2>
                                    <p class="section-desc">ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់ ដើម្បីការពារគណនីរបស់អ្នក</p>
                                </div>
                            </div>
                        </div>

                        <form @submit.prevent="handlePasswordChange" class="settings-form">
                            <!-- Current Password -->
                            <div class="form-group">
                                <label class="form-label">ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
                                <div class="input-group">
                                    <span class="input-icon"><i class="bi bi-key-fill"></i></span>
                                    <input :type="showCurrent ? 'text' : 'password'" v-model="passwordForm.current"
                                        class="form-control" :class="{ 'is-invalid': errors.current }"
                                        placeholder="បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន" />
                                    <button type="button" class="toggle-btn" @click="showCurrent = !showCurrent">
                                        <i :class="showCurrent ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                    </button>
                                </div>
                                <span v-if="errors.current" class="error-text">{{ errors.current }}</span>
                            </div>

                            <hr class="divider" />

                            <!-- New Password -->
                            <div class="form-group">
                                <label class="form-label">ពាក្យសម្ងាត់ថ្មី</label>
                                <div class="input-group">
                                    <span class="input-icon"><i class="bi bi-lock-fill"></i></span>
                                    <input :type="showNew ? 'text' : 'password'" v-model="passwordForm.new"
                                        class="form-control" :class="{ 'is-invalid': errors.new }"
                                        placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មី" />
                                    <button type="button" class="toggle-btn" @click="showNew = !showNew">
                                        <i :class="showNew ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                    </button>
                                </div>
                                <span v-if="errors.new" class="error-text">{{ errors.new }}</span>
                                <small class="form-hint">
                                    <i class="bi bi-info-circle"></i>
                                    ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ
                                </small>
                            </div>

                            <!-- Confirm Password -->
                            <div class="form-group">
                                <label class="form-label">បញ្ជាក់ពាក្យសម្ងាត់ថ្មី</label>
                                <div class="input-group">
                                    <span class="input-icon"><i class="bi bi-check-circle-fill"></i></span>
                                    <input :type="showConfirm ? 'text' : 'password'" v-model="passwordForm.confirm"
                                        class="form-control" :class="{ 'is-invalid': errors.confirm }"
                                        placeholder="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី" />
                                    <button type="button" class="toggle-btn" @click="showConfirm = !showConfirm">
                                        <i :class="showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                    </button>
                                </div>
                                <span v-if="errors.confirm" class="error-text">{{ errors.confirm }}</span>
                            </div>

                            <!-- Success Message -->
                            <Transition name="slide-fade">
                                <div v-if="successMessage" class="alert-success">
                                    <i class="bi bi-check-circle-fill"></i>
                                    {{ successMessage }}
                                </div>
                            </Transition>

                            <!-- Submit -->
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary btn-glow" :disabled="isLoading">
                                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                    <i v-else class="bi bi-arrow-repeat me-2"></i>
                                    {{ isLoading ? 'កំពុងធ្វើបច្ចុប្បន្នភាព...' : 'ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                <!-- Danger Zone Section -->
                <section class="settings-section danger-zone">
                    <div class="glass-card border-danger">
                        <div class="section-header">
                            <div class="d-flex align-items-center gap-3">
                                <div class="icon-box danger">
                                    <i class="bi bi-exclamation-triangle-fill"></i>
                                </div>
                                <div>
                                    <h2 class="section-title text-danger">តំបន់គ្រោះថ្នាក់</h2>
                                    <p class="section-desc">សកម្មភាពដែលមិនអាចត្រឡប់វិញបាន</p>
                                </div>
                            </div>
                        </div>

                        <div class="danger-content">
                            <div class="danger-notice">
                                <h3>លុបគណនី</h3>
                                <p>
                                    នៅពេលអ្នកលុបគណនី វាមិនអាចត្រឡប់វិញបានទេ។ សកម្មភាពនេះនឹងលុបទិន្នន័យទាំងអស់
                                    របស់អ្នកជាអចិន្ត្រៃយ៍ រួមមានប្រូហ្វាល អត្ថបទ និងប្រវត្តិសកម្មភាព។
                                </p>
                            </div>

                            <button class="btn btn-outline-danger btn-glow-danger" @click="showDeleteModal = true">
                                <i class="bi bi-trash-fill me-2"></i>
                                លុបគណនី
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Delete Account Modal -->
                <Teleport to="body">
                    <Transition name="modal">
                        <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeModal">
                            <div class="modal-content glass-modal">
                                <div class="modal-header border-danger">
                                    <h3 class="modal-title text-danger">
                                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                        បញ្ជាក់ការលុបគណនី
                                    </h3>
                                    <button class="btn-close" @click="closeModal">
                                        <i class="bi bi-x-lg"></i>
                                    </button>
                                </div>

                                <div class="modal-body">
                                    <p class="warning-text">
                                        សកម្មភាពនេះ <strong class="text-danger">មិនអាចត្រឡប់វិញបានទេ</strong>។
                                        វានឹងលុបគណនីរបស់អ្នកជាអចិន្ត្រៃយ៍ និងដកទិន្នន័យទាំងអស់ចេញពីម៉ាស៊ីនមេរបស់យើង។
                                    </p>

                                    <div class="confirmation-input">
                                        <label>
                                            សូមវាយ <code class="text-danger fw-bold">DELETE</code> ដើម្បីបញ្ជាក់៖
                                        </label>
                                        <input v-model="deleteConfirmText" type="text" class="form-control"
                                            placeholder="DELETE" :disabled="isDeleting" />
                                    </div>

                                    <Transition name="slide-fade">
                                        <div v-if="deleteError" class="alert-error">
                                            <i class="bi bi-x-circle-fill me-2"></i>
                                            {{ deleteError }}
                                        </div>
                                    </Transition>
                                </div>

                                <div class="modal-footer">
                                    <button class="btn btn-secondary" @click="closeModal" :disabled="isDeleting">
                                        បោះបង់
                                    </button>
                                    <button class="btn btn-danger"
                                        :disabled="deleteConfirmText !== 'DELETE' || isDeleting"
                                        @click="handleDeleteAccount">
                                        <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2"></span>
                                        {{ isDeleting ? 'កំពុងលុប...' : 'លុបគណនី' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </Teleport>
            </div>
        </div>
    </div>
    </DashboardLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import api from '@/api/http'

const router = useRouter()

// --- Password Change State ---
const passwordForm = reactive({
    current: '',
    new: '',
    confirm: ''
})

const errors = reactive({
    current: '',
    new: '',
    confirm: ''
})

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
const isLoading = ref(false)
const successMessage = ref('')

// --- Delete Account State ---
const showDeleteModal = ref(false)
const deleteConfirmText = ref('')
const isDeleting = ref(false)
const deleteError = ref('')

// --- Methods ---

const validatePassword = () => {
    let valid = true
    errors.current = ''
    errors.new = ''
    errors.confirm = ''

    if (!passwordForm.current) {
        errors.current = 'ពាក្យសម្ងាត់បច្ចុប្បន្នត្រូវការ'
        valid = false
    }

    if (!passwordForm.new) {
        errors.new = 'ពាក្យសម្ងាត់ថ្មីត្រូវការ'
        valid = false
    } else if (passwordForm.new.length < 6) {
        errors.new = 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ'
        valid = false
    }

    if (!passwordForm.confirm) {
        errors.confirm = 'សូមបញ្ជាក់ពាក្យសម្ងាត់របស់អ្នក'
        valid = false
    } else if (passwordForm.new !== passwordForm.confirm) {
        errors.confirm = 'ពាក្យសម្ងាត់មិនដូចគ្នា'
        valid = false
    }

    return valid
}

const handlePasswordChange = async () => {
    if (!validatePassword()) return

    isLoading.value = true
    successMessage.value = ''
    errors.current = ''

    try {
        const params = new URLSearchParams({
            old_pass: passwordForm.current,
            new_pass: passwordForm.new,
            new_pass_confirmation: passwordForm.confirm
        })
        const response = await api.put('/api/profile/change-pass', params)

        const data = response?.data ?? {}

        if (!data.result) {
            throw new Error(data.message || 'បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់')
        }
        successMessage.value = 'ពាក្យសម្ងាត់បានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!'
        passwordForm.current = ''
        passwordForm.new = ''
        passwordForm.confirm = ''

    } catch (err) {
        errors.current = err?.response?.data?.message || err.message || 'បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់'
    } finally {
        isLoading.value = false
    }
}

const closeModal = () => {
    if (isDeleting.value) return
    showDeleteModal.value = false
    deleteConfirmText.value = ''
    deleteError.value = ''
}

const handleDeleteAccount = async () => {
    if (deleteConfirmText.value !== 'DELETE') return

    isDeleting.value = true
    deleteError.value = ''

    try {
        const response = await api.delete('/api/profile/delete-acc')

        const data = response?.data ?? {}

        if (!data.result) {
            throw new Error(data.message || 'បរាជ័យក្នុងការលុបគណនី')
        }

        localStorage.clear()
        router.push('/login')

    } catch (err) {
        deleteError.value = err?.response?.data?.message || err.message || 'បរាជ័យក្នុងការលុបគណនី'
    } finally {
        isDeleting.value = false
    }
}
</script>

<style scoped>
/* --- Layout --- */
.settings-page-wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 2.5rem 1.5rem;
    background: #f0f2f5;
}

.settings-page {
    width: 100%;
    max-width: 620px;
    animation: fadeIn 0.4s ease-out;
}

.page-header { display: flex; align-items: center; }

.header-icon {
    width: 52px;
    height: 52px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    color: #fff;
    box-shadow: 0 6px 18px rgba(99,102,241,0.28);
    flex-shrink: 0;
}

.page-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    letter-spacing: -0.02em;
}

.page-subtitle { color: #64748b; margin: 0; font-size: 0.9rem; }

/* --- Cards --- */
.glass-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    transition: box-shadow 0.2s;
}
.glass-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.09); }
.glass-card.border-danger { border-color: rgba(239,68,68,0.3); }
.glass-card.border-danger:hover { box-shadow: 0 4px 16px rgba(239,68,68,0.08); }

/* --- Section headers --- */
.section-header {
    margin-bottom: 1.75rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid #f1f5f9;
}

.icon-box {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
}
.icon-box.primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    box-shadow: 0 4px 12px rgba(99,102,241,0.25);
}
.icon-box.danger {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: #fff;
    box-shadow: 0 4px 12px rgba(239,68,68,0.25);
}

.section-title { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0; }
.section-desc  { color: #64748b; font-size: 0.86rem; margin: 0.2rem 0 0; }

/* --- Forms --- */
.settings-form { max-width: 100%; }
.form-group    { margin-bottom: 1.4rem; }

.form-label {
    display: block;
    color: #374151;
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
}

.input-group { position: relative; display: flex; align-items: center; }

.input-icon { position: absolute; left: 1rem; color: #94a3b8; z-index: 10; }

.form-control {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 2.75rem;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    color: #1e293b;
    font-size: 0.93rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    font-family: inherit;
}
.form-control:focus {
    outline: none;
    border-color: #6366f1;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
}
.form-control.is-invalid { border-color: #ef4444; background: #fff5f5; }

.toggle-btn {
    position: absolute;
    right: 0.75rem;
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 0.4rem;
    transition: color 0.2s;
}
.toggle-btn:hover { color: #6366f1; }

.error-text { display: block; color: #ef4444; font-size: 0.85rem; margin-top: 0.4rem; }

.form-hint { display: block; color: #94a3b8; font-size: 0.8rem; margin-top: 0.4rem; }
.form-hint i { margin-right: 0.2rem; }

.divider { border: none; height: 1px; background: #f1f5f9; margin: 1.5rem 0; }

/* --- Buttons --- */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.8rem 1.75rem;
    border-radius: 11px;
    font-weight: 600;
    font-size: 0.93rem;
    border: none;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
}
.btn:disabled { opacity: 0.55; cursor: not-allowed; }

.btn-primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    box-shadow: 0 4px 12px rgba(99,102,241,0.25);
}
.btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(99,102,241,0.35);
}

.btn-glow { position: relative; }
.btn-glow::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 13px;
    opacity: 0;
    z-index: -1;
    filter: blur(10px);
    transition: opacity 0.3s;
}
.btn-glow:hover::after { opacity: 0.35; }

.btn-outline-danger {
    background: transparent;
    border: 1.5px solid rgba(239,68,68,0.4);
    color: #dc2626;
}
.btn-outline-danger:hover:not(:disabled) {
    background: #fef2f2;
    border-color: #ef4444;
}

.btn-glow-danger:hover { box-shadow: 0 0 16px rgba(239,68,68,0.25); }

.btn-secondary { background: #f1f5f9; color: #374151; }
.btn-secondary:hover:not(:disabled) { background: #e2e8f0; }

.btn-danger {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: #fff;
}
.btn-danger:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(239,68,68,0.3);
}

.form-actions { margin-top: 1.75rem; display: flex; justify-content: flex-end; }

/* --- Danger Zone --- */
.danger-content { display: flex; flex-direction: column; gap: 1.5rem; }

.danger-notice {
    background: #fff5f5;
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 12px;
    padding: 1.25rem;
}
.danger-notice h3 { color: #dc2626; font-size: 1rem; margin: 0 0 0.5rem; }
.danger-notice p  { color: #64748b; margin: 0; font-size: 0.875rem; line-height: 1.6; }

/* --- Alerts --- */
.alert-success {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #16a34a;
    padding: 0.875rem 1rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    font-size: 0.9rem;
}

.alert-error {
    background: #fff5f5;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 0.875rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    margin-top: 1rem;
}

/* --- Modal --- */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;
}

.modal-content {
    background: #fff;
    border-radius: 18px;
    width: 100%;
    max-width: 460px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    animation: modalSlide 0.25s ease-out;
    overflow: hidden;
}

@keyframes modalSlide {
    from { opacity: 0; transform: scale(0.95) translateY(-16px); }
    to   { opacity: 1; transform: scale(1)   translateY(0); }
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
}
.modal-title { font-size: 1.05rem; font-weight: 700; margin: 0; color: #1e293b; }

.btn-close {
    background: #f1f5f9;
    border: none;
    border-radius: 8px;
    color: #64748b;
    font-size: 1rem;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}
.btn-close:hover { background: #e2e8f0; color: #1e293b; }

.modal-body { padding: 1.5rem; }

.warning-text { color: #374151; line-height: 1.6; margin-bottom: 1.5rem; font-size: 0.9rem; }

.confirmation-input label { display: block; color: #64748b; font-size: 0.875rem; margin-bottom: 0.6rem; }
.confirmation-input input {
    width: 100%;
    padding: 0.8rem 1rem;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    color: #1e293b;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-family: inherit;
    box-sizing: border-box;
}
.confirmation-input input:focus {
    outline: none;
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.12);
}

.modal-footer {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    padding: 1rem 1.5rem 1.5rem;
    border-top: 1px solid #f1f5f9;
}

/* --- Transitions --- */
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.25s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-8px); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
}
</style>