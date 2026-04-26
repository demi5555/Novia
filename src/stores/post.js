import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/http'

export const usePostStore = defineStore('post', () => {

  // ── State ──────────────────────────────────────────────
  const posts       = ref([])   // GET /api/posts  → res.data.data[]
  const post        = ref(null) // GET /api/posts/:id → res.data.data
  const ownPosts    = ref([])   // reserved for profile "All Post" tab
  const searchQuery = ref('')   // current search term — watched by HomeView for scroll-to-top
  const searchUsers = ref([])   // users matching the current search — shown in HomeView feed

  // ── Pagination ─────────────────────────────────────────
  // Shape from API response:
  // paginate: { has_page, on_first_page, has_more_pages,
  //             first_item, last_item, total, current_page, last_page }
  const pagination = reactive({
    has_page:       false,
    on_first_page:  true,
    has_more_pages: false,
    first_item:     1,
    last_item:      0,
    total:          0,
    current_page:   1,
    last_page:      1,
  })

  // ── GET /api/posts ─────────────────────────────────────
  // params: { search?, page?, per_page?, category? }
  //
  // Response:
  // {
  //   result: true, code: 1, message: "Get all posts successfully.",
  //   data: [                          ← array lives here, NOT at res.data
  //     { id, text, image, attachments, created_at, creator, categories }
  //   ],
  //   paginate: { has_page, on_first_page, has_more_pages,
  //               first_item, last_item, total, current_page, last_page }
  // }
  async function fetchPosts(search = '', page = 1, perPage = 20, category = 0) {
    try {
      const res = await api.get('/api/posts', {
        params: {
          search,
          page,
          per_page: perPage,
          category,
        },
      })

      // ✅ FIXED: was res.data (the full response object)
      //          must be res.data.data (the actual posts array)
      posts.value = res.data.data ?? []

      // ✅ FIXED: was also reading from res.data.paginate directly on a broken root
      const p = res.data.paginate ?? {}
      pagination.has_page       = p.has_page       ?? false
      pagination.on_first_page  = p.on_first_page  ?? true
      pagination.has_more_pages = p.has_more_pages ?? false
      pagination.first_item     = p.first_item     ?? 1
      pagination.last_item      = p.last_item      ?? 0
      pagination.total          = p.total          ?? 0
      pagination.current_page   = p.current_page   ?? 1
      pagination.last_page      = p.last_page      ?? 1

    } catch (error) {
      console.error('Failed to fetch posts:', error)
      throw error
    }
  }

  // ── GET /api/posts (with append for pagination) ─────────────────────────────────
  async function fetchPostsAppend(search = '', page = 1, perPage = 20, category = 0) {
    try {
      const res = await api.get('/api/posts', {
        params: {
          search,
          page,
          per_page: perPage,
          category,
        },
      })

      // APPEND posts instead of replacing for pagination
      if (page > 1) {
        posts.value = [...posts.value, ...(res.data.data ?? [])]
      } else {
        posts.value = res.data.data ?? []
      }

      // ✅ FIXED: was res.data (the full response object)
      //          must be res.data.data (the actual posts array)
      const p = res.data.paginate ?? {}
      pagination.has_page       = p.has_page       ?? false
      pagination.on_first_page  = p.on_first_page  ?? true
      pagination.has_more_pages = p.has_more_pages ?? false
      pagination.first_item     = p.first_item     ?? 1
      pagination.last_item      = p.last_item      ?? 0
      pagination.total          = p.total          ?? 0
      pagination.current_page   = p.current_page   ?? 1
      pagination.last_page      = p.last_page      ?? 1

    } catch (error) {
      console.error('Failed to fetch posts:', error)
      throw error
    }
  }

  // ── POST /api/posts ────────────────────────────────────
  // payload: FormData { text, image?, attachments?, categories[]? }
  //
  // Response:
  // { result: true, code: 1, message: "Add new post successfully.",
  //   data: { id, text, image, attachments, created_at, creator, categories } }
  async function addPost(payload) {
    try {
      const res = await api.post('/api/posts', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data.result) {
        // Prepend new post to the top of the feed
        posts.value.unshift(res.data.data)
        pagination.total = (pagination.total ?? 0) + 1
      }
      return res
    } catch (error) {
      console.error('Failed to add post:', error)
      throw error
    }
  }

  // ── GET /api/posts/:id ─────────────────────────────────
  // Response: { result, code, message,
  //   data: { id, text, image, attachments, created_at, creator, categories } }
  async function fetchPostById(id) {
    try {
      const res = await api.get(`/api/posts/${id}`)
      if (res.data.result) {
        post.value = res.data.data
      }
      return res
    } catch (error) {
      console.error('Failed to fetch post:', error)
      throw error
    }
  }

  // ── GET /api/user/posts ─────────────────────────────
  // Fetch user's own posts with pagination
  // params: { page?, per_page? }
  //
  // Response:
  // {
  //   result: true, code: 1, message: "Get user posts successfully.",
  //   data: [                          ← array lives here
  //     { id, text, image, attachments, created_at, creator, categories }
  //   ],
  //   paginate: { has_page, on_first_page, has_more_pages,
  //               first_item, last_item, total, current_page, last_page }
  // }
  async function fetchOwnPosts(page = 1, perPage = 20) {
    try {
      const res = await api.get('/api/user/posts', {
        params: {
          page,
          per_page: perPage,
        },
      })

      // ✅ FIXED: was res.data (the full response object)
      //          must be res.data.data (the actual posts array)
      ownPosts.value = res.data.data ?? []

      // ✅ FIXED: was also reading from res.data.paginate directly on a broken root
      const p = res.data.paginate ?? {}
      pagination.has_page       = p.has_page       ?? false
      pagination.on_first_page  = p.on_first_page  ?? true
      pagination.has_more_pages = p.has_more_pages ?? false
      pagination.first_item     = p.first_item     ?? 1
      pagination.last_item      = p.last_item      ?? 0
      pagination.total          = p.total          ?? 0
      pagination.current_page   = p.current_page   ?? 1
      pagination.last_page      = p.last_page      ?? 1

    } catch (error) {
      console.error('Failed to fetch own posts:', error)
      throw error
    }
  }

  // ── GET /api/user/posts (with append for pagination) ─────────────────
  async function fetchOwnPostsAppend(page = 1, perPage = 20) {
    try {
      const res = await api.get('/api/user/posts', {
        params: {
          page,
          per_page: perPage,
        },
      })

      // APPEND posts instead of replacing for pagination
      if (page > 1) {
        ownPosts.value = [...ownPosts.value, ...(res.data.data ?? [])]
      } else {
        ownPosts.value = res.data.data ?? []
      }

      // ✅ FIXED: was res.data (the full response object)
      //          must be res.data.data (the actual posts array)
      const p = res.data.paginate ?? {}
      pagination.has_page       = p.has_page       ?? false
      pagination.on_first_page  = p.on_first_page  ?? true
      pagination.has_more_pages = p.has_more_pages ?? false
      pagination.first_item     = p.first_item     ?? 1
      pagination.last_item      = p.last_item      ?? 0
      pagination.total          = p.total          ?? 0
      pagination.current_page   = p.current_page   ?? 1
      pagination.last_page      = p.last_page      ?? 1

    } catch (error) {
      console.error('Failed to fetch own posts:', error)
      throw error
    }
  }

  // ── GET /api/user/posts/:id ────────────────────────────
  // Fetch a specific post that belongs to the current user
  // Response: { result, code, message,
  //   data: { id, text, image, attachments, created_at, creator, categories } }
  async function fetchOwnPostById(id) {
    try {
      const res = await api.get(`/api/user/posts/${id}`)
      if (res.data.result) {
        post.value = res.data.data
      }
      return res
    } catch (error) {
      console.error('Failed to fetch own post:', error)
      throw error
    }
  }

  // ── UPDATE /api/posts/:id ───────────────────────────────
  // payload: FormData { text, image?, attachments?, categories[]? }
  //
  // Response:
  // { result: true, code: 1, message: "Update post successfully.",
  //   data: { id, text, image, attachments, created_at, creator, categories } }
  async function updatePost(id, payload) {
    try {
      const res = await api.post(`/api/posts/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data.result) {
        // Update the post in the array
        const index = posts.value.findIndex(p => p.id === id)
        if (index !== -1) {
          posts.value[index] = res.data.data
        }
        const ownIndex = ownPosts.value.findIndex(p => p.id === id)
        if (ownIndex !== -1) {
          ownPosts.value[ownIndex] = res.data.data
        }
        if (post.value?.id === id) {
          post.value = res.data.data
        }
      }
      return res
    } catch (error) {
      console.error('Failed to update post:', error)
      throw error
    }
  }

  // ── DELETE /api/posts/:id ──────────────────────────────
  // Response: { result: true, code: 1, message: "...", data: null }
  async function deletePost(id) {
    try {
      const res = await api.delete(`/api/posts/${id}`)
      if (res.data.result) {
        posts.value    = posts.value.filter(p => p.id !== id)
        ownPosts.value = ownPosts.value.filter(p => p.id !== id)
        pagination.total = Math.max(0, (pagination.total ?? 1) - 1)
        if (post.value?.id === id) post.value = null
      }
      return res
    } catch (error) {
      console.error('Failed to delete post:', error)
      throw error
    }
  }

  // ── Helpers ────────────────────────────────────────────
  function clearPost()  { post.value  = null }
  function clearPosts() {
    posts.value = []
    Object.assign(pagination, {
      has_page: false, on_first_page: true, has_more_pages: false,
      first_item: 1, last_item: 0, total: 0, current_page: 1, last_page: 1,
    })
  }

  return {
    // state
    posts,
    post,
    ownPosts,
    pagination,
    searchQuery,
    searchUsers,
    // actions
    fetchPosts,
    fetchPostsAppend,
    fetchOwnPosts,
    fetchOwnPostsAppend,
    addPost,
    updatePost,
    fetchPostById,
    fetchOwnPostById,
    deletePost,
    clearPost,
    clearPosts,
  }
})