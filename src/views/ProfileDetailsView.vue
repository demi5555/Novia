<template>
  <DashboardLayout>
    <div class="pd-page">

      <!-- Loading skeleton -->
      <div v-if="loading" class="pd-loading">
        <div class="pd-cover-sk sk" />
        <div class="container">
          <div class="pd-hero-sk">
            <div class="sk sk-circle" />
            <div class="pd-sk-lines">
              <div class="sk sk-line" style="width:160px;height:20px;" />
              <div class="sk sk-line" style="width:110px;height:14px;margin-top:6px;" />
            </div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="pd-error">
        <UserX :size="40" />
        <h5>Profile not found</h5>
        <p>This user doesn't exist or you don't have permission to view their profile.</p>
        <button class="btn-back" @click="$router.back()"><ArrowLeft :size="14" /> Go Back</button>
      </div>

      <!-- Profile Content -->
      <template v-else-if="user">

        <!-- HERO -->
        <div class="pd-hero">
          <div
            class="pd-cover"
            :style="user.cover ? `background-image:url(${user.cover})` : ''"
          />
          <div class="pd-cover-overlay" />

          <!-- Message button — anchored bottom-right of the cover -->
          <button class="btn-msg-cover" @click="openMessage">
            <MessageCircle :size="16" /> Message
          </button>

          <div class="container">
            <div class="pd-hero-content">
              <img
                :src="user.avatar || defaultAvatar(user.full_name)"
                class="pd-avatar"
                :alt="user.full_name"
              />

              <div class="pd-hero-info">
                <h1 class="pd-name">{{ user.full_name }}</h1>
                <p class="pd-title" v-if="user.professional?.job_title">
                  {{ user.professional.job_title }}
                  <span v-if="user.professional.company_name"> · {{ user.professional.company_name }}</span>
                </p>
                <div class="pd-badges" v-if="user.types?.length || user.positions?.length">
                  <span class="pd-badge" v-for="t in user.types" :key="t.id">{{ t.name }}</span>
                  <span class="pd-badge outline" v-for="p in user.positions" :key="p.id">{{ p.name }}</span>
                </div>
              </div>

              <!-- Secondary actions (CV, Portfolio) -->
              <div class="pd-actions" v-if="user.cv || user.portfolio_link">
                <a v-if="user.cv" :href="user.cv" target="_blank" class="btn-ghost-action">
                  <FileText :size="14" /> CV
                </a>
                <a v-if="user.portfolio_link" :href="user.portfolio_link" target="_blank" class="btn-ghost-action">
                  <ExternalLink :size="14" /> Portfolio
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- MAIN CONTENT -->
        <div class="container pd-main">
          <div class="pd-row">

            <!-- ─── LEFT ─────────────────────── -->
            <div class="pd-col-main">

              <!-- Professional -->
              <div class="pd-card" v-if="user.professional?.job_title">
                <div class="pd-card-header">
                  <Briefcase :size="16" />
                  <h5>Professional Experience</h5>
                </div>
                <div class="pd-card-body">
                  <div class="pd-info-grid">
                    <div class="pd-info-item">
                      <span class="pd-info-label">Position</span>
                      <span class="pd-info-val">{{ user.professional.job_title }}</span>
                    </div>
                    <div class="pd-info-item">
                      <span class="pd-info-label">Company</span>
                      <span class="pd-info-val">{{ user.professional.company_name || '—' }}</span>
                    </div>
                    <div class="pd-info-item full" v-if="user.professional.responsibility">
                      <span class="pd-info-label">Responsibilities</span>
                      <span class="pd-info-val">{{ user.professional.responsibility }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CV / Resume -->
              <div class="pd-card" v-if="user.cv">
                <div class="pd-card-header">
                  <FileText :size="16" />
                  <h5>CV / Resume</h5>
                </div>
                <div class="pd-card-body">
                  <div class="pd-cv-row">
                    <div class="pd-cv-file-icon">
                      <FileText :size="28" />
                    </div>
                    <div class="pd-cv-meta">
                      <span class="pd-cv-label">Curriculum Vitae</span>
                      <span class="pd-cv-sub">Available for download</span>
                    </div>
                    <div class="pd-cv-btns">
                      <a :href="user.cv" target="_blank" class="pd-cv-btn-view">
                        <ExternalLink :size="13" /> View
                      </a>
                      <a :href="user.cv" download target="_blank" class="pd-cv-btn-dl">
                        <Download :size="13" /> Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Skills -->
              <div class="pd-card" v-if="user.skills?.length">
                <div class="pd-card-header">
                  <Zap :size="16" />
                  <h5>Skills</h5>
                  <span class="pd-post-count">{{ user.skills.length }}</span>
                </div>
                <div class="pd-card-body">
                  <div class="pd-skills">
                    <span class="pd-skill-tag" v-for="s in user.skills" :key="s.id">{{ s.name }}</span>
                  </div>
                </div>
              </div>

              <!-- Collaboration -->
              <div class="pd-card" v-if="user.collaboration?.company_logo || user.collaboration?.company_link">
                <div class="pd-card-header">
                  <Handshake :size="16" />
                  <h5>Collaboration</h5>
                </div>
                <div class="pd-card-body">
                  <div class="pd-collab-main">
                    <div class="pd-collab-logo-wrap" v-if="user.collaboration.company_logo">
                      <img :src="user.collaboration.company_logo" alt="Company Logo" />
                    </div>
                    <div class="pd-collab-info">
                      <p class="pd-collab-title">Open to Collaboration</p>
                      <p class="pd-collab-desc">This user is available for collaboration. Reach out or visit their company page.</p>
                      <a
                        v-if="user.collaboration.company_link"
                        :href="user.collaboration.company_link"
                        target="_blank"
                        class="pd-collab-visit-btn"
                      >
                        <ExternalLink :size="13" /> Visit Company
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Education -->
              <div class="pd-card" v-if="user.educations?.length">
                <div class="pd-card-header">
                  <GraduationCap :size="16" />
                  <h5>Education</h5>
                </div>
                <div class="pd-card-body">
                  <div class="pd-edu-timeline">
                    <div class="pd-edu-item" v-for="edu in user.educations" :key="edu.id">
                      <div class="pd-edu-dot-col">
                        <div class="pd-edu-dot" />
                      </div>
                      <div class="pd-edu-body">
                        <h6 class="pd-school-name">{{ edu.school?.name }}</h6>
                        <div class="pd-edu-badges">
                          <span class="pd-badge sm" v-if="edu.degree?.name">{{ edu.degree.name }}</span>
                          <span class="pd-badge sm outline" v-if="edu.subject?.name">{{ edu.subject.name }}</span>
                        </div>
                        <p class="pd-edu-date">
                          <CalendarDays :size="11" />
                          {{ edu.start_date }} – {{ edu.end_date || 'Present' }}
                        </p>
                        <p class="pd-edu-desc" v-if="edu.description">{{ edu.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Projects -->
              <div class="pd-card" v-if="user.projects?.length">
                <div class="pd-card-header">
                  <FolderOpen :size="16" />
                  <h5>Projects</h5>
                </div>
                <div class="pd-card-body">
                  <div class="pd-projects-grid">
                    <a
                      v-for="proj in user.projects"
                      :key="proj.id"
                      :href="proj.link"
                      target="_blank"
                      class="pd-project-card"
                    >
                      <div class="pd-proj-icon"><FolderOpen :size="18" /></div>
                      <div>
                        <p class="pd-proj-title">{{ proj.title }}</p>
                        <p class="pd-proj-link">{{ proj.link }}</p>
                      </div>
                      <ExternalLink :size="14" class="pd-proj-ext" />
                    </a>
                  </div>
                </div>
              </div>

              <!-- Posts -->
              <div class="pd-card">
                <div class="pd-card-header">
                  <Newspaper :size="16" />
                  <h5>Posts</h5>
                  <span class="pd-post-count" v-if="userPosts.length">{{ userPosts.length }}</span>
                </div>

                <div v-if="loadingPosts" class="pd-posts-loading">
                  <div class="pd-spin" />
                  <span>Loading posts…</span>
                </div>

                <div v-else-if="userPosts.length === 0" class="pd-posts-empty">
                  <Newspaper :size="28" />
                  <p>No posts yet</p>
                </div>

                <div v-else class="pd-posts-list">
                  <PostCard
                    v-for="post in userPosts"
                    :key="post.id"
                    :post="post"
                  />
                </div>
              </div>

            </div>

            <!-- ─── RIGHT SIDEBAR ─────────────── -->
            <div class="pd-col-side">

              <!-- Personal Info -->
              <div class="pd-card">
                <div class="pd-card-header">
                  <User :size="16" />
                  <h5>Personal Info</h5>
                </div>
                <div class="pd-card-body">
                  <div class="pd-side-item" v-if="user.email">
                    <Mail :size="13" class="pd-side-icon" />
                    <span>{{ user.email }}</span>
                  </div>
                  <div class="pd-side-item" v-if="user.phone">
                    <Phone :size="13" class="pd-side-icon" />
                    <span>{{ user.phone }}</span>
                  </div>
                  <div class="pd-side-item" v-if="user.current_city">
                    <MapPin :size="13" class="pd-side-icon" />
                    <span>{{ user.current_city }}</span>
                  </div>
                  <div class="pd-side-item" v-if="user.home_town">
                    <Home :size="13" class="pd-side-icon" />
                    <span>{{ user.home_town }}</span>
                  </div>
                  <div class="pd-side-item" v-if="user.dob">
                    <CalendarDays :size="13" class="pd-side-icon" />
                    <span>{{ formatDate(user.dob) }} ({{ getAge(user.dob) }} yrs)</span>
                  </div>
                  <div class="pd-side-item" v-if="user.gender">
                    <Users :size="13" class="pd-side-icon" />
                    <span>{{ user.gender === 1 ? 'Male' : user.gender === 2 ? 'Female' : 'Other' }}</span>
                  </div>
                  <div class="pd-side-item" v-if="user.portfolio_link">
                    <Link2 :size="13" class="pd-side-icon" />
                    <a :href="user.portfolio_link" target="_blank" class="pd-ext-link">Portfolio</a>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </template>

    </div>


  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, UserX, MessageCircle, FileText, ExternalLink, Download,
  Briefcase, GraduationCap, FolderOpen, User, Mail, Phone,
  MapPin, Home, CalendarDays, Users, Link2, Handshake, Zap, Newspaper
} from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PostCard from '@/components/PostCard.vue'
import api from '@/api/http'

const route  = useRoute()
const router = useRouter()

const user         = ref(null)
const loading      = ref(true)
const error        = ref(false)
const userPosts    = ref([])
const loadingPosts = ref(false)

async function loadProfile(id) {
  loading.value  = true
  error.value    = false
  user.value     = null
  userPosts.value = []
  try {
    const res = await api.get(`/api/profile/users/${id}`)
    if (res.data.result) {
      user.value = res.data.data
      fetchUserPosts(id)
    } else {
      error.value = true
    }
  } catch (e) {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function fetchUserPosts(id) {
  loadingPosts.value = true
  try {
    const res = await api.get('/api/posts', {
      params: { page: 1, per_page: 100, category: 0, search: '' }
    })
    const all = res.data.data ?? []
    userPosts.value = all.filter(p => String(p.creator?.id) === String(id))
  } catch {
    userPosts.value = []
  } finally {
    loadingPosts.value = false
  }
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    loadProfile(id)
  } else {
    // /profileDetail route — no id, show error or redirect
    error.value = true
    loading.value = false
  }
})

watch(() => route.params.id, id => {
  if (id) loadProfile(id)
})

function defaultAvatar(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=6366f1&color=fff&size=150`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function getAge(dob) {
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function openMessage() {
  if (!user.value) return
  router.push({ name: 'messages', query: { to: user.value.id } })
}
</script>

<style scoped>
.pd-page {
  background: #f0f2f5;
  min-height: 100vh;
}

/* ── Loading skeleton ────────────────── */
.pd-loading { }
.sk {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 300% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  display: block;
}
@keyframes shimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }
.pd-cover-sk { height: 240px; border-radius: 0; }
.pd-hero-sk { display: flex; align-items: center; gap: 16px; padding: 16px 0; }
.sk-circle { width: 90px; height: 90px; border-radius: 50%; flex-shrink: 0; }
.pd-sk-lines { display: flex; flex-direction: column; }
.sk-line { display: block; }

/* ── Error ────────────────────────────── */
.pd-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: #64748b;
  gap: 12px;
}
.pd-error h5 { font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0; }
.pd-error p  { font-size: .86rem; margin: 0; max-width: 320px; }

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 8px 18px;
  font-size: .84rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  margin-top: 8px;
}

/* ── Hero ─────────────────────────────── */
.pd-hero {
  height: 260px;
  position: relative;
}
.pd-cover {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1e293b, #334155);
  background-size: cover;
  background-position: center;
}
.pd-cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,.1), rgba(0,0,0,.6));
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.pd-hero-content {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 16px;
  padding-top: 160px;
  flex-wrap: wrap;
}

.pd-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 4px solid #fff;
  object-fit: cover;
  flex-shrink: 0;
}

.pd-hero-info { flex: 1; min-width: 200px; padding-bottom: 4px; }
.pd-name { color: #fff; font-size: 1.3rem; font-weight: 700; margin: 0 0 2px; }
.pd-title { color: #e5e7eb; font-size: .86rem; margin: 0 0 6px; }

.pd-badges { display: flex; flex-wrap: wrap; gap: 5px; }
.pd-badge {
  background: rgba(255,255,255,0.25);
  color: #fff;
  font-size: .7rem;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.35);
}
.pd-badge.outline { background: transparent; }
.pd-badge.sm { font-size: .68rem; padding: 2px 8px; background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
.pd-badge.sm.outline { background: transparent; border: 1px solid #d1d5db; }

.pd-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 4px;
  flex-shrink: 0;
}

/* Message button — bottom-right of cover */
.btn-msg-cover {
  position: absolute;
  bottom: 18px;
  right: 24px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #fff;
  color: #111;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: .88rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  transition: background .15s, transform .15s;
  z-index: 10;
}
.btn-msg-cover:hover { background: #f3f4f6; transform: translateY(-2px); }

.btn-ghost-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(6px);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 9px;
  padding: 7px 13px;
  font-size: .8rem;
  font-weight: 600;
  text-decoration: none;
  transition: background .15s;
}
.btn-ghost-action:hover { background: rgba(255,255,255,0.28); }

/* ── Main layout ──────────────────────── */
.pd-main { padding: 24px 0; }
.pd-row { display: flex; gap: 20px; }
.pd-col-main { flex: 1; min-width: 0; }
.pd-col-side { width: 300px; flex-shrink: 0; }

/* ── Card ─────────────────────────────── */
.pd-card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 18px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  overflow: hidden;
}

.pd-card-header {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 14px 18px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
  color: #374151;
}
.pd-card-header h5 {
  margin: 0;
  font-size: .9rem;
  font-weight: 700;
  color: #1e293b;
}

.pd-card-body { padding: 16px 18px; }

/* ── Info grid ────────────────────────── */
.pd-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.pd-info-item.full { grid-column: 1 / -1; }
.pd-info-label { display: block; font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #9ca3af; margin-bottom: 3px; }
.pd-info-val { font-size: .86rem; color: #111; font-weight: 500; line-height: 1.5; }

/* ── Skills ───────────────────────────── */
.pd-skills { display: flex; flex-wrap: wrap; gap: 7px; }
.pd-skill-tag {
  background: #f3f4f6;
  color: #374151;
  font-size: .78rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
}

/* ── Education ────────────────────────── */
.pd-edu-timeline { display: flex; flex-direction: column; }
.pd-edu-item { display: flex; gap: 0; }
.pd-edu-dot-col { display: flex; flex-direction: column; align-items: center; width: 24px; flex-shrink: 0; padding-top: 4px; }
.pd-edu-dot { width: 10px; height: 10px; border-radius: 50%; background: #6366f1; border: 2.5px solid #e0e7ff; flex-shrink: 0; }
.pd-edu-body { padding: 0 0 18px 12px; flex: 1; }
.pd-school-name { font-size: .9rem; font-weight: 700; color: #1e293b; margin: 0 0 4px; }
.pd-edu-badges { display: flex; gap: 5px; margin-bottom: 4px; flex-wrap: wrap; }
.pd-edu-date { font-size: .74rem; color: #94a3b8; margin: 0 0 4px; display: flex; align-items: center; gap: 4px; }
.pd-edu-desc { font-size: .78rem; color: #64748b; margin: 0; font-style: italic; }

/* ── Projects ─────────────────────────── */
.pd-projects-grid { display: flex; flex-direction: column; gap: 10px; }
.pd-project-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: border-color .15s, background .15s;
}
.pd-project-card:hover { border-color: #6366f1; background: #f8f5ff; }
.pd-proj-icon { width: 36px; height: 36px; border-radius: 9px; background: #ede9fe; color: #6366f1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pd-proj-title { font-size: .86rem; font-weight: 700; color: #1e293b; margin: 0; }
.pd-proj-link { font-size: .74rem; color: #94a3b8; margin: 0; word-break: break-all; }
.pd-proj-ext { color: #94a3b8; margin-left: auto; flex-shrink: 0; }

/* ── Sidebar items ────────────────────── */
.pd-side-item { display: flex; align-items: center; gap: 9px; font-size: .84rem; color: #374151; margin-bottom: 10px; }
.pd-side-icon { color: #9ca3af; flex-shrink: 0; }
.pd-ext-link { color: #6366f1; text-decoration: none; font-size: .84rem; }
.pd-ext-link:hover { text-decoration: underline; }

/* ── Posts section ───────────────────── */
.pd-post-count {
  margin-left: auto;
  background: #ede9fe;
  color: #6366f1;
  font-size: .72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}

.pd-posts-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 18px;
  color: #94a3b8;
  font-size: .86rem;
}

.pd-spin {
  width: 18px;
  height: 18px;
  border: 2px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  flex-shrink: 0;
}

.pd-posts-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 28px 18px;
  color: #94a3b8;
  text-align: center;
}
.pd-posts-empty p { margin: 0; font-size: .86rem; }

.pd-posts-list {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── CV Section ───────────────────────── */
.pd-cv-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 4px 0;
}
.pd-cv-file-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: #ede9fe;
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.pd-cv-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.pd-cv-label { font-size: .88rem; font-weight: 700; color: #1e293b; }
.pd-cv-sub   { font-size: .76rem; color: #94a3b8; }
.pd-cv-btns  { display: flex; gap: 8px; flex-shrink: 0; }
.pd-cv-btn-view, .pd-cv-btn-dl {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 13px;
  border-radius: 9px;
  font-size: .8rem;
  font-weight: 600;
  text-decoration: none;
  transition: all .15s;
  border: 1.5px solid #e5e7eb;
}
.pd-cv-btn-view { color: #374151; background: #fff; }
.pd-cv-btn-view:hover { border-color: #6366f1; color: #6366f1; background: #f8f5ff; }
.pd-cv-btn-dl { background: #111; color: #fff; border-color: #111; }
.pd-cv-btn-dl:hover { background: #374151; border-color: #374151; }

/* ── Collaboration (main column) ─────── */
.pd-collab-main {
  display: flex;
  gap: 18px;
  align-items: flex-start;
}
.pd-collab-logo-wrap {
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 8px;
}
.pd-collab-logo-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }
.pd-collab-info { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.pd-collab-title { font-size: .9rem; font-weight: 700; color: #1e293b; margin: 0; }
.pd-collab-desc  { font-size: .8rem; color: #64748b; margin: 0; line-height: 1.5; }
.pd-collab-visit-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 9px;
  font-size: .8rem;
  font-weight: 600;
  color: #374151;
  text-decoration: none;
  transition: all .15s;
  width: fit-content;
  margin-top: 2px;
}
.pd-collab-visit-btn:hover { border-color: #6366f1; color: #6366f1; background: #f8f5ff; }

</style>
