<template>
  <div class="matches-view">
    <div class="page-header">
      <h2>Partidos</h2>
      <button @click="showAddModal = true" class="add-button">
        Añadir Partido
      </button>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando partidos...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else-if="matches.length === 0" class="empty-state card">
      <p>No hay partidos registrados</p>
      <button @click="showAddModal = true" class="mt-4">Añadir Partido</button>
    </div>
    
    <div v-else class="matches-list">
      <div v-for="match in matches" :key="match._id" class="match-card card">
        <div class="match-header">
          <span class="match-date">{{ formatDate(match.date) }}</span>
        </div>
        <div class="match-content">
          <div class="player player-winner">
            <div class="player-name">{{ match.players[0].playerId.name }}</div>
            <div class="player-score">{{ match.players[0].score }}</div>
          </div>
          <div class="match-vs">vs</div>
          <div class="player">
            <div class="player-name">{{ match.players[1].playerId.name }}</div>
            <div class="player-score">{{ match.players[1].score }}</div>
          </div>
        </div>
        <div class="match-footer">
          <div class="winner-info">
            <span class="winner-label">Ganador:</span>
            <span class="winner-name">{{ match.winnerId.name }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <AddMatchModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @match-added="handleMatchAdded"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchMatches } from '../services/api'
import AddMatchModal from '../components/AddMatchModal.vue'

const matches = ref([])
const loading = ref(true)
const error = ref(null)
const showAddModal = ref(false)

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const refreshMatches = async () => {
  loading.value = true
  try {
    matches.value = await fetchMatches()
  } catch (err) {
    error.value = 'Error al cargar los partidos. Por favor, intenta de nuevo más tarde.'
  } finally {
    loading.value = false
  }
}

const handleMatchAdded = () => {
  showAddModal.value = false
  refreshMatches()
}

onMounted(async () => {
  await refreshMatches()
})
</script>

<style scoped>
.add-button {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.add-button::before {
  content: '+';
  font-size: 1.2rem;
  font-weight: bold;
}

.matches-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
}

.match-card {
  display: flex;
  flex-direction: column;
}

.match-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-3);
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.match-content {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-3);
}

.player {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player-winner .player-name {
  font-weight: 600;
  color: var(--color-primary);
}

.player-name {
  font-size: 1.1rem;
  margin-bottom: var(--space-2);
}

.player-score {
  font-size: 1.5rem;
  font-weight: 700;
}

.match-vs {
  margin: 0 var(--space-3);
  color: var(--color-text-light);
  font-weight: 600;
}

.match-footer {
  margin-top: auto;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}

.winner-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.winner-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.winner-name {
  font-weight: 600;
  color: var(--color-success);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--color-primary);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: var(--space-4);
}

.empty-state {
  text-align: center;
  padding: var(--space-6);
}

.error-message {
  color: var(--color-error);
  text-align: center;
  padding: var(--space-6);
}

.mt-4 {
  margin-top: var(--space-4);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .matches-list {
    grid-template-columns: 1fr;
  }
}
</style>