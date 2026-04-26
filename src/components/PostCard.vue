<template>
  <div class="post-card" v-if="post && post.creator">
    <div class="card">

      <!-- Header -->
      <div class="card-header">
        <div class="d-flex align-items-center gap-2">
          <router-link :to="`/profile/${post.creator.id}`" class="creator-av-link">
            <img
              :src="post.creator.avatar || 'https://via.placeholder.com/40'"
              class="rounded-circle creator-av"
              :alt="post.creator.full_name || 'User'"
            />
          </router-link>
          <div class="flex-grow-1">
            <router-link :to="`/profile/${post.creator.id}`" class="creator-name">
              {{ post.creator.full_name || 'Unknown User' }}
            </router-link>
            <div class="text-muted small d-flex align-items-center gap-1">
              {{ formatDate(post.created_at) }}
              <span>•</span>
              <i class="bi bi-globe-americas"></i>
            </div>
          </div>
          <div v-if="isOwner" class="d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm" @click="handleEdit">
              <i class="bi bi-pencil"></i> Edit
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="handleDelete">
              <i class="bi bi-trash"></i> Delete
            </button>
          </div>
          <button v-else class="btn btn-link text-muted p-0">
            <i class="bi bi-three-dots"></i>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="card-body">
        <p class="post-text mb-3" v-if="post.text">{{ post.text }}</p>

        <img
          v-if="post.image && !post.image.endsWith('/storage/posts')"
          :src="post.image"
          class="post-media mb-3"
          alt="Post image"
        />
        <img
          v-if="post.attachments && !post.attachments.endsWith('/storage/posts')"
          :src="post.attachments"
          class="post-media mb-3"
          alt="Attachment"
        />

        <div class="d-flex gap-2 flex-wrap mb-2" v-if="post.categories?.length">
          <span v-for="cat in post.categories" :key="cat.id" class="pc-badge">{{ cat.name }}</span>
        </div>
        <div class="mb-2" v-if="post.categories && post.categories.length === 0">
          <span class="pc-badge draft">Draft</span>
        </div>

        <!-- Reaction counts bar -->
        <div v-if="likeCount > 0 || comments.length > 0" class="reaction-bar">
          <span v-if="likeCount > 0" class="react-count">
            <span class="react-thumb">👍</span> {{ likeCount }}
          </span>
          <span v-if="comments.length > 0" class="react-comment-count">
            {{ comments.length }} comment{{ comments.length > 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="card-footer">
        <div class="action-row">
          <button class="act-btn" :class="{ liked: liked }" @click="toggleLike">
            <i :class="liked ? 'bi bi-hand-thumbs-up-fill' : 'bi bi-hand-thumbs-up'"></i>
            <span>{{ liked ? 'Liked' : 'Like' }}</span>
          </button>

          <button class="act-btn" :class="{ active: showComments }" @click="showComments = !showComments">
            <i class="bi bi-chat"></i>
            <span>Comment</span>
          </button>

          <div class="share-wrap" ref="shareRef">
            <button class="act-btn" :class="{ active: showShare }" @click="showShare = !showShare">
              <i class="bi bi-share"></i>
              <span>Share</span>
            </button>

            <!-- Share dropdown -->
            <Transition name="drop">
              <div v-if="showShare" class="share-dropdown">
                <a :href="shareTelegram" target="_blank" class="share-item" @click="showShare = false">
                  <span class="share-icon tg">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/></svg>
                  </span>
                  Telegram
                </a>
                <a :href="shareTwitter" target="_blank" class="share-item" @click="showShare = false">
                  <span class="share-icon tw">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </span>
                  Twitter / X
                </a>
                <a :href="shareMessenger" target="_blank" class="share-item" @click="showShare = false">
                  <span class="share-icon ms">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 0C5.373 0 0 5.176 0 11.562c0 3.643 1.793 6.9 4.601 9.045V24l4.231-2.334C9.875 21.88 10.927 22 12 22c6.627 0 12-4.925 12-11.438S18.627 0 12 0zm1.193 15.398-3.037-3.258-5.998 3.258L10.4 8.6l3.119 3.258 5.916-3.258z"/></svg>
                  </span>
                  Messenger
                </a>
                <button class="share-item" @click="copyLink">
                  <span class="share-icon cp">
                    <i class="bi bi-link-45deg"></i>
                  </span>
                  {{ copied ? 'Copied!' : 'Copy Link' }}
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Comments section -->
      <Transition name="expand">
        <div v-if="showComments" class="comments-section">
          <!-- Existing comments -->
          <div v-if="comments.length" class="comments-list">
            <div v-for="(c, i) in comments" :key="i" class="comment-item">
              <img :src="c.avatar" class="comment-av" :alt="c.name" />
              <div class="comment-bubble">
                <p class="comment-author">{{ c.name }}</p>
                <p class="comment-text">{{ c.text }}</p>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="comment-input-row">
            <img :src="myAvatar" class="comment-av" alt="Me" />
            <div class="comment-input-wrap">
              <textarea
                v-model="commentDraft"
                class="comment-input"
                placeholder="Write a comment…"
                rows="1"
                @keydown.enter.exact.prevent="submitComment"
              />
              <button
                class="comment-send"
                :disabled="!commentDraft.trim()"
                @click="submitComment"
              >
                <i class="bi bi-send-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStores } from '@/stores/auth'
import { usePostStore } from '@/stores/post'
import { useRouter } from 'vue-router'

const props = defineProps({ post: { type: Object, required: true } })

const auth      = useAuthStores()
const postStore = usePostStore()
const router    = useRouter()

const isOwner = computed(() => auth.user?.id === props.post.creator?.id)

const myAvatar = computed(() =>
  auth.user?.avatar ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user?.full_name || 'Me')}&background=6366f1&color=fff&size=64`
)

// ── Like (static) ──────────────────────
const liked     = ref(false)
const likeCount = ref(Math.floor(Math.random() * 20))

function toggleLike() {
  liked.value = !liked.value
  likeCount.value += liked.value ? 1 : -1
}

// ── Comment (static) ───────────────────
const showComments  = ref(false)
const commentDraft  = ref('')
const comments      = ref([])

function submitComment() {
  const text = commentDraft.value.trim()
  if (!text) return
  comments.value.push({
    name: auth.user?.full_name || 'Me',
    avatar: myAvatar.value,
    text,
  })
  commentDraft.value = ''
}

// ── Share ──────────────────────────────
const showShare = ref(false)
const copied    = ref(false)
const shareRef  = ref(null)

const pageUrl = computed(() => window.location.origin)
const shareText = computed(() => encodeURIComponent(props.post.text?.slice(0, 100) || 'Check this out'))
const shareUrl  = computed(() => encodeURIComponent(pageUrl.value))

const shareTelegram  = computed(() => `https://t.me/share/url?url=${shareUrl.value}&text=${shareText.value}`)
const shareTwitter   = computed(() => `https://twitter.com/intent/tweet?text=${shareText.value}&url=${shareUrl.value}`)
const shareMessenger = computed(() => `https://www.facebook.com/dialog/send?link=${shareUrl.value}&app_id=181477803978799`)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(pageUrl.value)
    copied.value = true
    setTimeout(() => { copied.value = false; showShare.value = false }, 1500)
  } catch {
    showShare.value = false
  }
}

function onClickOutside(e) {
  if (shareRef.value && !shareRef.value.contains(e.target)) {
    showShare.value = false
  }
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

// ── Helpers ────────────────────────────
function formatDate(d) {
  return new Date(d).toLocaleDateString()
}

function handleEdit() {
  router.push({
    name: 'CreatePost',
    query: {
      edit: props.post.id,
      from: router.currentRoute.value.fullPath,
    },
  })
}

async function handleDelete() {
  if (confirm('Are you sure you want to delete this post?')) {
    try { await postStore.deletePost(props.post.id) }
    catch (e) { console.error(e) }
  }
}
</script>

<style scoped>
.post-card { margin-bottom: 16px; }

.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  background: #fff;
  overflow: hidden;
}

/* Header */
.card-header {
  background: transparent;
  border-bottom: 1px solid #f1f5f9;
  padding: 12px 16px;
}

.creator-av-link { flex-shrink: 0; display: block; }
.creator-av { width: 40px; height: 40px; object-fit: cover; display: block; transition: opacity .15s; }
.creator-av:hover { opacity: .85; }

.creator-name {
  display: block;
  font-weight: 600;
  color: #1e293b;
  font-size: .93rem;
  text-decoration: none;
  line-height: 1.2;
}
.creator-name:hover { color: #6366f1; text-decoration: underline; }

/* Body */
.card-body { padding: 14px 16px; }

.post-text { color: #1e293b; font-size: .95rem; line-height: 1.5; margin: 0; word-break: break-word; }

.post-media { width: 100%; max-height: 500px; object-fit: cover; border-radius: 10px; display: block; }

.pc-badge {
  font-size: .72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: #ede9fe;
  color: #6366f1;
  display: inline-block;
}
.pc-badge.draft { background: #fef9c3; color: #a16207; }

/* Reaction bar */
.reaction-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0 0;
  border-top: 1px solid #f1f5f9;
  margin-top: 10px;
  font-size: .8rem;
  color: #64748b;
}
.react-count { display: flex; align-items: center; gap: 4px; }
.react-thumb { font-size: .9rem; }
.react-comment-count { color: #64748b; }

/* Footer */
.card-footer { border-top: 1px solid #f1f5f9; padding: 2px 8px; background: #fff; }

.action-row { display: flex; justify-content: space-around; }

.act-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: none;
  border: none;
  border-radius: 8px;
  font-size: .86rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
}
.act-btn:hover { background: #f1f5f9; color: #374151; }
.act-btn.liked { color: #6366f1; }
.act-btn.liked i { color: #6366f1; }
.act-btn.active { color: #6366f1; background: #eff6ff; }

/* Share dropdown */
.share-wrap { position: relative; }

.share-dropdown {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.14);
  border: 1px solid #e2e8f0;
  min-width: 180px;
  overflow: hidden;
  z-index: 200;
}

.share-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  font-size: .86rem;
  color: #1e293b;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: background .12s;
}
.share-item:hover { background: #f8fafc; }

.share-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: .9rem;
}
.share-icon.tg { background: #e8f4fd; color: #0088cc; }
.share-icon.tw { background: #f0f0f0; color: #000; }
.share-icon.ms { background: #e8f0fe; color: #0078ff; }
.share-icon.cp { background: #f1f5f9; color: #475569; }

/* Comments */
.comments-section {
  border-top: 1px solid #f1f5f9;
  background: #fafbfc;
  padding: 12px 16px;
}

.comments-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }

.comment-item { display: flex; gap: 9px; align-items: flex-start; }

.comment-av {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-bubble {
  background: #fff;
  border-radius: 12px;
  border-bottom-left-radius: 4px;
  padding: 8px 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  flex: 1;
}
.comment-author { font-size: .78rem; font-weight: 700; color: #1e293b; margin: 0 0 2px; }
.comment-text   { font-size: .84rem; color: #374151; margin: 0; line-height: 1.4; }

.comment-input-row { display: flex; gap: 9px; align-items: flex-end; }
.comment-input-wrap {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 6px;
  background: #fff;
  border-radius: 22px;
  border: 1.5px solid #e2e8f0;
  padding: 6px 8px 6px 14px;
  transition: border-color .15s;
}
.comment-input-wrap:focus-within { border-color: #6366f1; }

.comment-input {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: .86rem;
  font-family: inherit;
  background: transparent;
  color: #1e293b;
  line-height: 1.4;
  max-height: 80px;
  overflow-y: auto;
}

.comment-send {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #6366f1;
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  font-size: .8rem;
  transition: background .15s;
}
.comment-send:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; }
.comment-send:not(:disabled):hover { background: #4f46e5; }

/* Transitions */
.drop-enter-active, .drop-leave-active { transition: opacity .15s, transform .15s; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateX(-50%) translateY(6px); }

.expand-enter-active, .expand-leave-active { transition: max-height .25s ease, opacity .2s; overflow: hidden; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }
.expand-enter-to { max-height: 600px; opacity: 1; }

/* Responsive */
@media (max-width: 576px) {
  .card-header, .card-body { padding: 10px 12px; }
  .act-btn { padding: 8px 10px; font-size: .8rem; }
}
</style>
