<template>
  <DashboardLayout>
    <div class="profile-page">

      <!-- ═══════════════════════════════════════════
           HERO BANNER
      ════════════════════════════════════════════ -->
      <div class="hero-banner">
        <!-- Cover background -->
        <div
          class="hero-bg"
          :style="profile.cover ? `background-image:url(${profile.cover})` : ''"
        />
        <div class="hero-overlay" />

        <!-- Change cover button -->
        <button class="cover-edit-btn" @click="coverInput.click()" :disabled="uploadingCover">
          <Loader2 v-if="uploadingCover" :size="14" class="spin" />
          <ImageIcon v-else :size="14" />
          {{ uploadingCover ? 'Uploading…' : 'Change Cover' }}
        </button>
        <input ref="coverInput" type="file" accept="image/*" hidden @change="onCoverFile" />

        <div class="container">
          <div class="hero-content">

            <!-- Avatar with edit overlay -->
            <div class="avatar-wrap" @click="avatarInput.click()">
              <img :src="profile.avatar || defaultAvatar" class="avatar-img" alt="avatar" />
              <div class="avatar-edit-overlay">
                <Camera :size="16" />
              </div>
            </div>
            <input ref="avatarInput" type="file" accept="image/*" hidden @change="onAvatarFile" />

            <div class="hero-info">
              <h2 class="hero-name">{{ profile.full_name }}</h2>
              <p class="hero-role">
                {{ profile.professional?.job_title || 'Add your job title' }}
              </p>
              <p class="hero-company" v-if="profile.professional?.company_name">
                {{ profile.professional.company_name }}
              </p>
            </div>

          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════
           TABS
      ════════════════════════════════════════════ -->
      <div class="profile-tabs">
        <div class="container">
          <div class="tabs">
            <span class="tab" :class="{ active: activeTab === 'overview' }"    @click="activeTab = 'overview'">Overview</span>
            <span class="tab" :class="{ active: activeTab === 'professional' }" @click="activeTab = 'professional'">Professional</span>
            <span class="tab" :class="{ active: activeTab === 'education' }"   @click="activeTab = 'education'">Education</span>
            <span class="tab" :class="{ active: activeTab === 'collaboration' }" @click="activeTab = 'collaboration'">Collaboration</span>
            <span class="tab" :class="{ active: activeTab === 'cv' }"          @click="activeTab = 'cv'">CV</span>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════
           MAIN CONTENT
      ════════════════════════════════════════════ -->
      <div class="container">
        <div class="row">

          <!-- ─── LEFT SIDEBAR ─────────────────────── -->
          <div class="col-3">

            <!-- Contact -->
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">Contact</h6>
                <div class="info-row" v-if="profile.email">
                  <Mail :size="13" class="info-icon" />
                  <span>{{ profile.email }}</span>
                </div>
                <div class="info-row" v-if="profile.phone">
                  <Phone :size="13" class="info-icon" />
                  <span>{{ profile.phone }}</span>
                </div>
                <div class="info-row" v-if="profile.current_city">
                  <MapPin :size="13" class="info-icon" />
                  <span>{{ profile.current_city }}</span>
                </div>
                <div class="info-row" v-if="profile.portfolio_link">
                  <Link2 :size="13" class="info-icon" />
                  <a :href="profile.portfolio_link" target="_blank" class="info-link">Portfolio</a>
                </div>
                <router-link to="/editProfile" class="edit-link">Edit Info</router-link>
              </div>
            </div>

            <!-- Skills -->
            <div class="card">
              <div class="card-body">
                <div class="card-title-row">
                  <h6 class="card-title">Skills</h6>
                  <button class="icon-action-btn" @click="showSkillModal = true" title="Manage skills">
                    <Settings :size="13" />
                  </button>
                </div>
                <div v-if="profile.skills?.length" class="skills-wrap">
                  <span class="skill-badge" v-for="s in profile.skills" :key="s.id">{{ s.name }}</span>
                </div>
                <p v-else class="empty-text">
                  No skills yet.
                  <button class="text-btn" @click="showSkillModal = true">Add skills</button>
                </p>
              </div>
            </div>

            <!-- Education summary -->
            <div class="card">
              <div class="card-body">
                <div class="card-title-row">
                  <h6 class="card-title">Education</h6>
                  <router-link to="/editEducation" class="icon-action-btn" title="Manage education">
                    <Settings :size="13" />
                  </router-link>
                </div>
                <template v-if="profile.educations?.length">
                  <div class="edu-summary" v-for="edu in profile.educations.slice(0,2)" :key="edu.id">
                    <p class="edu-school">{{ edu.school?.name || '—' }}</p>
                    <p class="edu-degree">{{ edu.degree?.name }} · {{ edu.subject?.name }}</p>
                  </div>
                </template>
                <p v-else class="empty-text">
                  No education yet.
                  <router-link to="/editEducation" class="text-btn">Add education</router-link>
                </p>
              </div>
            </div>

          </div>

          <!-- ─── RIGHT CONTENT ─────────────────────── -->
          <div class="col-8 my-3">

            <!-- ── OVERVIEW ─────────────────────────── -->
            <div v-if="activeTab === 'overview'" class="card">
              <div class="card-body">
                <div class="section-header">
                  <h6 class="card-title">My Posts ({{ postCount }})</h6>
                  <router-link to="/create-post" class="btn-sm-primary">
                    <Plus :size="13" /> Create Post
                  </router-link>
                </div>

                <div v-if="loadingPosts" class="text-center py-4">
                  <div class="spinner" />
                </div>
                <div v-else-if="paginatedPosts.length">
                  <PostCard v-for="post in paginatedPosts" :key="post.id" :post="post" class="mb-3" />
                </div>
                <div v-else class="empty-state-sm">No posts yet.</div>

                <div class="pager" v-if="totalPages > 1">
                  <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">‹</button>
                  <button v-for="p in totalPages" :key="p" class="page-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
                  <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">›</button>
                </div>
              </div>
            </div>

            <!-- ── PROFESSIONAL ──────────────────────── -->
            <div v-if="activeTab === 'professional'" class="card">
              <div class="card-body">
                <div class="section-header">
                  <h6 class="card-title">Professional Info</h6>
                  <router-link to="/editProfile" class="btn-sm-ghost">
                    <Pencil :size="13" /> Edit
                  </router-link>
                </div>
                <template v-if="profile.professional?.job_title">
                  <div class="prof-grid">
                    <div class="prof-item">
                      <span class="prof-label">Job Title</span>
                      <span class="prof-value">{{ profile.professional.job_title }}</span>
                    </div>
                    <div class="prof-item">
                      <span class="prof-label">Company</span>
                      <span class="prof-value">{{ profile.professional.company_name || '—' }}</span>
                    </div>
                    <div class="prof-item full">
                      <span class="prof-label">Responsibilities</span>
                      <span class="prof-value">{{ profile.professional.responsibility || '—' }}</span>
                    </div>
                  </div>
                </template>
                <div v-else class="empty-state-sm">
                  No professional info yet.
                  <router-link to="/editProfile" class="text-btn">Add info</router-link>
                </div>
              </div>
            </div>

            <!-- ── EDUCATION ──────────────────────────── -->
            <div v-if="activeTab === 'education'" class="card">
              <div class="card-body">
                <div class="section-header">
                  <h6 class="card-title">Education</h6>
                  <router-link to="/editEducation" class="btn-sm-primary">
                    <Plus :size="13" /> Manage
                  </router-link>
                </div>
                <template v-if="profile.educations?.length">
                  <div class="edu-timeline">
                    <div class="edu-entry" v-for="edu in profile.educations" :key="edu.id">
                      <div class="edu-dot-col">
                        <div class="edu-dot" />
                      </div>
                      <div class="edu-body">
                        <span class="edu-badge" v-if="edu.degree?.name">{{ edu.degree.name }}</span>
                        <p class="edu-subject-name">{{ edu.subject?.name || '—' }}</p>
                        <p class="edu-school-name">
                          <Building2 :size="11" /> {{ edu.school?.name || '—' }}
                        </p>
                        <p class="edu-dates-text">
                          <CalendarDays :size="11" />
                          {{ edu.start_date }} → {{ edu.end_date || 'Ongoing' }}
                        </p>
                        <p class="edu-desc-text" v-if="edu.description">{{ edu.description }}</p>
                      </div>
                    </div>
                  </div>
                </template>
                <div v-else class="empty-state-sm">
                  No education records yet.
                  <router-link to="/editEducation" class="text-btn">Add education</router-link>
                </div>
              </div>
            </div>

            <!-- ── COLLABORATION ──────────────────────── -->
            <div v-if="activeTab === 'collaboration'" class="card">
              <div class="card-body">
                <div class="section-header">
                  <h6 class="card-title">Collaboration</h6>
                  <button class="btn-sm-primary" @click="openCollabModal">
                    <template v-if="profile.collaboration">
                      <Pencil :size="13" /> Edit
                    </template>
                    <template v-else>
                      <Plus :size="13" /> Add
                    </template>
                  </button>
                </div>

                <!-- Has collaboration -->
                <div v-if="profile.collaboration" class="collab-card">
                  <div class="collab-logo-wrap">
                    <img
                      v-if="profile.collaboration.company_logo"
                      :src="profile.collaboration.company_logo"
                      class="collab-logo"
                      alt="Company logo"
                    />
                    <div v-else class="collab-logo-placeholder">
                      <Building2 :size="28" />
                    </div>
                  </div>
                  <div class="collab-info">
                    <p class="collab-link-label">Company / Portfolio Link</p>
                    <a
                      v-if="profile.collaboration.company_link"
                      :href="profile.collaboration.company_link"
                      target="_blank"
                      class="collab-link"
                    >
                      <ExternalLink :size="13" />
                      {{ profile.collaboration.company_link }}
                    </a>
                    <span v-else class="empty-text">No link provided</span>
                  </div>
                </div>

                <!-- Empty state -->
                <div v-else class="empty-state collab-empty">
                  <div class="empty-icon"><Handshake :size="28" /></div>
                  <h5 class="empty-title">No Collaboration Yet</h5>
                  <p class="empty-desc">Add your company logo and website to attract partners.</p>
                  <button class="btn-primary" @click="openCollabModal">
                    <Plus :size="14" /> Add Collaboration
                  </button>
                </div>
              </div>
            </div>

            <!-- ── CV ────────────────────────────────── -->
            <div v-if="activeTab === 'cv'" class="card">
              <div class="card-body">
                <div class="section-header">
                  <h6 class="card-title">CV / Resume</h6>
                  <button class="btn-sm-primary" @click="cvInput.click()" :disabled="uploadingCV">
                    <Loader2 v-if="uploadingCV" :size="13" class="spin" />
                    <Upload v-else :size="13" />
                    {{ uploadingCV ? 'Uploading…' : (profile.cv ? 'Replace CV' : 'Upload CV') }}
                  </button>
                  <input ref="cvInput" type="file" accept=".pdf,.doc,.docx" hidden @change="onCvFile" />
                </div>

                <div v-if="profile.cv" class="cv-preview">
                  <div class="cv-icon"><FileText :size="28" /></div>
                  <div>
                    <p class="cv-name">Curriculum Vitae</p>
                    <a :href="profile.cv" target="_blank" class="cv-link">
                      <ExternalLink :size="12" /> View / Download
                    </a>
                  </div>
                </div>
                <div v-else class="empty-state-sm">
                  No CV uploaded yet.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>

    <!-- ═══════════════════════════════════════════
         MODALS
    ════════════════════════════════════════════ -->

    <!-- Image Crop Modal -->
    <ImageCropModal
      v-if="cropSrc"
      :src="cropSrc"
      :shape="cropShape"
      @crop="onCropped"
      @cancel="cropSrc = null"
    />

    <!-- Collaboration Modal -->
    <CollaborationModal
      v-if="showCollabModal"
      :existing="profile.collaboration"
      @close="showCollabModal = false"
      @saved="onCollabSaved"
    />

    <!-- Skill Modal -->
    <SkillModal
      v-if="showSkillModal"
      :current-skills="profile.skills || []"
      @close="showSkillModal = false"
      @saved="onSkillsSaved"
    />

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast-snack" :class="toast.type">
        <CheckCircle2 v-if="toast.type === 'success'" :size="15" />
        <XCircle v-else :size="15" />
        {{ toast.msg }}
      </div>
    </Transition>

  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Plus, Pencil, Camera, ImageIcon, Settings, Mail, Phone,
  MapPin, Link2, Building2, CalendarDays, CheckCircle2, XCircle,
  Loader2, Upload, FileText, ExternalLink, Handshake
} from 'lucide-vue-next'
import { usePostStore } from '@/stores/post'
import { useAuthStores } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import PostCard from '@/components/PostCard.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ImageCropModal from '@/components/ImageCropModal.vue'
import CollaborationModal from '@/components/CollaborationModal.vue'
import SkillModal from '@/components/SkillModal.vue'

const postStore    = usePostStore()
const auth         = useAuthStores()
const profileStore = useProfileStore()

// ── State ──────────────────────────────────────────────────
const activeTab     = ref('overview')
const loadingPosts  = ref(false)
const uploadingCover  = ref(false)
const uploadingCV     = ref(false)
const showCollabModal = ref(false)
const showSkillModal  = ref(false)

// Crop modal
const cropSrc   = ref(null)
const cropShape = ref('circle')
let pendingCropType = null  // 'avatar' | 'cover'

// Toast
const toast = ref({ show: false, msg: '', type: 'success' })

// File input refs
const avatarInput = ref(null)
const coverInput  = ref(null)
const cvInput     = ref(null)

// ── Default avatar ─────────────────────────────────────────
const defaultAvatar = 'https://i.pravatar.cc/150'

// ── Profile data (from auth.user) ──────────────────────────
const profile = computed(() => {
  const u = auth.user || {}
  return {
    id:           u.id,
    full_name:    u.full_name   || 'User',
    avatar:       u.avatar      || null,
    cover:        u.cover       || '',
    email:        u.email       || '',
    phone:        u.phone       || '',
    current_city: u.current_city || '',
    home_town:    u.home_town   || '',
    portfolio_link: u.portfolio_link || '',
    professional: u.professional || null,
    educations:   u.educations  || [],
    skills:       u.skills      || [],
    collaboration: u.collaboration || null,
    cv:           u.cv          || null,
  }
})

// ── Posts ──────────────────────────────────────────────────
onMounted(async () => {
  loadingPosts.value = true
  try {
    await postStore.fetchPosts()
  } finally {
    loadingPosts.value = false
  }
})

const ownPosts = computed(() => {
  if (!auth.user?.id) return []
  return (postStore.posts || []).filter(p =>
    p.user_id === auth.user.id || p.creator?.id === auth.user.id
  )
})
const postCount   = computed(() => ownPosts.value.length)
const currentPage = ref(1)
const perPage     = 5
const totalPages  = computed(() => Math.max(1, Math.ceil(ownPosts.value.length / perPage)))
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return ownPosts.value.slice(start, start + perPage)
})

// ── Avatar upload ───────────────────────────────────────────
function onAvatarFile(e) {
  const file = e.target.files[0]
  e.target.value = ''
  if (!file) return
  pendingCropType = 'avatar'
  cropShape.value = 'circle'
  cropSrc.value = URL.createObjectURL(file)
}

// ── Cover upload ────────────────────────────────────────────
function onCoverFile(e) {
  const file = e.target.files[0]
  e.target.value = ''
  if (!file) return
  pendingCropType = 'cover'
  cropShape.value = 'rect'
  cropSrc.value = URL.createObjectURL(file)
}

// ── After crop ──────────────────────────────────────────────
async function onCropped(blob) {
  cropSrc.value = null
  const file = new File([blob], `${pendingCropType}.jpg`, { type: 'image/jpeg' })

  if (pendingCropType === 'avatar') {
    try {
      await profileStore.updateAvatar(file)
      await auth.fetchUser()
      showToast('Profile photo updated!', 'success')
    } catch {
      showToast('Failed to update photo.', 'error')
    }
  } else if (pendingCropType === 'cover') {
    uploadingCover.value = true
    try {
      await profileStore.updateCover(file)
      await auth.fetchUser()
      showToast('Cover photo updated!', 'success')
    } catch {
      showToast('Failed to update cover.', 'error')
    } finally {
      uploadingCover.value = false
    }
  }
  pendingCropType = null
}

// ── CV upload ────────────────────────────────────────────────
async function onCvFile(e) {
  const file = e.target.files[0]
  e.target.value = ''
  if (!file) return
  uploadingCV.value = true
  try {
    await profileStore.updateCV(file)
    await auth.fetchUser()
    showToast('CV uploaded!', 'success')
  } catch {
    showToast('Failed to upload CV.', 'error')
  } finally {
    uploadingCV.value = false
  }
}

// ── Collaboration ────────────────────────────────────────────
function openCollabModal() {
  showCollabModal.value = true
}

function onCollabSaved() {
  showToast('Collaboration updated!', 'success')
}

// ── Skills ───────────────────────────────────────────────────
function onSkillsSaved() {
  showToast('Skills updated!', 'success')
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  toast.value = { show: true, msg, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}
</script>

<style scoped>
.profile-page {
  background: #f3f4f6;
  min-height: 100vh;
}

/* ── HERO ─────────────────────────────── */
.hero-banner {
  height: 260px;
  position: relative;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%);
}

/* Change cover button */
.cover-edit-btn {
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(8px);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  padding: 7px 14px;
  font-size: .78rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background .15s;
}
.cover-edit-btn:hover:not(:disabled) { background: rgba(255,255,255,0.28); }
.cover-edit-btn:disabled { opacity: .6; cursor: not-allowed; }

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-content {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 16px;
  padding-top: 160px;
}

/* ── AVATAR ──────────────────────────── */
.avatar-wrap {
  position: relative;
  width: 100px;
  height: 100px;
  cursor: pointer;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #fff;
  object-fit: cover;
  display: block;
}

.avatar-edit-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transition: opacity .2s;
}
.avatar-wrap:hover .avatar-edit-overlay { opacity: 1; }

/* ── HERO INFO ───────────────────────── */
.hero-info { padding-bottom: 6px; }

.hero-name {
  color: #fff;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 2px;
}

.hero-role {
  color: #e5e7eb;
  font-size: .88rem;
  margin: 0;
}

.hero-company {
  color: #d1d5db;
  font-size: .8rem;
  margin: 2px 0 0;
}

/* ── TABS ────────────────────────────── */
.profile-tabs {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.tabs {
  display: flex;
  gap: 24px;
  padding: 14px 0;
}

.tab {
  cursor: pointer;
  color: #6b7280;
  font-size: .9rem;
  font-weight: 500;
  padding-bottom: 2px;
  transition: color .15s;
  white-space: nowrap;
}
.tab:hover  { color: #374151; }
.tab.active { color: #111; border-bottom: 2px solid #111; font-weight: 600; }

/* ── LAYOUT ──────────────────────────── */
.row {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.col-3 { width: 28%; }
.col-8 { width: 72%; }
.my-3  { margin-bottom: 20px; }

/* ── CARD ────────────────────────────── */
.card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.card-body { padding: 16px; }

.card-title {
  font-weight: 700;
  font-size: .9rem;
  color: #111;
  margin: 0;
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

/* ── CONTACT INFO ────────────────────── */
.info-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: .82rem;
  color: #374151;
  margin-bottom: 6px;
}

.info-icon { color: #9ca3af; flex-shrink: 0; }
.info-link { color: #2563eb; text-decoration: none; font-size: .82rem; }
.info-link:hover { text-decoration: underline; }

.edit-link {
  display: inline-block;
  margin-top: 10px;
  font-size: .78rem;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
}
.edit-link:hover { color: #111; }

/* ── SKILLS ──────────────────────────── */
.skills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-badge {
  background: #f3f4f6;
  color: #374151;
  font-size: .74rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
}

/* ── EDUCATION SIDEBAR ───────────────── */
.edu-summary { margin-bottom: 8px; }
.edu-school  { font-size: .82rem; font-weight: 600; color: #111; margin: 0; }
.edu-degree  { font-size: .74rem; color: #6b7280; margin: 0; }

/* ── PROFESSIONAL ────────────────────── */
.prof-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.prof-item.full { grid-column: 1 / -1; }
.prof-label {
  display: block;
  font-size: .69rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: #9ca3af;
  margin-bottom: 3px;
}
.prof-value {
  font-size: .86rem;
  color: #111;
  font-weight: 500;
  line-height: 1.5;
}

/* ── EDUCATION TIMELINE ──────────────── */
.edu-timeline { display: flex; flex-direction: column; gap: 0; }

.edu-entry {
  display: flex;
  gap: 0;
}

.edu-dot-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
  flex-shrink: 0;
  padding-top: 3px;
}

.edu-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #111;
  border: 2.5px solid #e5e7eb;
  flex-shrink: 0;
}

.edu-body {
  padding: 0 0 20px 12px;
  flex: 1;
}

.edu-badge {
  display: inline-block;
  background: #f3f4f6;
  color: #374151;
  font-size: .68rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  margin-bottom: 4px;
}

.edu-subject-name {
  font-size: .9rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 2px;
}

.edu-school-name {
  font-size: .78rem;
  color: #6b7280;
  margin: 0 0 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.edu-dates-text {
  font-size: .74rem;
  color: #9ca3af;
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.edu-desc-text {
  font-size: .78rem;
  color: #6b7280;
  margin: 0;
  font-style: italic;
  line-height: 1.5;
}

/* ── COLLABORATION ───────────────────── */
.collab-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
}

.collab-logo-wrap {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  background: #fff;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collab-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 6px;
}

.collab-logo-placeholder { color: #9ca3af; }

.collab-info { flex: 1; }
.collab-link-label {
  font-size: .7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: #9ca3af;
  margin: 0 0 5px;
}

.collab-link {
  font-size: .84rem;
  color: #2563eb;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  word-break: break-all;
}
.collab-link:hover { text-decoration: underline; }

.collab-empty { padding: 40px 0; }

/* ── CV ──────────────────────────────── */
.cv-preview {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
}

.cv-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cv-name { font-size: .88rem; font-weight: 600; color: #111; margin: 0 0 4px; }
.cv-link {
  font-size: .8rem;
  color: #2563eb;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.cv-link:hover { text-decoration: underline; }

/* ── BUTTONS ─────────────────────────── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #111;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: .84rem;
  font-weight: 600;
  font-family: inherit;
  transition: background .15s;
}
.btn-primary:hover { background: #374151; }

.btn-sm-primary {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #111;
  color: #fff;
  padding: 6px 12px;
  border-radius: 7px;
  border: none;
  cursor: pointer;
  font-size: .78rem;
  font-weight: 600;
  font-family: inherit;
  text-decoration: none;
  transition: background .15s;
}
.btn-sm-primary:hover { background: #374151; }

.btn-sm-ghost {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #f3f4f6;
  color: #374151;
  padding: 6px 12px;
  border-radius: 7px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  font-size: .78rem;
  font-weight: 600;
  font-family: inherit;
  text-decoration: none;
  transition: background .15s;
}
.btn-sm-ghost:hover { background: #e5e7eb; }

.icon-action-btn {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  text-decoration: none;
  transition: all .15s;
}
.icon-action-btn:hover { background: #f3f4f6; color: #111; border-color: #d1d5db; }

/* ── EMPTY STATES ────────────────────── */
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-state-sm {
  font-size: .84rem;
  color: #9ca3af;
  padding: 20px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.empty-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: #f3f4f6;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.empty-title {
  font-size: 1rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 6px;
}

.empty-desc {
  font-size: .84rem;
  color: #9ca3af;
  margin: 0 0 20px;
}

.empty-text {
  font-size: .82rem;
  color: #9ca3af;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.text-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: .82rem;
  color: #2563eb;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  display: inline;
}
.text-btn:hover { text-decoration: underline; }

/* ── PAGINATION ──────────────────────── */
.pager {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
}

.page-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: .84rem;
  transition: all .15s;
}
.page-btn:hover:not(:disabled) { border-color: #111; }
.page-btn.active { background: #111; color: #fff; border-color: #111; }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }

/* ── SPINNER ─────────────────────────── */
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #ddd;
  border-top-color: #111;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

.spin { animation: spin .7s linear infinite; }

@keyframes spin { to { transform: rotate(360deg); } }

/* ── TOAST ───────────────────────────── */
.toast-snack {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  border-radius: 10px;
  font-size: .84rem;
  font-weight: 600;
  box-shadow: 0 6px 24px rgba(0,0,0,.15);
  z-index: 9999;
  white-space: nowrap;
}
.toast-snack.success { background: #111; color: #fff; }
.toast-snack.error   { background: #dc2626; color: #fff; }

.toast-enter-active, .toast-leave-active { transition: opacity .25s, transform .25s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }

/* ── UTILS ───────────────────────────── */
.text-center { text-align: center; }
.py-4 { padding: 16px 0; }
.mb-3 { margin-bottom: 12px; }
</style>
