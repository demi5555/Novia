<template>
  <Teleport to="body">
    <div class="crop-backdrop" @click.self="$emit('cancel')">
      <div class="crop-modal">
        <div class="crop-header">
          <h6 class="crop-title">
            {{ shape === 'circle' ? 'Crop Profile Photo' : 'Adjust Cover Photo' }}
          </h6>
          <button class="crop-close" @click="$emit('cancel')">
            <X :size="18" />
          </button>
        </div>

        <div class="crop-canvas-wrap">
          <canvas
            ref="canvasRef"
            :width="cw"
            :height="ch"
            class="crop-canvas"
            :class="{ grabbing: dragging }"
            @mousedown.prevent="startDrag"
            @mousemove="onDrag"
            @mouseup="stopDrag"
            @mouseleave="stopDrag"
            @wheel.prevent="onWheel"
            @touchstart.prevent="startTouch"
            @touchmove.prevent="onTouchMove"
            @touchend="stopDrag"
          />
        </div>

        <div class="crop-hint">Drag to reposition · Scroll to zoom</div>

        <div class="crop-zoom-row">
          <ZoomOut :size="14" class="zoom-icon" />
          <input
            type="range"
            class="zoom-range"
            v-model.number="scale"
            :min="minScale"
            :max="minScale * 3"
            :step="0.001"
            @input="onZoomSlider"
          />
          <ZoomIn :size="14" class="zoom-icon" />
        </div>

        <div class="crop-footer">
          <button class="btn-crop-cancel" @click="$emit('cancel')">Cancel</button>
          <button class="btn-crop-apply" :disabled="!ready" @click="applyCrop">
            <Check :size="14" /> Apply
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { X, ZoomOut, ZoomIn, Check } from 'lucide-vue-next'

const props = defineProps({
  src: { type: String, required: true },
  shape: { type: String, default: 'circle' }, // 'circle' | 'rect'
})
const emit = defineEmits(['crop', 'cancel'])

// Canvas dimensions based on shape
const cw = props.shape === 'circle' ? 380 : 580
const ch = props.shape === 'circle' ? 380 : 240

// Clip zone dimensions
const clipX = cw / 2
const clipY = ch / 2
const clipR = props.shape === 'circle' ? cw * 0.41 : null
const clipW = props.shape === 'rect' ? cw * 0.9 : null
const clipH = props.shape === 'rect' ? ch * 0.82 : null

const canvasRef = ref(null)
const scale = ref(1)
const minScale = ref(0.1)
const offsetX = ref(0)
const offsetY = ref(0)
const dragging = ref(false)
const ready = ref(false)

let ctx = null
let img = null
let dragStartX = 0
let dragStartY = 0
let dragStartOffX = 0
let dragStartOffY = 0
let lastTouchX = 0
let lastTouchY = 0

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }

function constrainOffset() {
  if (!img) return
  const sw = img.naturalWidth * scale.value
  const sh = img.naturalHeight * scale.value
  if (props.shape === 'circle') {
    const maxX = sw / 2 - clipR
    const maxY = sh / 2 - clipR
    offsetX.value = clamp(offsetX.value, -maxX, maxX)
    offsetY.value = clamp(offsetY.value, -maxY, maxY)
  } else {
    const maxX = Math.max(0, sw / 2 - clipW / 2)
    const maxY = Math.max(0, sh / 2 - clipH / 2)
    offsetX.value = clamp(offsetX.value, -maxX, maxX)
    offsetY.value = clamp(offsetY.value, -maxY, maxY)
  }
}

function drawCanvas() {
  if (!ctx || !img) return
  ctx.clearRect(0, 0, cw, ch)

  const sw = img.naturalWidth * scale.value
  const sh = img.naturalHeight * scale.value
  const ix = clipX + offsetX.value - sw / 2
  const iy = clipY + offsetY.value - sh / 2

  ctx.drawImage(img, ix, iy, sw, sh)

  // Dark overlay with hole
  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, cw, ch)
  if (props.shape === 'circle') {
    ctx.arc(clipX, clipY, clipR, 0, Math.PI * 2, true)
  } else {
    const rx = clipX - clipW / 2
    const ry = clipY - clipH / 2
    ctx.moveTo(rx + clipW, ry)
    ctx.lineTo(rx, ry)
    ctx.lineTo(rx, ry + clipH)
    ctx.lineTo(rx + clipW, ry + clipH)
    ctx.closePath()
  }
  ctx.fillStyle = 'rgba(0,0,0,0.52)'
  ctx.fill('evenodd')
  ctx.restore()

  // Border ring
  ctx.strokeStyle = 'rgba(255,255,255,0.88)'
  ctx.lineWidth = 2
  ctx.beginPath()
  if (props.shape === 'circle') {
    ctx.arc(clipX, clipY, clipR, 0, Math.PI * 2)
  } else {
    const rx = clipX - clipW / 2
    const ry = clipY - clipH / 2
    ctx.rect(rx, ry, clipW, clipH)
  }
  ctx.stroke()
}

function startDrag(e) {
  dragging.value = true
  dragStartX = e.clientX
  dragStartY = e.clientY
  dragStartOffX = offsetX.value
  dragStartOffY = offsetY.value
}

function onDrag(e) {
  if (!dragging.value) return
  offsetX.value = dragStartOffX + (e.clientX - dragStartX)
  offsetY.value = dragStartOffY + (e.clientY - dragStartY)
  constrainOffset()
  drawCanvas()
}

function stopDrag() { dragging.value = false }

function onWheel(e) {
  const delta = e.deltaY > 0 ? -0.04 : 0.04
  scale.value = clamp(scale.value + delta * scale.value, minScale.value, minScale.value * 3)
  constrainOffset()
  drawCanvas()
}

function onZoomSlider() {
  constrainOffset()
  drawCanvas()
}

function startTouch(e) {
  if (e.touches.length === 1) {
    dragging.value = true
    lastTouchX = e.touches[0].clientX
    lastTouchY = e.touches[0].clientY
    dragStartOffX = offsetX.value
    dragStartOffY = offsetY.value
  }
}

function onTouchMove(e) {
  if (e.touches.length !== 1 || !dragging.value) return
  const dx = e.touches[0].clientX - lastTouchX
  const dy = e.touches[0].clientY - lastTouchY
  offsetX.value += dx
  offsetY.value += dy
  lastTouchX = e.touches[0].clientX
  lastTouchY = e.touches[0].clientY
  constrainOffset()
  drawCanvas()
}

function applyCrop() {
  if (!img) return
  const outW = props.shape === 'circle' ? 300 : 1200
  const outH = props.shape === 'circle' ? 300 : Math.round(1200 * (clipH / clipW))

  const outCanvas = document.createElement('canvas')
  outCanvas.width = outW
  outCanvas.height = outH
  const octx = outCanvas.getContext('2d')

  const sw = img.naturalWidth * scale.value
  const sh = img.naturalHeight * scale.value
  const ix = clipX + offsetX.value - sw / 2
  const iy = clipY + offsetY.value - sh / 2

  const clipLeft = props.shape === 'circle' ? clipX - clipR : clipX - clipW / 2
  const clipTop  = props.shape === 'circle' ? clipY - clipR : clipY - clipH / 2
  const clipSW   = props.shape === 'circle' ? clipR * 2 : clipW
  const clipSH   = props.shape === 'circle' ? clipR * 2 : clipH

  const srcX = (clipLeft - ix) / scale.value
  const srcY = (clipTop - iy) / scale.value
  const srcW = clipSW / scale.value
  const srcH = clipSH / scale.value

  if (props.shape === 'circle') {
    octx.beginPath()
    octx.arc(outW / 2, outH / 2, outW / 2, 0, Math.PI * 2)
    octx.clip()
  }
  octx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH)

  outCanvas.toBlob(blob => {
    if (blob) emit('crop', blob)
  }, 'image/jpeg', 0.92)
}

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  img = new Image()
  img.onload = () => {
    if (props.shape === 'circle') {
      minScale.value = Math.max((clipR * 2) / img.naturalWidth, (clipR * 2) / img.naturalHeight)
    } else {
      minScale.value = Math.max(clipW / img.naturalWidth, clipH / img.naturalHeight)
    }
    scale.value = minScale.value
    ready.value = true
    drawCanvas()
  }
  img.src = props.src
})
</script>

<style scoped>
.crop-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(6px);
}

.crop-modal {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
  max-width: 95vw;
  width: fit-content;
  animation: popIn .22s cubic-bezier(.22,1,.36,1);
}

@keyframes popIn {
  from { transform: scale(.92); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

.crop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 14px;
  border-bottom: 1px solid #f0f0f0;
}

.crop-title {
  font-size: .92rem;
  font-weight: 700;
  color: #111;
  margin: 0;
}

.crop-close {
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  transition: background .15s;
}
.crop-close:hover { background: #ffe4e4; color: #dc2626; }

.crop-canvas-wrap {
  display: flex;
  justify-content: center;
  background: #1a1a1a;
  overflow: hidden;
}

.crop-canvas {
  display: block;
  max-width: 100%;
  cursor: grab;
}
.crop-canvas.grabbing { cursor: grabbing; }

.crop-hint {
  font-size: .7rem;
  color: #9ca3af;
  text-align: center;
  padding: 8px 0 2px;
  background: #1a1a1a;
}

.crop-zoom-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px 10px;
  background: #1a1a1a;
}

.zoom-icon { color: #9ca3af; flex-shrink: 0; }

.zoom-range {
  flex: 1;
  height: 4px;
  accent-color: #ffffff;
  cursor: pointer;
}

.crop-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.btn-crop-cancel {
  background: #f5f5f5;
  border: none;
  border-radius: 9px;
  padding: 8px 18px;
  font-size: .84rem;
  font-weight: 600;
  cursor: pointer;
  color: #555;
  font-family: inherit;
  transition: background .15s;
}
.btn-crop-cancel:hover { background: #e5e7eb; }

.btn-crop-apply {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 8px 20px;
  font-size: .84rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background .15s;
}
.btn-crop-apply:hover:not(:disabled) { background: #374151; }
.btn-crop-apply:disabled { opacity: .4; cursor: not-allowed; }
</style>
