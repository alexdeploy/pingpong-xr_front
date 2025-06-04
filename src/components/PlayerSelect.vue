<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: String,
  players: Array,
  label: String,
  otherSelectedId: String,
  disabled: Boolean
});

const emit = defineEmits(['update:modelValue']);

const filteredPlayers = computed(() => {
  if (!props.otherSelectedId) return props.players;
  return props.players.filter(player => player._id !== props.otherSelectedId);
});

const updateValue = (event) => {
  const target = event.target;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="player-select">
    <label :for="label">{{ label }}</label>
    <select
      :id="label"
      :value="modelValue"
      @change="updateValue"
      :disabled="disabled"
    >
      <option value="" disabled selected>Select a player</option>
      <option
        v-for="player in filteredPlayers"
        :key="player._id"
        :value="player._id"
      >
        {{ player.name }} (Rating: {{ player.rating }})
      </option>
    </select>
  </div>
</template>

<style scoped>
.player-select {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #091F2C;
}

select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #A6BBC8;
  border-radius: 8px;
  background-color: white;
  font-size: 1rem;
  color: #091F2C;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

select:focus {
  outline: none;
  border-color: #091F2C;
  box-shadow: 0 0 0 3px rgba(9, 31, 44, 0.1);
}

select:disabled {
  background-color: #f8fafc;
  cursor: not-allowed;
}
</style>