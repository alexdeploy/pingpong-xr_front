<script setup>
import { ref, onMounted } from 'vue';
import RankingTable from './components/RankingTable.vue';
import Button from './components/Button.vue';
import AddMatchModal from './components/AddMatchModal.vue';
import { fetchRanking, fetchPlayers, submitMatch } from './services/api';

const players = ref([]);
const rankingData = ref([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

onMounted(async () => {
  try {
    await loadRankingData();
    await loadPlayersData();
  } catch (error) {
    errorMessage.value = 'Failed to load initial data. Please try again.';
  } finally {
    isLoading.value = false;
  }
});

const loadRankingData = async () => {
  try {
    rankingData.value = await fetchRanking();
  } catch (error) {
    console.error('Error loading ranking:', error);
    throw error;
  }
};

const loadPlayersData = async () => {
  try {
    players.value = await fetchPlayers();
  } catch (error) {
    console.error('Error loading players:', error);
    throw error;
  }
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSubmitMatch = async (matchData) => {
  errorMessage.value = '';
  successMessage.value = '';
  isSubmitting.value = true;
  
  try {
    await submitMatch(matchData);
    successMessage.value = 'Match added successfully!';
    
    await Promise.all([
      loadRankingData(),
      loadPlayersData()
    ]);
    
    closeModal();
    
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error) {
    errorMessage.value = 'Failed to submit match. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="app-container">
    <header>
      <h1>Ping Pong Rankings</h1>
    </header>
    
    <main>
      <div class="messages">
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
          <button class="dismiss-button" @click="errorMessage = ''">×</button>
        </div>
        
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
          <button class="dismiss-button" @click="successMessage = ''">×</button>
        </div>
      </div>
      
      <div class="actions">
        <Button @click="openModal" variant="primary">Add Match</Button>
      </div>
      
      <RankingTable 
        :players="rankingData" 
        :loading="isLoading" 
      />
    </main>
    
    <AddMatchModal 
      :isOpen="isModalOpen" 
      :players="players"
      :isSubmitting="isSubmitting"
      @close="closeModal"
      @submit="handleSubmitMatch"
    />
  </div>
</template>

<style>
:root {
  --primary-color: #C10016;
  --secondary-color: #091F2C;
  --accent-color: #A6BBC8;
  --background-color: #f8fafc;
  --text-color: #091F2C;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.5;
  background-color: var(--background-color);
  color: var(--text-color);
}

.app-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  font-size: 3rem;
  color: var(--secondary-color);
  margin: 0;
  padding-bottom: 0.5rem;
  position: relative;
  font-weight: 700;
}

h1:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background-color: var(--primary-color);
}

main {
  padding: 2rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
}

.messages {
  margin-bottom: 2rem;
}

.error-message, .success-message {
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.error-message {
  background-color: rgba(193, 0, 22, 0.1);
  color: var(--primary-color);
}

.success-message {
  background-color: rgba(9, 31, 44, 0.1);
  color: var(--secondary-color);
}

.dismiss-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: currentColor;
  opacity: 0.7;
}

.dismiss-button:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .app-container {
    padding: 1rem;
  }
  
  main {
    padding: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }

  .actions {
    margin-bottom: 1.5rem;
  }
}
</style>