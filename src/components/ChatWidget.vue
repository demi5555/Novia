<template>
  <div class="chat-widget">

    <!-- Widget Header -->
    <div class="cw-header" @click="widgetOpen = !widgetOpen">
      <div class="cw-header-left">
        <MessageCircle :size="15" />
        <span>Chat</span>
        <span class="cw-unread-dot" v-if="unreadCount > 0">{{ unreadCount }}</span>
      </div>
      <ChevronUp :size="14" :class="['cw-chevron', { rotated: !widgetOpen }]" />
    </div>

    <!-- Collapsed: just the header -->
    <Transition name="widget-slide">
      <div v-if="widgetOpen" class="cw-body">

        <!-- Loading -->
        <div v-if="msgStore.loading" class="cw-loading">
          <Loader2 :size="16" class="spin" /> Loading…
        </div>

        <!-- Conversation list -->
        <template v-else>
          <div
            v-if="msgStore.conversations.length === 0"
            class="cw-empty"
          >
            <MessageCircle :size="22" />
            <p>No conversations yet</p>
          </div>

          <div v-else class="cw-conv-list">
            <button
              v-for="conv in msgStore.conversations"
              :key="conv.partner.id"
              class="cw-conv-item"
              :class="{ active: activePartner?.id === conv.partner.id }"
              @click.stop="openChat(conv.partner)"
            >
              <div class="cw-av-wrap">
                <img
                  :src="conv.partner.avatar || defaultAvatar(conv.partner.full_name)"
                  class="cw-av"
                  :alt="conv.partner.full_name"
                />
              </div>
              <div class="cw-conv-info">
                <p class="cw-conv-name">{{ conv.partner.full_name }}</p>
                <p class="cw-conv-last">
                  <span v-if="conv.isOwn" class="cw-you">You: </span>
                  {{ truncate(conv.message, 28) }}
                </p>
              </div>
              <span class="cw-time">{{ timeAgo(conv.created_at) }}</span>
            </button>
          </div>

        </template>

      </div>
    </Transition>

    <!-- Mini Chat Window (Teleported to body so it never overlaps other content) -->
    <Teleport to="body">
    <Transition name="chat-pop">
      <div v-if="activePartner" class="cw-chat-window" @click.stop>
        <!-- Chat header -->
        <div class="cwc-header">
          <img
            :src="activePartner.avatar || defaultAvatar(activePartner.full_name)"
            class="cwc-av"
          />
          <div class="cwc-info">
            <p class="cwc-name">{{ activePartner.full_name }}</p>
            <router-link :to="`/profile/${activePartner.id}`" class="cwc-profile-link">
              View profile
            </router-link>
          </div>
          <button class="cwc-close" @click="activePartner = null"><X :size="14" /></button>
        </div>

        <!-- Messages -->
        <div class="cwc-messages" ref="msgScrollRef">
          <div
            v-for="msg in thread"
            :key="msg.id"
            class="cwc-msg"
            :class="{ own: msg.isOwn }"
          >
            <div class="cwc-bubble" :class="{ 'own-bubble': msg.isOwn }">
              {{ msg.message }}
            </div>
            <span class="cwc-ts">{{ formatTime(msg.created_at) }}</span>
          </div>

          <div v-if="thread.length === 0" class="cwc-no-msg">
            Say hello to {{ activePartner.full_name }}!
          </div>
        </div>

        <!-- Input -->
        <div class="cwc-input-row">
          <textarea
            v-model="draft"
            class="cwc-input"
            placeholder="Write a message…"
            rows="1"
            @keydown.enter.exact.prevent="submit"
          />
          <button class="cwc-send" :disabled="!draft.trim() || sending" @click="submit">
            <Loader2 v-if="sending" :size="14" class="spin" />
            <Send v-else :size="14" />
          </button>
        </div>
      </div>
    </Transition>
    </Teleport>


  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { MessageCircle, ChevronUp, X, Send, Loader2 } from 'lucide-vue-next'
import { useMessageStore } from '@/stores/message'

const msgStore    = ref(useMessageStore())
const widgetOpen  = ref(true)
const activePartner = ref(null)
const draft       = ref('')
const sending     = ref(false)
const msgScrollRef = ref(null)


const unreadCount = computed(() => msgStore.value.received.length)

const thread = computed(() => {
  if (!activePartner.value) return []
  return msgStore.value.threadWith(activePartner.value.id)
})

function defaultAvatar(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=6366f1&color=fff&size=64`
}

function truncate(str, n) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '…' : str
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function openChat(partner) {
  activePartner.value = partner
  scrollToBottom()
}

async function submit() {
  if (!draft.value.trim() || !activePartner.value) return
  sending.value = true
  try {
    await msgStore.value.sendMessage(activePartner.value.id, draft.value.trim())
    draft.value = ''
    // Refresh messages to get receiver data populated
    await msgStore.value.fetchAll()
    scrollToBottom()
  } catch (e) {
    console.error(e)
  } finally {
    sending.value = false
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (msgScrollRef.value) {
      msgScrollRef.value.scrollTop = msgScrollRef.value.scrollHeight
    }
  })
}

watch(thread, () => { scrollToBottom() })


onMounted(() => {
  msgStore.value.fetchAll()
})
</script>

<style scoped>
.chat-widget {
  position: relative;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  overflow: visible;
  margin-bottom: 0;
}

/* ── Header ───────────────────────────── */
.cw-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  cursor: pointer;
  user-select: none;
}

.cw-header-left {
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 700;
  font-size: .88rem;
  color: #1e293b;
}

.cw-unread-dot {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
  font-size: .68rem;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cw-chevron {
  color: #94a3b8;
  transition: transform .2s;
}
.cw-chevron.rotated { transform: rotate(180deg); }

/* ── Body ─────────────────────────────── */
.cw-body {
  border-top: 1px solid #f1f5f9;
  overflow: hidden;
}

.cw-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px;
  font-size: .82rem;
  color: #94a3b8;
}

.cw-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 10px;
  color: #94a3b8;
  text-align: center;
}
.cw-empty p { font-size: .8rem; margin: 0; }

/* ── Conversation list ────────────────── */
.cw-conv-list {
  max-height: 220px;
  overflow-y: auto;
}

.cw-conv-item {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 9px 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: background .15s;
}
.cw-conv-item:hover { background: #f8fafc; }
.cw-conv-item.active { background: #eff6ff; }

.cw-av-wrap { flex-shrink: 0; }
.cw-av {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
}

.cw-conv-info { flex: 1; min-width: 0; }
.cw-conv-name {
  font-size: .8rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cw-conv-last {
  font-size: .72rem;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cw-you { color: #94a3b8; }
.cw-time {
  font-size: .68rem;
  color: #94a3b8;
  flex-shrink: 0;
}


/* ── Mini Chat Window ─────────────────── */
.cw-chat-window {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 320px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.18);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  z-index: 1200;
  display: flex;
  flex-direction: column;
}

.cwc-header {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}

.cwc-av {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.cwc-info { flex: 1; min-width: 0; }
.cwc-name { font-size: .84rem; font-weight: 700; color: #1e293b; margin: 0; }
.cwc-profile-link {
  font-size: .7rem;
  color: #6366f1;
  text-decoration: none;
}
.cwc-profile-link:hover { text-decoration: underline; }

.cwc-close {
  background: #f1f5f9;
  border: none;
  border-radius: 6px;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  flex-shrink: 0;
}
.cwc-close:hover { background: #fee2e2; color: #dc2626; }

.cwc-messages {
  height: 200px;
  overflow-y: auto;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #f8fafc;
}

.cwc-msg {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.cwc-msg.own { align-items: flex-end; }

.cwc-bubble {
  max-width: 80%;
  padding: 7px 11px;
  border-radius: 14px;
  font-size: .82rem;
  line-height: 1.4;
  background: #fff;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
  word-break: break-word;
}
.cwc-bubble.own-bubble {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border: none;
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 4px;
}

.cwc-ts {
  font-size: .64rem;
  color: #94a3b8;
  margin-top: 2px;
  padding: 0 4px;
}

.cwc-no-msg {
  text-align: center;
  font-size: .8rem;
  color: #94a3b8;
  padding: 20px 0;
  margin: auto;
}

.cwc-input-row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  padding: 8px 10px;
  border-top: 1px solid #e2e8f0;
  background: #fff;
}

.cwc-input {
  flex: 1;
  border: 1.5px solid #e2e8f0;
  border-radius: 18px;
  padding: 6px 12px;
  font-size: .82rem;
  resize: none;
  background: #f8fafc;
  font-family: inherit;
  outline: none;
  line-height: 1.4;
  max-height: 80px;
  overflow-y: auto;
}
.cwc-input:focus { border-color: #6366f1; background: #fff; }

.cwc-send {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity .15s;
}
.cwc-send:disabled { opacity: .4; cursor: not-allowed; }


/* ── Transitions ──────────────────────── */
.widget-slide-enter-active, .widget-slide-leave-active { transition: max-height .25s ease, opacity .2s; overflow: hidden; }
.widget-slide-enter-from, .widget-slide-leave-to { max-height: 0 !important; opacity: 0; }
.widget-slide-enter-to { max-height: 400px; }

.chat-pop-enter-active, .chat-pop-leave-active { transition: opacity .2s, transform .2s; }
.chat-pop-enter-from, .chat-pop-leave-to { opacity: 0; transform: translateY(10px); }

.spin { animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
