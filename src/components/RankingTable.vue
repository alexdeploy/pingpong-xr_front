<script setup>
import { computed } from 'vue';

const props = defineProps({
  players: Array,
  loading: Boolean
});

const getMedalClass = (index) => {
  if (index === 0) return 'medal gold';
  if (index === 1) return 'medal silver';
  if (index === 2) return 'medal bronze';
  return '';
};

const hasPlayers = computed(() => props.players.length > 0);
</script>

<template>
  <div class="ranking-container">
    <h2>Player Rankings</h2>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span>Loading rankings...</span>
    </div>
    
    <div v-else-if="!hasPlayers" class="empty-state">
      <p>No players found. Add some matches to see rankings!</p>
    </div>
    
    <table v-else class="ranking-table">
      <thead>
        <tr>
          <th class="rank-col">#</th>
          <th class="name-col">Name</th>
          <th class="rating-col">Rating</th>
          <th class="games-col">Games</th>
          <th class="wins-col">Wins</th>
          <th class="losses-col">Losses</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in players" :key="player._id" :class="{ 'top-three': index < 3 }">
          <td class="rank-col">
            <span :class="getMedalClass(index)">{{ index + 1 }}</span>
          </td>
          <td class="name-col">{{ player.name }}</td>
          <td class="rating-col">{{ player.rating }}</td>
          <td class="games-col">{{ player.gamesPlayed }}</td>
          <td class="wins-col">{{ player.wins }}</td>
          <td class="losses-col">{{ player.losses }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.ranking-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(9, 31, 44, 0.1);
  padding: 2rem;
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #091F2C;
  text-align: center;
  font-weight: 600;
}

.ranking-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
}

th, td {
  padding: 16px 24px;
  text-align: left;
}

th {
  background-color: #091F2C;
  color: white;
  font-weight: 500;
  letter-spacing: 0.5px;
}

tr:nth-child(even) {
  background-color: #f8fafc;
}

tr:nth-child(odd) {
  background-color: white;
}

tr:hover {
  background-color: #A6BBC8;
  color: #091F2C;
}

.top-three {
  font-weight: 500;
}

.medal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.gold {
  background-color: #C10016;
}

.silver {
  background-color: #A6BBC8;
}

.bronze {
  background-color: #091F2C;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(9, 31, 44, 0.1);
  border-radius: 50%;
  border-top-color: #C10016;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #091F2C;
}

@media (max-width: 768px) {
  .ranking-container {
    padding: 1rem;
    margin: 1rem;
    border-radius: 8px;
  }

  .games-col, .wins-col, .losses-col {
    display: none;
  }
  
  .ranking-table {
    font-size: 0.9rem;
  }
  
  th, td {
    padding: 12px 16px;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
}
</style>