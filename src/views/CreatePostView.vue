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

    await postStore.fetchPostById(editingPostId.value)

    const post = postStore.post
    if (post) {
      content.value = post.text || ''
      imagePreview.value = post.image || null
      selectedCategories.value = Array.isArray(post.categories)
        ? post.categories.map((cat: any) => Number(cat.id)).filter(Boolean)
        : []
      autoResize()
      openModal()
    }
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
      <p>What is on your mind?</p>
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
          <h5>Create Post</h5>
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
.post-trigger-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  color: black;
  padding: 5px 10px;
  border-radius: 10px;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.card {
  padding: 16px;
}

.composer-header {
  display: flex;
  gap: 10px;
}

.textarea {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  resize: none;
}

.preview {
  width: 100%;
  border-radius: 10px;
  margin-top: 10px;
}

.category-box {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
}

.badge {
  padding: 6px 10px;
  border-radius: 20px;
  cursor: pointer;
  border: 1px solid #ddd;
  background: #f3f3f3;
  display: flex;
  gap: 5px;
  align-items: center;
}

.badge.active {
  background: #111;
  color: #fff;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.btn {
  border: none;
  background: #f3f4f6;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.post-btn {
  background: #111;
  color: #fff;
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
}

.emoji-box {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.emoji {
  cursor: pointer;
  font-size: 18px;
}

.error-text {
  color: #dc2626;
  font-size: 0.9rem;
}

.success-text {
  color: #16a34a;
  font-size: 0.9rem;
}
</style>