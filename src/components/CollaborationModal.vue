<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-icon-wrap">
            <Handshake :size="18" />
          </div>
          <div>
            <h6 class="modal-title">{{ existing ? 'Update Collaboration' : 'Add Collaboration' }}</h6>
            <p class="modal-sub">Share your company logo and website</p>
          </div>
          <button class="close-btn" @click="$emit('close')"><X :size="16" /></button>
        </div>

        <div class="modal-body">
          <!-- Company Logo Upload -->
          <div class="field-group">
            <label class="field-label">Company Logo</label>
            <div
              class="logo-drop"
              :class="{ 'has-preview': previewUrl }"
              @click="logoInput.click()"
              @dragover.prevent
              @drop.prevent="onDrop"
            >
              <img v-if="previewUrl" :src="previewUrl" class="logo-preview" />
              <div v-else class="logo-placeholder">
                <ImagePlus :size="28" />
                <p>Click or drag to upload logo</p>
                <span>PNG, JPG up to 5MB</span>
              </div>
              <div class="logo-overlay" v-if="previewUrl">
                <Camera :size="18" /> Change
              </div>
            </div>
            <input ref="logoInput" type="file" accept="image/*" hidden @change="onFileChange" />
          </div>

          <!-- Company URL -->
          <div class="field-group">
            <label class="field-label">Company / Portfolio URL</label>
            <div class="input-wrap">
              <Link2 :size="14" class="input-icon" />
              <input
                v-model="companyLink"
                type="url"
                class="f-input"
                placeholder="https://yourcompany.com"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="$emit('close')">Cancel</button>
          <button class="btn-save" :disabled="saving || (!logoFile && !companyLink)" @click="submit">
            <Loader2 v-if="saving" :size="14" class="spin" />
            <Check v-else :size="14" />
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { X, Handshake, ImagePlus, Camera, Link2, Check, Loader2 } from 'lucide-vue-next'
import { useProfileStore } from '@/stores/profile'
import { useAuthStores } from '@/stores/auth'

const props = defineProps({
  existing: { type: Object, default: null }, // existing collaboration data
})
const emit = defineEmits(['close', 'saved'])

const profileStore = useProfileStore()
const auth = useAuthStores()

const logoInput = ref(null)
const logoFile = ref(null)
const previewUrl = ref(null)
const companyLink = ref('')
const saving = ref(false)

onMounted(() => {
  if (props.existing) {
    companyLink.value = props.existing.company_link || ''
    previewUrl.value = props.existing.company_logo || null
  }
})

function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  logoFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

function onDrop(e) {
  const file = e.dataTransfer.files[0]
  if (!file || !file.type.startsWith('image/')) return
  logoFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

async function submit() {
  saving.value = true
  try {
    const form = new FormData()
    if (logoFile.value) form.append('company_logo', logoFile.value)
    if (companyLink.value) form.append('company_link', companyLink.value)

    await profileStore.updateCollaboration(form)
    await auth.fetchUser()
    emit('saved')
    emit('close')
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
  backdrop-filter: blur(4px);
}

.modal-box {
  background: #fff;
  border-radius: 18px;
  width: 440px;
  max-width: 95vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: popIn .22s cubic-bezier(.22,1,.36,1);
}

@keyframes popIn {
  from { transform: scale(.93); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-title {
  font-size: .92rem;
  font-weight: 700;
  color: #111;
  margin: 0;
}

.modal-sub {
  font-size: .74rem;
  color: #9ca3af;
  margin: 0;
}

.close-btn {
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  margin-left: auto;
  flex-shrink: 0;
  transition: background .15s;
}
.close-btn:hover { background: #fee2e2; color: #dc2626; }

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label {
  font-size: .7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: #6b7280;
}

/* Logo drop zone */
.logo-drop {
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color .2s, background .2s;
  background: #fafafa;
}
.logo-drop:hover { border-color: #3b82f6; background: #eff6ff; }
.logo-drop.has-preview { background: #f9f9f9; }

.logo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #9ca3af;
  text-align: center;
  pointer-events: none;
}
.logo-placeholder p { font-size: .82rem; font-weight: 500; margin: 0; color: #6b7280; }
.logo-placeholder span { font-size: .7rem; color: #9ca3af; }

.logo-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}

.logo-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: none;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #fff;
  font-size: .84rem;
  font-weight: 600;
}
.logo-drop.has-preview:hover .logo-overlay { display: flex; }

/* Input */
.input-wrap { position: relative; }
.input-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.f-input {
  width: 100%;
  padding: 9px 12px 9px 34px;
  border: 1.5px solid #e5e7eb;
  border-radius: 9px;
  font-size: .86rem;
  color: #111;
  background: #fafafa;
  outline: none;
  font-family: inherit;
  transition: border-color .15s, box-shadow .15s;
  box-sizing: border-box;
}
.f-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.12); background: #fff; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid #f0f0f0;
}

.btn-cancel {
  background: #f5f5f5;
  border: none;
  border-radius: 9px;
  padding: 8px 18px;
  font-size: .84rem;
  font-weight: 600;
  cursor: pointer;
  color: #555;
  font-family: inherit;
  transition: background .15s;
}
.btn-cancel:hover { background: #e5e7eb; }

.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 8px 20px;
  font-size: .84rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background .15s;
}
.btn-save:hover:not(:disabled) { background: #374151; }
.btn-save:disabled { opacity: .4; cursor: not-allowed; }

.spin { animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
