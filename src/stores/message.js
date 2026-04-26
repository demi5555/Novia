import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/http'

export const useMessageStore = defineStore('message', () => {
  const sent     = ref([])
  const received = ref([])
  const loading  = ref(false)

  // All messages merged, deduplicated by partner
  const conversations = computed(() => {
    const map = new Map()

    received.value.forEach(m => {
      const partner = m.sender
      if (!partner) return
      const existing = map.get(partner.id)
      const ts = new Date(m.created_at).getTime()
      if (!existing || ts > existing._ts) {
        map.set(partner.id, { ...m, _ts: ts, isOwn: false, partner })
      }
    })

    sent.value.forEach(m => {
      const partner = m.receiver
      if (!partner) return
      const existing = map.get(partner.id)
      const ts = new Date(m.created_at).getTime()
      if (!existing || ts > existing._ts) {
        map.set(partner.id, { ...m, _ts: ts, isOwn: true, partner })
      }
    })

    return Array.from(map.values()).sort((a, b) => b._ts - a._ts)
  })

  // Messages for a specific partner (both directions)
  function threadWith(partnerId) {
    const mine = sent.value
      .filter(m => m.receiver?.id === partnerId)
      .map(m => ({ ...m, isOwn: true }))
    const theirs = received.value
      .filter(m => m.sender?.id === partnerId)
      .map(m => ({ ...m, isOwn: false }))
    return [...mine, ...theirs].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    )
  }

  async function fetchAll() {
    loading.value = true
    try {
      const [s, r] = await Promise.all([
        api.get('/api/profile/sent-messages'),
        api.get('/api/profile/received-messages'),
      ])
      if (s.data.result) sent.value     = s.data.data ?? []
      if (r.data.result) received.value = r.data.data ?? []
    } catch (e) {
      console.error('Failed to fetch messages', e)
    } finally {
      loading.value = false
    }
  }

  async function sendMessage(receiverId, message) {
    const form = new FormData()
    form.append('receiver_id', receiverId)
    form.append('message', message)
    const res = await api.post('/api/messages', form)
    if (res.data.result) {
      // Optimistically push to sent
      sent.value = [res.data.data ?? {
        id: Date.now(),
        receiver_id: receiverId,
        message,
        created_at: new Date().toISOString(),
        receiver: null,
        sender: null,
      }, ...sent.value]
    }
    return res
  }

  return { sent, received, loading, conversations, threadWith, fetchAll, sendMessage }
})
