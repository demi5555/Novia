<template>
  <div>
    <div class="position-relative text-secondary mb-2">
      <input
        v-bind="$attrs"
        :type="inputType"
        class="form-control bg-white ps-7 py-2"
        :placeholder="inputPlaceholder"
        v-model="model"
        :disabled="isDisabled"
      />
      <component
        :is="inputIcon"
        size="20"
        class="position-absolute icon-input tran-y"
      />
    </div>
  </div>
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
});

const model = defineModel();
defineProps({
  inputType: {
    type: String,
    default: "text",
  },
  inputPlaceholder: {
    type: String,
    default: "",
  },
  inputIcon: {
    type: String,
    required: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.tran-y {
  transform: translateY(-50%);
}
.icon-input {
  position: absolute;
  top: 50%;
  left: 18px;
  font-size: 18px;
}
</style>
