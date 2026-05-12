<template>
  <div
    class="modal-backdrop"
    :style="{
      background: fullscreen ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.4)'
    }"
    @click.self="emit('closeModal')"
  >

    <div
      class="modal d-block"
      tabindex="-1"
      aria-hidden="true"
    >
      <div
        class="modal-dialog"
        :class="fullscreen ? 'modal-fullscreen' : 'modal-dialog-centered'"
      >

        <div
          class="modal-content px-2"
          :class="{ 'bg-black text-white border-0': fullscreen }"
        >

          <!-- HEADER -->
          <div class="modal-header border-0">
            <slot name="header" />
          </div>

          <!-- BODY -->
          <div class="modal-body">
            <slot name="body" />
          </div>

          <!-- FOOTER -->
          <div class="modal-footer border-0 d-flex" :class="position">
            <slot name="footer" />
          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  position: {
    type: String,
    default: ''
  },
  fullscreen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'closeModal'): void
}>()
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>