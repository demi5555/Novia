<template>
  <DashboardLayout>
    <div class="chat-app pt-4 pb-5">
      <div class="container-fluid">
        <div class="row g-3">
          <div class="col-lg-4 col-md-5">
            <div class="card shadow-sm border-0 h-100">
              <div class="card-body p-3">
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <h2 class="h5 fw-bold mb-0 text-primary"><i class="bi bi-chat-fill me-2"></i>សារ</h2>
                  <button class="btn btn-link text-secondary p-0" @click="closePanel">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
                <div class="position-relative mb-3">
                  <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                  <input v-model="searchQuery" type="text" class="form-control rounded-pill ps-5 py-2"
                    placeholder="ស្វែងរកការសន្ទនា..." />
                </div>
                <div v-if="msgStore.loading" class="text-center py-5">
                  <div class="spinner-border text-primary spinner-border-sm"></div>
                  <p class="small text-muted mt-2 mb-0"> កំពុងផ្ទុកសារ... </p>
                </div>
                <div v-else-if="filteredConversations.length === 0" class="text-center py-5">
                  <div class="empty-chat-icon mx-auto">
                    <i class="bi bi-chat-dots"></i>
                  </div>
                  <p class="text-muted mb-0">មិនទាន់មានការសន្ទនា</p>
                </div>
                <div v-else class="d-flex flex-column gap-2">
                  <div v-for="conv in filteredConversations" :key="conv.partner.id"
                    class="conversation-item d-flex align-items-center p-2" :class="{
                      'active-conv': activePartner?.id === conv.partner.id
                    }" @click="selectConversation(conv.partner)">
                    <div class="position-relative me-3 flex-shrink-0">
                      <img :src="partnerAvatar(conv.partner)" class="rounded-circle" width="48" height="48"
                        style="object-fit: cover;" />
                      <span v-if="conv.partner.online" class="online-dot position-absolute bottom-0 end-0"></span>
                    </div>
                    <div class="flex-grow-1 overflow-hidden">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="fw-semibold text-truncate">
                          {{ conv.partner.full_name }}
                        </div>
                        <small class="text-muted">
                          {{ timeAgo(conv.created_at) }}
                        </small>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mt-1">
                        <small class="text-muted text-truncate">
                          <span v-if="conv.isOwn">អ្នក:</span>
                          {{ truncate(conv.message, 35) }}
                        </small>
                        <span v-if="conv.unread > 0" class="badge rounded-pill bg-primary">
                          {{ conv.unread }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-8 col-md-7" v-if="activePartner">
            <div class="chat-window card border-0 shadow-sm d-flex flex-column" style="height: calc(100vh - 140px);">
              <div class="bg-white px-4 py-3 border-bottom">
                <div class="d-flex align-items-center gap-3">
                  <div class="position-relative">
                    <img :src="partnerAvatar(activePartner)" class="rounded-circle" width="48" height="48" style="object-fit: cover;" />
                    <span v-if="activePartner.online" class="online-dot position-absolute bottom-0 end-0"></span>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-1">
                      {{ activePartner.full_name }}
                    </h6>
                    <div class="d-flex align-items-center gap-2 small">
                      <span v-if="activePartner.online" class="text-success">
                        ● កំពុងអនឡាញ
                      </span>
                      <span v-else class="text-muted">
                        ● អនឡាញចុងក្រោយ
                        {{ timeAgo(activePartner.last_seen) }}
                      </span>
                      <span class="text-muted">•</span>
                      <router-link :to="`/profile/${activePartner.id}`" class="text-decoration-none">
                        មើលប្រវត្តិរូប
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
              <div ref="messagesContainer" class="messages-area flex-grow-1 px-4 py-3">
                <div v-if="thread.length === 0"
                  class="d-flex flex-column justify-content-center align-items-center h-100">
                  <div class="empty-chat-icon mb-3">
                    <i class="bi bi-chat-heart"></i>
                  </div>
                  <p class="text-muted text-center mb-0">សួស្តី<strong>{{ activePartner.full_name }}</strong><br /> ចាប់ផ្តើមការសន្ទនា</p>
                </div>
                <template v-for="(group, idx) in groupedThread" :key="idx">
                  <div class="text-center my-3">
                    <span class="badge rounded-pill text-bg-light px-3 py-2">
                      {{ group.date }}
                    </span>
                  </div>
                  <div v-for="msg in group.messages" :key="msg.id" class="d-flex align-items-end mb-2"
                    :class="msg.isOwn ? 'justify-content-end' : 'justify-content-start'">
                    <img v-if="!msg.isOwn" :src="partnerAvatar(activePartner)" class="rounded-circle me-2 flex-shrink-0"
                      width="30" height="30" style="object-fit: cover;" />
                    <div class="message-bubble" :class="msg.isOwn ? 'bubble-own' : 'bubble-partner'">
                      <p class="mb-1">
                        {{ msg.message }}
                      </p>
                      <div class="small opacity-75" :class="msg.isOwn ? 'text-end text-white' : 'text-muted'">
                        {{ formatTime(msg.created_at) }}
                        <i v-if="msg.isOwn" class="bi bi-check2-all ms-1"
                          :class="msg.read ? 'text-info' : 'opacity-50'"></i>
                      </div>
                    </div>
                    <img v-if="msg.isOwn" :src="myAvatar" class="rounded-circle ms-2 flex-shrink-0" width="30"
                      height="30" style="object-fit: cover;" />
                  </div>
                </template>
              </div>
              <div class="bg-white border-top px-4 py-3">
                <div class="input-wrapper d-flex align-items-center gap-2">
                  <button class="btn btn-light rounded-circle">
                    <i class="bi bi-paperclip text-primary"></i>
                  </button>
                  <textarea ref="textareaRef" v-model="draft" rows="1"
                    class="form-control border-0 shadow-none bg-transparent" placeholder="វាយសាររបស់អ្នក..."
                    @keydown.enter.exact.prevent="sendMessage" @input="autoResize"></textarea>
                  <button class="btn rounded-circle send-btn" :class="draft.trim() ? 'btn-primary' : 'btn-light'"
                    :disabled="!draft.trim() || sending" @click="sendMessage">
                    <i class="bi bi-send-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-8 col-md-7" v-else>
            <div class="card border-0 shadow-sm text-center py-5 h-100">
              <div class="card-body d-flex flex-column justify-content-center">
                <div class="empty-chat-icon mx-auto mb-3">
                  <i class="bi bi-chat-dots"></i>
                </div>
                <p class="text-muted mb-0">
                  ជ្រើសរើសការសន្ទនា
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessageStore } from '@/stores/message'
import { useAuthStores } from '@/stores/auth'
import api from '@/api/http'

const router = useRouter()
const route = useRoute()
const msgStore = useMessageStore()
const auth = useAuthStores()
const searchQuery = ref('')
const activePartner = ref(null)
const draft = ref('')
const sending = ref(false)
const messagesContainer = ref(null)
const textareaRef = ref(null)
const myAvatar = computed(() =>
  auth.user?.avatar ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user?.full_name || 'Me')}&background=6366f1&color=fff`
)
const thread = computed(() => {
  if (!activePartner.value) return []
  return msgStore.threadWith(activePartner.value.id)
})
const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) {
    return msgStore.conversations
  }
  const q = searchQuery.value.toLowerCase()
  return msgStore.conversations.filter(c =>
    c.partner.full_name?.toLowerCase().includes(q) ||
    c.message?.toLowerCase().includes(q)
  )
})
const groupedThread = computed(() => {
  const groups = []
  let currentDate = null
  let currentGroup = null
  for (const msg of thread.value) {
    const d = new Date(msg.created_at)
    const label = formatDateLabel(d)
    if (label !== currentDate) {
      currentDate = label
      currentGroup = {
        date: label,
        messages: []
      }
      groups.push(currentGroup)
    }
    currentGroup.messages.push(msg)
  }
  return groups
})
function partnerAvatar(partner) {
  return (
    partner?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(partner?.full_name || 'U')}&background=6366f1&color=fff`
  )
}
function truncate(str, n) {
  if (!str) return ''
  return str.length > n
    ? str.slice(0, n) + '…'
    : str
}
function timeAgo(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ឥឡូវ'
  if (mins < 60) {
    return `${mins}នាទី`
  }
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )
  const yesterdayStart =
    new Date(todayStart - 86400000)
  if (date >= todayStart) {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  if (date >= yesterdayStart) {
    return 'ម្សិល'
  }
  return date.toLocaleDateString([], {
    day: 'numeric',
    month: 'short'
  })
}
function formatTime(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}
function formatDateLabel(date) {
  const now = new Date()
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )
  const yesterdayStart =
    new Date(todayStart - 86400000)
  if (date >= todayStart) {
    return 'ថ្ងៃនេះ'
  }
  if (date >= yesterdayStart) {
    return 'ម្សិល'
  }
  return date.toLocaleDateString([], {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}
function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height =
    Math.min(el.scrollHeight, 120) + 'px'
}
async function selectConversation(partner) {
  activePartner.value = partner
  await msgStore.fetchThread(partner.id)
  scrollToBottom()
}
async function sendMessage() {
  if (
    !draft.value.trim() ||
    !activePartner.value ||
    sending.value
  ) return
  sending.value = true
  const text = draft.value.trim()
  draft.value = ''
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  })
  try {
    await msgStore.sendMessage(
      activePartner.value.id,
      text
    )
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
      messagesContainer.value.scrollTop =
        messagesContainer.value.scrollHeight
    }
  })
}
function closePanel() {
  router.push('/')
}
onMounted(async () => {
  await msgStore.fetchAll()
  const toId = route.query.to
    ? Number(route.query.to)
    : null
  if (toId) {
    const existing =
      msgStore.conversations.find(
        c => c.partner.id === toId
      )
    if (existing) {
      selectConversation(existing.partner)
    } else {
      try {
        const res =
          await api.get(`/api/profile/users/${toId}`)
        if (res.data.result) {
          selectConversation(res.data.data)
        }
      } catch {
        if (msgStore.conversations.length > 0) {

          selectConversation(
            msgStore.conversations[0].partner
          )
        }
      }
    }
  } else if (msgStore.conversations.length > 0) {

    selectConversation(
      msgStore.conversations[0].partner
    )
  }
})
</script>
<style scoped>
.chat-app {
  min-height: 100vh;
  background: #f0f2f5;
}
.chat-window {
  border-radius: 20px;
  overflow: hidden;
}
.messages-area {
  overflow-y: auto;
  background: #f8fafc;
}
.conversation-item {
  border-radius: 14px;
  cursor: pointer;
  transition: .2s;
}
.conversation-item:hover {
  background: #f8f5ff;
}
.active-conv {
  background: #eef2ff;
  border-left: 4px solid #6366f1;
}
.online-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid white;
}
.message-bubble {
  max-width: 70%;
  padding: 10px 14px;
  word-wrap: break-word;
}
.bubble-own {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-radius: 18px 18px 4px 18px;
}
.bubble-partner {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 18px 18px 18px 4px;
}
.input-wrapper {
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
}
.send-btn {
  width: 42px;
  height: 42px;
}
.empty-chat-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #eef2ff;
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}
textarea {
  resize: none;
  max-height: 120px;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-thumb {
  background: #c4b5fd;
  border-radius: 999px;
}
@media (max-width: 768px) {
  .message-bubble {
    max-width: 85%;
  }
  .chat-window {
    height: calc(100vh - 90px) !important;
  }
}
</style>