<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchPlayers, createMatch } from '../services/api'

const emit = defineEmits(['close', 'match-added'])

const players = ref([])
const loading = ref(true)
const error = ref(null)
const submitting = ref(false)

const form = ref({
  player1: '',
  player2: '',
  score1: 0,
  score2: 0
})

const formErrors = ref({
  player1: '',
  player2: '',
  score1: '',
  score2: '',
  general: ''
})

const isFormValid = computed(() => {
  // Check if players are selected and different
  if (!form.value.player1 || !form.value.player2) return false
  if (form.value.player1 === form.value.player2) return false
  
  // Check if scores are valid numbers
  if (isNaN(form.value.score1) || form.value.score1 < 0) return false
  if (isNaN(form.value.score2) || form.value.score2 < 0) return false
  
  // Check if at least one player has a non-zero score
  if (form.value.score1 === 0 && form.value.score2 === 0) return false
  
  // Check if scores are different (we need a winner)
  if (form.value.score1 === form.value.score2) return false
  
  return true
})

const winnerId = computed(() => {
  return form.value.score1 > form.value.score2 ? form.value.player1 : form.value.player2
})

const loserId = computed(() => {
  return form.value.score1 > form.value.score2 ? form.value.player2 : form.value.player1
})

const validateForm = () => {
  let isValid = true
  formErrors.value = {
    player1: '',
    player2: '',
    score1: '',
    score2: '',
    general: ''
  }
  
  if (!form.value.player1) {
    formErrors.value.player1 = 'Selecciona el jugador 1'
    isValid = false
  }
  
  if (!form.value.player2) {
    formErrors.value.player2 = 'Selecciona el jugador 2'
    isValid = false
  }
  
  if (form.value.player1 && form.value.player2 && form.value.player1 === form.value.player2) {
    formErrors.value.player2 = 'Los jugadores deben ser diferentes'
    isValid = false
  }
  
  if (isNaN(form.value.score1) || form.value.score1 < 0) {
    formErrors.value.score1 = 'La puntuación debe ser un número positivo'
    isValid = false
  }
  
  if (isNaN(form.value.score2) || form.value.score2 < 0) {
    formErrors.value.score2 = 'La puntuación debe ser un número positivo'
    isValid = false
  }
  
  if (form.value.score1 === form.value.score2) {
    formErrors.value.general = 'Las puntuaciones deben ser diferentes'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  submitting.value = true
  
  try {
    const matchData = {
      players: [
        {
          playerId: form.value.player1,
          score: parseInt(form.value.score1)
        },
        {
          playerId: form.value.player2,
          score: parseInt(form.value.score2)
        }
      ],
      winnerId: winnerId.value,
      loserId: loserId.value
    }
    
    await createMatch(matchData)
    emit('match-added')
  } catch (err) {
    formErrors.value.general = 'Error al crear el partido. Por favor, intenta de nuevo.'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    players.value = await fetchPlayers()
  } catch (err) {
    error.value = 'Error al cargar los jugadores. Por favor, intenta de nuevo más tarde.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3>Añadir Partido</h3>
        <button class="close-button" @click="emit('close')">×</button>
      </div>
      
      <div v-if="loading" class="modal-loading">
        <div class="spinner"></div>
        <p>Cargando jugadores...</p>
      </div>
      
      <div v-else-if="error" class="modal-error">
        {{ error }}
      </div>
      
      <form v-else @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-row">
          <div class="form-group">
            <label for="player1">Jugador 1</label>
            <select 
              id="player1" 
              v-model="form.player1"
              :class="{ 'error': formErrors.player1 }"
            >
              <option value="">Seleccionar jugador</option>
              <option v-for="player in players" :key="player._id" :value="player._id">
                {{ player.name }}
              </option>
            </select>
            <span v-if="formErrors.player1" class="error-text">{{ formErrors.player1 }}</span>
          </div>
          
          <div class="form-group">
            <label for="score1">Puntuación</label>
            <input 
              type="number" 
              id="score1" 
              v-model.number="form.score1"
              min="0"
              :class="{ 'error': formErrors.score1 }"
            >
            <span v-if="formErrors.score1" class="error-text">{{ formErrors.score1 }}</span>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="player2">Jugador 2</label>
            <select 
              id="player2" 
              v-model="form.player2"
              :class="{ 'error': formErrors.player2 }"
            >
              <option value="">Seleccionar jugador</option>
              <option v-for="player in players" :key="player._id" :value="player._id">
                {{ player.name }}
              </option>
            </select>
            <span v-if="formErrors.player2" class="error-text">{{ formErrors.player2 }}</span>
          </div>
          
          <div class="form-group">
            <label for="score2">Puntuación</label>
            <input 
              type="number" 
              id="score2" 
              v-model.number="form.score2"
              min="0"
              :class="{ 'error': formErrors.score2 }"
            >
            <span v-if="formErrors.score2" class="error-text">{{ formErrors.score2 }}</span>
          </div>
        </div>
        
        <div v-if="formErrors.general" class="general-error">
          {{ formErrors.general }}
        </div>
        
        <div class="match-preview" v-if="isFormValid">
          <div class="preview-label">Vista previa:</div>
          <div class="preview-content">
            <span v-if="form.player1 && players.find(p => p._id === form.player1)">
              {{ players.find(p => p._id === form.player1).name }}
            </span>
            <span class="preview-score">{{ form.score1 }}</span>
            <span class="preview-vs">vs</span>
            <span class="preview-score">{{ form.score2 }}</span>
            <span v-if="form.player2 && players.find(p => p._id === form.player2)">
              {{ players.find(p => p._id === form.player2).name }}
            </span>
          </div>
          <div class="preview-winner">
            Ganador: 
            <span v-if="winnerId && players.find(p => p._id === winnerId)">
              {{ players.find(p => p._id === winnerId).name }}
            </span>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="secondary" @click="emit('close')">Cancelar</button>
          <button 
            type="submit" 
            :disabled="!isFormValid || submitting"
            class="primary"
          >
            <span v-if="submitting">Guardando...</span>
            <span v-else>Guardar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  margin: 0;
}

.close-button {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text-light);
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.modal-loading, .modal-error {
  padding: var(--space-6);
  text-align: center;
}

.modal-form {
  padding: var(--space-6);
}

.form-row {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.form-group {
  flex: 1;
}

.error {
  border-color: var(--color-error);
}

.error-text {
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: var(--space-1);
  display: block;
}

.general-error {
  color: var(--color-error);
  margin-bottom: var(--space-4);
  padding: var(--space-3);
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 0.25rem;
  text-align: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

.match-preview {
  margin-top: var(--space-4);
  padding: var(--space-4);
  background-color: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border);
}

.preview-label {
  font-weight: 500;
  margin-bottom: var(--space-2);
  color: var(--color-text-light);
}

.preview-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}

.preview-score {
  font-weight: bold;
  font-size: 1.25rem;
}

.preview-vs {
  color: var(--color-text-light);
  margin: 0 var(--space-2);
}

.preview-winner {
  margin-top: var(--space-2);
  text-align: center;
  font-weight: 500;
}

.spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--color-primary);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--space-3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: var(--space-3);
  }
}
</style>