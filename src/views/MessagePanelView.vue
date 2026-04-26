<template>
  <div class="message-panel">
    <!-- Header -->
    <div class="message-header">
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <h2 class="message-title">Messages</h2>
          <p class="message-subtitle">Stay connected with your network</p>
        </div>
        <button class="btn btn-close-panel" @click="closePanel">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="message-content">
      <!-- Conversations Sidebar -->
      <div class="conversations-sidebar">
        <div class="search-section">
          <div class="search-input-wrapper">
            <i class="bi bi-search search-icon"></i>
            <input
              type="text"
              class="form-control search-input"
              placeholder="Search conversations..."
              v-model="searchQuery"
            />
          </div>
        </div>

        <div v-if="msgStore.loading" class="loading-state">
          <div class="sp"></div>
          <p>Loading messages…</p>
        </div>

        <div v-else-if="filteredConversations.length === 0" class="empty-conv">
          <i class="bi bi-chat-dots"></i>
          <p>No conversations yet</p>
        </div>

        <div v-else class="conversations-list">
          <div
            v-for="conv in filteredConversations"
            :key="conv.partner.id"
            class="conversation-item"
            :class="{ active: activePartner?.id === conv.partner.id }"
            @click="selectConversation(conv.partner)"
          >
            <div class="conversation-avatar">
              <img
                :src="partnerAvatar(conv.partner)"
                :alt="conv.partner.full_name"
                class="avatar-img"
              />
            </div>
            <div class="conversation-info">
              <div class="conversation-header">
                <h6 class="conversation-name">{{ conv.partner.full_name }}</h6>
                <span class="conversation-time">{{ timeAgo(conv.created_at) }}</span>
              </div>
              <p class="conversation-message">
                <span v-if="conv.isOwn" class="you-prefix">You: </span>{{ truncate(conv.message, 40) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="messages-area">
        <div v-if="activePartner" class="messages-container">
          <!-- Chat Header -->
          <div class="chat-header">
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <div class="chat-avatar">
                  <img :src="partnerAvatar(activePartner)" :alt="activePartner.full_name" class="avatar-img" />
                </div>
                <div class="chat-info">
                  <h6 class="chat-name">{{ activePartner.full_name }}</h6>
                  <router-link :to="`/profile/${activePartner.id}`" class="view-profile-link">
                    View profile
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div class="messages-list" ref="messagesContainer">
            <div v-if="thread.length === 0" class="no-messages">
              <i class="bi bi-chat-heart"></i>
              <p>Say hello to {{ activePartner.full_name }}!</p>
            </div>

            <div
              v-for="msg in thread"
              :key="msg.id"
              class="message-item"
              :class="{ 'message-own': msg.isOwn }"
            >
              <div class="message-avatar">
                <img
                  :src="msg.isOwn ? myAvatar : partnerAvatar(activePartner)"
                  class="avatar-img"
                />
              </div>
              <div class="message-content-wrapper">
                <div class="message-bubble" :class="{ 'message-own-bubble': msg.isOwn }">
                  <p class="message-text">{{ msg.message }}</p>
                </div>
                <span class="message-time">{{ formatTime(msg.created_at) }}</span>
              </div>
            </div>

            <div v-if="sending" class="message-item message-own sending-indicator">
              <div class="message-content-wrapper">
                <div class="message-bubble message-own-bubble">
                  <span class="dot-anim"></span>
                  <span class="dot-anim"></span>
                  <span class="dot-anim"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="message-input-section">
            <div class="input-wrapper">
              <textarea
                class="form-control message-textarea"
                placeholder="Type your message…"
                v-model="draft"
                @keydown.enter.exact.prevent="sendMessage"
                rows="1"
              ></textarea>
              <button class="btn btn-send" @click="sendMessage" :disabled="!draft.trim() || sending">
                <i v-if="sending" class="bi bi-hourglass-split"></i>
                <i v-else class="bi bi-send-fill"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-icon"><i class="bi bi-chat-dots"></i></div>
          <h5>Select a conversation</h5>
          <p>Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessageStore } from '@/stores/message'
import { useAuthStores } from '@/stores/auth'
import api from '@/api/http'

const router   = useRouter()
const route    = useRoute()
const msgStore = useMessageStore()
const auth     = useAuthStores()

const searchQuery      = ref('')
const activePartner    = ref(null)
const draft            = ref('')
const sending          = ref(false)
const messagesContainer = ref(null)

const myAvatar = computed(() =>
  auth.user?.avatar ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user?.full_name || 'Me')}&background=6366f1&color=fff&size=64`
)

const thread = computed(() => {
  if (!activePartner.value) return []
  return msgStore.threadWith(activePartner.value.id)
})

const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) return msgStore.conversations
  const q = searchQuery.value.toLowerCase()
  return msgStore.conversations.filter(c =>
    c.partner.full_name?.toLowerCase().includes(q) ||
    c.message?.toLowerCase().includes(q)
  )
})

function partnerAvatar(partner) {
  return partner?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(partner?.full_name || 'U')}&background=6366f1&color=fff&size=64`
}

function truncate(str, n) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '…' : str
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function selectConversation(partner) {
  activePartner.value = partner
  scrollToBottom()
}

async function sendMessage() {
  if (!draft.value.trim() || !activePartner.value) return
  sending.value = true
  const text = draft.value.trim()
  draft.value = ''
  try {
    await msgStore.sendMessage(activePartner.value.id, text)
    await msgStore.fetchAll()
    scrollToBottom()
  } catch (e) {
    console.error(e)
    draft.value = text
  } finally {
    sending.value = false
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function closePanel() {
  router.push('/')
}

onMounted(async () => {
  await msgStore.fetchAll()

  const toId = route.query.to ? Number(route.query.to) : null

  if (toId) {
    // Try to find existing conversation first
    const existing = msgStore.conversations.find(c => c.partner.id === toId)
    if (existing) {
      selectConversation(existing.partner)
    } else {
      // No prior conversation — fetch user info and open empty thread
      try {
        const res = await api.get(`/api/profile/users/${toId}`)
        if (res.data.result) {
          selectConversation(res.data.data)
        }
      } catch {
        // Silently fall back to first conversation
        if (msgStore.conversations.length > 0) {
          selectConversation(msgStore.conversations[0].partner)
        }
      }
    }
  } else if (msgStore.conversations.length > 0) {
    selectConversation(msgStore.conversations[0].partner)
  }
})
</script>

<style scoped>
.message-panel {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: white;
  z-index: 1050;
  display: flex;
  flex-direction: column;
}

.message-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  flex-shrink: 0;
}

.message-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
}

.message-subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.btn-close-panel {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
  cursor: pointer;
}
.btn-close-panel:hover { background: rgba(255,255,255,0.2); }

.message-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ── Left sidebar ── */
.conversations-sidebar {
  width: 320px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.search-section {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: white;
  flex-shrink: 0;
}

.search-input-wrapper { position: relative; }

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  z-index: 1;
}

.search-input {
  padding-left: 2.5rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}
.search-input:focus {
  background: white;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 10px;
  color: #94a3b8;
  font-size: .86rem;
}

.sp {
  width: 22px; height: 22px;
  border: 2px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

.empty-conv {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 8px;
  color: #94a3b8;
  font-size: .86rem;
}
.empty-conv i { font-size: 2rem; opacity: .5; }
.empty-conv p { margin: 0; }

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.25rem;
}
.conversation-item:hover { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.conversation-item.active { background: white; box-shadow: 0 2px 8px rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.2); }

.conversation-avatar { position: relative; flex-shrink: 0; }

.avatar-img {
  width: 48px; height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.conversation-info { flex: 1; min-width: 0; }

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.conversation-name {
  margin: 0;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-time { font-size: 0.72rem; color: #94a3b8; flex-shrink: 0; }

.conversation-message {
  margin: 0;
  font-size: 0.82rem;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.you-prefix { color: #94a3b8; }

/* ── Messages area ── */
.messages-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: white;
  flex-shrink: 0;
}

.chat-avatar {
  position: relative;
  margin-right: 0.75rem;
  flex-shrink: 0;
}
.chat-avatar .avatar-img { width: 40px; height: 40px; }

.chat-info h6 { margin: 0; font-size: 0.9rem; font-weight: 600; color: #1e293b; }

.view-profile-link { font-size: .76rem; color: #6366f1; text-decoration: none; }
.view-profile-link:hover { text-decoration: underline; }

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f8fafc;
}

.no-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 10px;
  color: #94a3b8;
  text-align: center;
  margin: auto;
}
.no-messages i { font-size: 2.5rem; opacity: .4; }
.no-messages p { margin: 0; font-size: .86rem; }

.message-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}
.message-item.message-own { flex-direction: row-reverse; }

.message-avatar { flex-shrink: 0; }
.message-avatar .avatar-img { width: 32px; height: 32px; }

.message-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 70%;
}
.message-item.message-own .message-content-wrapper { align-items: flex-end; }

.message-bubble {
  padding: 0.75rem 1rem;
  border-radius: 18px;
  word-wrap: break-word;
  background: #fff;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
}
.message-own-bubble {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 4px;
}

.message-text { margin: 0; font-size: 0.9rem; line-height: 1.4; }

.message-time {
  font-size: 0.72rem;
  color: #94a3b8;
  margin-top: 0.25rem;
  padding: 0 0.5rem;
}

/* sending dots */
.sending-indicator .message-bubble {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 12px 16px;
}
.dot-anim {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: rgba(255,255,255,0.8);
  display: inline-block;
  animation: bounce .9s infinite ease-in-out;
}
.dot-anim:nth-child(2) { animation-delay: .15s; }
.dot-anim:nth-child(3) { animation-delay: .3s; }
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.7); opacity: .6; }
  40%            { transform: scale(1);   opacity: 1; }
}

/* ── Input ── */
.message-input-section {
  border-top: 1px solid #e2e8f0;
  padding: 1rem 1.5rem;
  background: white;
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
}

.message-textarea {
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 0.75rem 1rem;
  resize: none;
  background: #f8fafc;
  font-size: 0.9rem;
  line-height: 1.4;
  max-height: 120px;
  overflow-y: auto;
}
.message-textarea:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}

.btn-send {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  color: white;
  padding: 0.75rem;
  border-radius: 12px;
  transition: all 0.2s;
  flex-shrink: 0;
  cursor: pointer;
}
.btn-send:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(99,102,241,0.3); }
.btn-send:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Empty state ── */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #64748b;
}
.empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
.empty-state h5 { margin-bottom: 0.5rem; color: #1e293b; }
.empty-state p { margin: 0; font-size: 0.9rem; }

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .conversations-sidebar { width: 260px; }
  .message-title { font-size: 1.5rem; }
  .message-header { padding: 1rem 1.5rem; }
}
@media (max-width: 576px) {
  .conversations-sidebar { display: none; }
}
</style>
