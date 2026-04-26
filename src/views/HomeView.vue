<script setup>
import { ref, onMounted, watch } from 'vue'
import { usePostStore } from '@/stores/post'
import { useCategoryStore } from '@/stores/category'
import { useToast } from 'vue-toast-notification'
import PostCard from '@/components/PostCard.vue'
import CreatePostView from '@/views/CreatePostView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ChatWidget from '@/components/ChatWidget.vue'
import api from '@/api/http'

const postStore     = usePostStore()
const categoryStore = useCategoryStore()
const loading       = ref(true)
const $toast        = useToast()
const searchTab     = ref('feed') // 'feed' | 'people'

// Reset tab to feed and scroll to top on every new search
watch(() => postStore.searchQuery, () => {
  searchTab.value = 'feed'
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// People You May Know
const suggestedUsers  = ref([])
const loadingPeople   = ref(true)

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      postStore.fetchPosts(),
      categoryStore.fetchCategory(),
      fetchSuggestedUsers(),
    ])
  } catch (error) {
    $toast.error(error.response?.data?.message || 'Failed to load data.')
  } finally {
    loading.value = false
  }
})

async function fetchSuggestedUsers() {
  loadingPeople.value = true
  try {
    // Try a broad search to get some users
    const res = await api.get('/api/users/search', { params: { q: '' } })
    if (res.data.result && Array.isArray(res.data.data)) {
      suggestedUsers.value = res.data.data.slice(0, 5)
    }
  } catch {
    // Silently fail — not critical
  } finally {
    loadingPeople.value = false
  }
}

const handlePostCreated = async () => {
  try {
    await postStore.fetchPosts()
    $toast.success('Post created successfully!')
  } catch {
    $toast.error('Failed to refresh posts')
  }
}

const filterByCategory = async (categoryId) => {
  loading.value = true
  try {
    await postStore.fetchPosts('', 1, 20, categoryId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch {
    $toast.error('Failed to filter posts')
  } finally {
    loading.value = false
  }
}

const loadMorePosts = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const nextPage = postStore.pagination.current_page + 1
    await postStore.fetchPostsAppend('', nextPage)
  } catch {
    $toast.error('Failed to load more posts')
  } finally {
    loading.value = false
  }
}

const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'event': 'bi-calendar-event',
    'internship': 'bi-briefcase',
    'jobs': 'bi-briefcase-fill',
    'presentation': 'bi-easel',
    'project': 'bi-diagram-3',
    'study': 'bi-book',
    'posts': 'bi-newspaper',
    'all posts': 'bi-newspaper'
  }
  return 'bi ' + (iconMap[categoryName.toLowerCase()] || 'bi-tag')
}

function userAvatar(user) {
  return user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'U')}&background=6366f1&color=fff&size=80`
}
</script>

<template>
  <DashboardLayout>
    <div class="home-page">
      <div class="container">
        <div class="row">

          <!-- MAIN FEED -->
          <div class="col-feed">
            <div class="card create-post-card">
              <div class="card-body">
                <CreatePostView @post-created="handlePostCreated" />
              </div>
            </div>

            <!-- Search tabs (only while searching) -->
            <div v-if="postStore.searchQuery" class="search-tabs">
              <button
                class="stab"
                :class="{ active: searchTab === 'feed' }"
                @click="searchTab = 'feed'"
              >
                <i class="bi bi-newspaper"></i> Feed
              </button>
              <button
                class="stab"
                :class="{ active: searchTab === 'people' }"
                @click="searchTab = 'people'"
              >
                <i class="bi bi-people-fill"></i> People
                <span v-if="postStore.searchUsers.length" class="stab-badge">{{ postStore.searchUsers.length }}</span>
              </button>
            </div>

            <!-- ── FEED TAB ── -->
            <template v-if="!postStore.searchQuery || searchTab === 'feed'">
              <div v-if="loading && postStore.posts.length === 0" class="card text-center">
                <div class="card-body">
                  <div class="spinner"></div>
                  <p class="card-text">Loading posts...</p>
                </div>
              </div>

              <div v-else-if="postStore.posts.length > 0">
                <div v-for="post in postStore.posts" :key="post.id" class="card post-card">
                  <div class="card-body">
                    <PostCard :post="post" />
                  </div>
                </div>
              </div>

              <div v-else class="card text-center">
                <div class="card-body">
                  <i class="bi bi-newspaper empty-icon"></i>
                  <h4 class="card-title">No posts yet</h4>
                  <p class="card-text">Be the first to share something!</p>
                </div>
              </div>

              <div v-if="postStore.pagination?.has_more_pages" class="load-more">
                <button class="btn-load" @click="loadMorePosts" :disabled="loading">
                  <span v-if="loading" class="spinner small"></span>
                  Load More Posts
                </button>
              </div>
            </template>

            <!-- ── PEOPLE TAB ── -->
            <template v-if="postStore.searchQuery && searchTab === 'people'">
              <div v-if="postStore.searchUsers.length === 0" class="card text-center">
                <div class="card-body">
                  <i class="bi bi-person-x empty-icon"></i>
                  <h4 class="card-title">No people found</h4>
                  <p class="card-text">Try a different search term.</p>
                </div>
              </div>

              <div v-else class="card search-people-card">
                <div class="card-body">
                  <div class="search-people-grid">
                    <router-link
                      v-for="u in postStore.searchUsers"
                      :key="u.id"
                      :to="`/profile/${u.id}`"
                      class="search-person-item"
                    >
                      <img :src="userAvatar(u)" class="search-person-av" :alt="u.full_name" />
                      <div class="search-person-info">
                        <p class="search-person-name">{{ u.full_name }}</p>
                        <p class="search-person-role">{{ u.professional?.job_title || 'User' }}</p>
                      </div>
                      <span class="search-person-btn">View Profile</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- RIGHT SIDEBAR -->
          <div class="col-side">
            <div class="sidebar">

              <!-- Categories -->
              <div class="card">
                <div class="card-body">
                  <h6 class="card-title">Categories</h6>
                  <div v-if="categoryStore.loading" class="text-center">
                    <div class="spinner small"></div>
                  </div>
                  <div v-else class="category-list">
                    <div
                      v-for="cat in categoryStore.category"
                      :key="cat.id"
                      class="category-item"
                      @click="filterByCategory(cat.id)"
                    >
                      <i :class="getCategoryIcon(cat.name)"></i>
                      <span>{{ cat.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- People You May Know -->
              <div class="card">
                <div class="card-body">
                  <h6 class="card-title">People You May Know</h6>

                  <div v-if="loadingPeople" class="text-center">
                    <div class="spinner small"></div>
                  </div>

                  <template v-else-if="suggestedUsers.length">
                    <div
                      v-for="person in suggestedUsers"
                      :key="person.id"
                      class="person-item"
                    >
                      <router-link :to="`/profile/${person.id}`" class="person-av-link">
                        <img :src="userAvatar(person)" class="person-av" :alt="person.full_name" />
                      </router-link>
                      <div class="person-info">
                        <router-link :to="`/profile/${person.id}`" class="person-name">
                          {{ person.full_name }}
                        </router-link>
                        <p class="person-role">{{ person.professional?.job_title || 'User' }}</p>
                      </div>
                      <router-link
                        :to="`/profile/${person.id}`"
                        class="person-view-btn"
                        title="View profile"
                      >View</router-link>
                    </div>
                  </template>

                  <div v-else class="people-empty">
                    <p>Search for people using the search bar above.</p>
                  </div>
                </div>
              </div>

              <!-- Chat Widget -->
              <ChatWidget />

            </div>
          </div>

        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.home-page {
  background: #f0f2f5;
  min-height: 100vh;
  padding: 20px 0;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.col-feed {
  flex: 1;
  min-width: 0;
}

.col-side {
  width: 280px;
  flex-shrink: 0;
}

/* ── Search tabs ───────────────────── */
.search-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.stab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 22px;
  border: 2px solid #e2e8f0;
  background: #fff;
  font-size: .86rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  font-family: inherit;
  transition: all .18s;
}
.stab:hover { border-color: #6366f1; color: #6366f1; }
.stab.active {
  background: #6366f1;
  border-color: #6366f1;
  color: #fff;
  box-shadow: 0 2px 8px rgba(99,102,241,.25);
}

.stab-badge {
  background: rgba(255,255,255,0.3);
  color: inherit;
  font-size: .7rem;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 20px;
}
.stab:not(.active) .stab-badge {
  background: #ede9fe;
  color: #6366f1;
}

/* ── People results ─────────────────── */
.search-people-card { border-left: 3px solid #6366f1; }

.search-people-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.search-person-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: background .15s;
}
.search-person-item:hover { background: #f8fafc; }

.search-person-av {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.search-person-info { flex: 1; min-width: 0; }
.search-person-name {
  font-size: .88rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.search-person-role {
  font-size: .76rem;
  color: #94a3b8;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-person-btn {
  font-size: .76rem;
  font-weight: 600;
  color: #6366f1;
  padding: 5px 12px;
  border-radius: 8px;
  border: 1.5px solid #e0e7ff;
  background: #f8f5ff;
  flex-shrink: 0;
  white-space: nowrap;
}

/* CARD */
.card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.card-body { padding: 14px 16px; }

.card-title {
  font-weight: 700;
  font-size: .9rem;
  margin-bottom: 10px;
  color: #1e293b;
}

.card-text {
  color: #65676b;
  font-size: 14px;
}

/* SIDEBAR */
.sidebar {
  position: sticky;
  top: 80px;
}

/* CREATE POST */
.create-post-card { padding: 0; }

/* POST */
.post-card { transition: 0.2s; }
.post-card:hover { transform: translateY(-2px); }

/* CATEGORY */
.category-list { display: flex; flex-direction: column; gap: 6px; }
.category-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: .86rem;
  color: #374151;
  transition: background .15s;
}
.category-item:hover { background: #f0f2f5; }

/* People You May Know */
.person-item {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 10px;
}

.person-av-link { flex-shrink: 0; }
.person-av {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.person-info { flex: 1; min-width: 0; }
.person-name {
  font-size: .82rem;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
.person-name:hover { color: #6366f1; }
.person-role {
  font-size: .72rem;
  color: #94a3b8;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.person-view-btn {
  font-size: .72rem;
  font-weight: 600;
  color: #6366f1;
  text-decoration: none;
  flex-shrink: 0;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid #e0e7ff;
  transition: background .15s;
}
.person-view-btn:hover { background: #eff6ff; }

.people-empty p {
  font-size: .78rem;
  color: #94a3b8;
  text-align: center;
  margin: 8px 0 4px;
}

/* LOAD MORE */
.load-more { display: flex; justify-content: center; margin: 10px 0 20px; }
.btn-load {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 20px;
  border-radius: 9px;
  border: none;
  background: #1877f2;
  color: #fff;
  cursor: pointer;
  font-size: .86rem;
  font-weight: 600;
  font-family: inherit;
}
.btn-load:hover:not(:disabled) { background: #166fe5; }
.btn-load:disabled { opacity: .6; cursor: not-allowed; }

/* SPINNER */
.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #ddd;
  border-top-color: #1877f2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 16px auto;
  display: block;
}
.spinner.small { width: 16px; height: 16px; border-width: 2px; margin: 8px auto; }

@keyframes spin { to { transform: rotate(360deg); } }

/* EMPTY */
.empty-icon { font-size: 40px; color: #ccc; margin-bottom: 10px; }
.text-center { text-align: center; }
</style>
