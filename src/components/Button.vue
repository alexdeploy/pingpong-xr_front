<script setup>
const props = defineProps({
  type: String,
  variant: String,
  disabled: Boolean
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
  emit('click', event);
};
</script>

<template>
  <button
    :type="type || 'button'"
    :class="['btn', `btn-${variant || 'primary'}`]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #C10016;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #a30012;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #091F2C;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #0c2837;
  transform: translateY(-1px);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}
</style>