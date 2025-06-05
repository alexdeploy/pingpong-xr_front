<template>
  <div class="ranking-view">
    <div class="page-header">
      <h2>Ranking</h2>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando ranking...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else class="card">
      <table class="ranking-table">
        <thead>
          <tr>
            <th class="rank-column">#</th>
            <th>Jugador</th>
            <th>Rating</th>
            <th>Partidos</th>
            <th>Victoria</th>
            <th>Derrota</th>
            <th>% Victoria</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in players" :key="player._id" :class="getRankingClass(index)">
            <td class="rank-column">{{ index + 1 }}</td>
            <td class="player-name">{{ player.name }}</td>
            <td>{{ player.rating }}</td>
            <td>{{ player.gamesPlayed }}</td>
            <td>{{ player.wins }}</td>
            <td>{{ player.losses }}</td>
            <td>{{ getWinPercentage(player) }}%</td>
          </tr>
          <tr v-if="players.length === 0">
            <td colspan="7" class="empty-state">No hay jugadores registrados</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchRanking } from '../services/api'

const players = ref([])
const loading = ref(true)
const error = ref(null)

const getWinPercentage = (player) => {
  if (player.gamesPlayed === 0) return 0
  return Math.round((player.wins / player.gamesPlayed) * 100)
}

const getRankingClass = (index) => {
  if (index === 0) return 'rank-first'
  if (index === 1) return 'rank-second'
  if (index === 2) return 'rank-third'
  return ''
}

onMounted(async () => {
  try {
    players.value = await fetchRanking()
  } catch (err) {
    error.value = 'Error al cargar el ranking. Por favor, intenta de nuevo más tarde.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.ranking-table {
  width: 100%;
}

.rank-column {
  width: 60px;
  text-align: center;
}

.player-name {
  font-weight: 500;
}

.rank-first {
  background-color: rgba(255, 215, 0, 0.1);
}

.rank-first .rank-column {
  color: gold;
  font-weight: bold;
}

.rank-second {
  background-color: rgba(192, 192, 192, 0.1);
}

.rank-second .rank-column {
  color: silver;
  font-weight: bold;
}

.rank-third {
  background-color: rgba(205, 127, 50, 0.1);
}

.rank-third .rank-column {
  color: #CD7F32;
  font-weight: bold;
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
  color: var(--color-text-light);
}

.error-message {
  color: var(--color-error);
  text-align: center;
  padding: var(--space-6);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>