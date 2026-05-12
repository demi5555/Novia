  <script setup lang="ts">
  import { ref, nextTick, onMounted , computed} from 'vue'
  import { usePostStore } from '@/stores/post'
  import { useRoute, useRouter } from 'vue-router'
  import { useCategoryStore } from '../stores/category'
  import BaseModal from '../components/BaseModal.vue'
  import {useAuthStores} from "@/stores/auth";

  const emit = defineEmits(['post-created'])
  const auth = useAuthStores()
  const route = useRoute()
  const router = useRouter()
  const postStore = usePostStore()
  const categoryStore = useCategoryStore()

  const showModal = ref(false)

  const openModal = () => {
    showModal.value = true
  }

  const getReturnPath = () => {
    const from = route.query.from
    if (typeof from === 'string' && from.trim()) return from
    return '/'
  }

  const closeModal = () => {
    showModal.value = false
    if (isEditing.value) {
      router.push(getReturnPath())
    }
  }

  const content = ref('')
  const image = ref<File | null>(null)
  const imagePreview = ref<string | null>(null)
  const loading = ref(false)
  const submitError = ref('')
  const submitSuccess = ref('')

  const emojis = ['😀','😂','😍','🔥','👍','❤️','🎉','😎']
  const showEmoji = ref(false)

  const textarea = ref<HTMLTextAreaElement | null>(null)

  const isEditing = ref(false)
  const editingPostId = ref<number | null>(null)

  const selectedCategories = ref<number[]>([])
  const userAvatar = computed(() => auth.user?.avatar || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff')

  const autoResize = async () => {
    await nextTick()
    if (!textarea.value) return
    textarea.value.style.height = 'auto'
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  }

  onMounted(async () => {
    await categoryStore.fetchCategory()
  })

  onMounted(async () => {
    const editId = route.query.edit as string
    if (editId) {
      isEditing.value = true
      editingPostId.value = parseInt(editId)

      // Open modal immediately so user sees the editor while data loads
      openModal()

      // Fetch post in background and populate fields when available
      postStore.fetchPostById(editingPostId.value)
        .then(() => {
          const post = postStore.post
          if (post) {
            content.value = post.text || ''
            imagePreview.value = post.image || null
            selectedCategories.value = Array.isArray(post.categories)
              ? post.categories.map((cat: any) => Number(cat.id)).filter(Boolean)
              : []
            autoResize()
          }
        })
        .catch((err) => {
          console.error('Failed to load post for editing:', err)
        })
    }
  })

  const addEmoji = (e: string) => {
    content.value += e
    autoResize()
  }

  const uploadImage = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    image.value = file
    imagePreview.value = URL.createObjectURL(file)
  }

  const toggleCategory = (id: number) => {
    if (selectedCategories.value.includes(id)) {
      selectedCategories.value = selectedCategories.value.filter(c => c !== id)
    } else {
      selectedCategories.value.push(id)
    }
  }

  const getCategoryIcon = (name: string) => {
    const map: Record<string, string> = {
      event: 'bi-calendar-event',
      internship: 'bi-briefcase',
      jobs: 'bi-briefcase-fill',
      project: 'bi-diagram-3',
      study: 'bi-book'
    }
    return map[name.toLowerCase()] || 'bi-tag'
  }

  const submitPost = async () => {
    if (!content.value && !image.value) return

    loading.value = true
    submitError.value = ''
    submitSuccess.value = ''

    try {
      const formData = new FormData()
      formData.append('text', content.value)
      formData.append('category_ids', JSON.stringify(selectedCategories.value))

      if (image.value) {
        formData.append('image', image.value)
      }

      if (isEditing.value && editingPostId.value) {
        await postStore.updatePost(editingPostId.value, formData)
        submitSuccess.value = 'Post updated successfully. Redirecting...'
      } else {
        await postStore.addPost(formData)
        submitSuccess.value = 'Post created successfully.'
      }

      content.value = ''
      image.value = null
      imagePreview.value = null
      selectedCategories.value = []
      showEmoji.value = false

      emit('post-created')
      if (isEditing.value) {
        setTimeout(() => {
          closeModal()
        }, 900)
      } else {
        closeModal()
      }

    } catch (error: any) {
      submitError.value =
        error?.response?.data?.message ||
        'Failed to update post. Please try again.'
    } finally {
      loading.value = false
    }
  }
  </script>

  <template>
    <div class="container my-5">

      <!-- OPEN POST BUTTON -->
      <div class="post-trigger-btn" @click="openModal">
        <img :src="userAvatar" alt="avatarSrc" class="avatar">
        <p>តើ​អ្នកចង់ចែករំលែកអ្វីដែលថ្មី?</p>
        <i class="bi bi-pencil-square ms-auto"></i>
      </div>

      <!-- MODAL -->
    <BaseModal
      v-if="showModal"
      @closeModal="closeModal"
    >

      <!-- HEADER -->
      <template #header>
        <div class="d-flex justify-content-between w-100">
          <h5>{{ isEditing ? 'Edit Post' : 'Create Post' }}</h5>
          <button class="btn-close" @click="closeModal"></button>
        </div>
      </template>

      <!-- BODY -->
      <template #body>

        <div class="card">

          <!-- TEXT -->
          <div class="composer-header">
            <img :src="userAvatar" alt="avatarSrc" class="avatar">


            <textarea
              ref="textarea"
              v-model="content"
              class="textarea"
              placeholder="What's on your mind?"
              @input="autoResize"
            />
          </div>

          <!-- IMAGE -->
          <img v-if="imagePreview" :src="imagePreview" class="preview" />

          <!-- CATEGORY -->
          <p class="text-muted mt-3">Select Categories:</p>

          <div class="category-box">
            <span
              v-for="cat in categoryStore.category"
              :key="cat.id"
              class="badge"
              :class="{ active: selectedCategories.includes(cat.id) }"
              @click="toggleCategory(cat.id)"
            >
              <i :class="getCategoryIcon(cat.name)"></i>
              {{ cat.name }}
            </span>
          </div>

          <!-- ACTIONS -->
          <div class="actions">

            <label class="btn">
              Attachment
              <input type="file" hidden @change="uploadImage" />
            </label>

            <button class="btn" @click="showEmoji = !showEmoji">
              😊 Emoji
            </button>

            <button
              class="post-btn"
              @click="submitPost"
              :disabled="loading || (!content && !image)"
            >
              {{ loading ? (isEditing ? 'Updating...' : 'Posting...') : (isEditing ? 'Update' : 'Post') }}
            </button>

          </div>

          <p v-if="submitSuccess" class="success-text mt-2">{{ submitSuccess }}</p>
          <p v-if="submitError" class="error-text mt-2">{{ submitError }}</p>

          <!-- EMOJI -->
          <div v-if="showEmoji" class="emoji-box">
            <span
              v-for="e in emojis"
              :key="e"
              class="emoji"
              @click="addEmoji(e)"
            >
              {{ e }}
            </span>
          </div>

        </div>

      </template>

      <!-- FOOTER -->
      <template #footer>
        <small class="text-muted">Share your thoughts with others</small>
      </template>

    </BaseModal>

    </div>
  </template>

  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500&display=swap');

  .post-trigger-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #ffffff;
    border: 0.5px solid rgba(83, 74, 183, 0.2);
    border-radius: 14px;
    padding: 10px 16px;
     cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 4px rgba(83, 74, 183, 0.08);
  }

  .post-trigger-btn:hover {
    border-color: rgba(83, 74, 183, 0.45);
    box-shadow: 0 2px 10px rgba(83, 74, 183, 0.12);
  }

  .post-trigger-btn p {
    flex: 1;
    margin: 0;
    font-size: 14px;
    color: #888780;
    font-family: 'Kantumruy Pro', sans-serif;
  }

  .post-trigger-btn .bi-pencil-square {
    color: #7F77DD;
    font-size: 16px;
  }

  .avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #EEEDFE;
  }

  .card {
    padding: 18px;
    border: none;
    background: transparent;
  }

  .composer-header {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 14px;
    padding-bottom: 14px;
    border-bottom: 0.5px solid rgba(83, 74, 183, 0.12);
  }

  .textarea {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    color: #2C2C2A;
    background: transparent;
    resize: none;
    min-height: 64px;
    font-family: 'Kantumruy Pro', sans-serif;
    line-height: 1.7;
  }

  .textarea::placeholder {
    color: #B4B2A9;
  }

  .preview {
    width: 100%;
    border-radius: 10px;
    border: 0.5px solid rgba(83, 74, 183, 0.15);
    margin-top: 10px;
  }

  .text-muted {
    font-size: 12px;
    color: #888780;
    margin-bottom: 8px !important;
    font-family: 'Kantumruy Pro', sans-serif;
  }

  .category-box {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 10px 0 14px;
  }

  .badge {
    padding: 5px 11px;
    border-radius: 20px;
    cursor: pointer;
    border: 0.5px solid rgba(0, 0, 0, 0.1);
    background: #F1EFE8;
    color: #5F5E5A;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: all 0.15s;
    font-weight: 400;
  }

  .badge:hover {
    border-color: #7F77DD;
    color: #3C3489;
    background: #EEEDFE;
  }

  .badge.active {
    background: #EEEDFE;
    border-color: #7F77DD;
    color: #3C3489;
    font-weight: 500;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    padding-top: 12px;
    border-top: 0.5px solid rgba(83, 74, 183, 0.1);
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 12px;
    border-radius: 8px;
    border: 0.5px solid rgba(0, 0, 0, 0.1);
    background: #F1EFE8;
    color: #5F5E5A;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }

  .btn:hover {
    background: #D3D1C7;
    border-color: rgba(0, 0, 0, 0.15);
  }

  .post-btn {
    margin-left: auto;
    background: #534AB7;
    color: #EEEDFE;
    padding: 8px 20px;
    border-radius: 8px;
    border: none;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    font-family: inherit;
    letter-spacing: 0.01em;
  }

  .post-btn:hover {
    background: #3C3489;
  }

  .post-btn:active {
    transform: scale(0.98);
  }

  .post-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  .emoji-box {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 0.5px solid rgba(83, 74, 183, 0.1);
  }

  .emoji {
    cursor: pointer;
    font-size: 18px;
    padding: 4px;
    border-radius: 6px;
    transition: background 0.15s;
  }

  .emoji:hover {
    background: #EEEDFE;
  }

  .error-text {
    color: #A32D2D;
    font-size: 12px;
  }

  .success-text {
    color: #3B6D11;
    font-size: 12px;
  }
  </style>