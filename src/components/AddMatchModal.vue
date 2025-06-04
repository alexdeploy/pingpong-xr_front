<script setup>
import { ref, computed, watch } from 'vue';
import PlayerSelect from './PlayerSelect.vue';
import Button from './Button.vue';

const props = defineProps({
  isOpen: Boolean,
  players: Array,
  isSubmitting: Boolean
});

const emit = defineEmits(['close', 'submit']);

const player1Id = ref('');
const player2Id = ref('');
const player1Score = ref(null);
const player2Score = ref(null);
const errorMessage = ref('');

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resetForm();
  }
});

const resetForm = () => {
  player1Id.value = '';
  player2Id.value = '';
  player1Score.value = null;
  player2Score.value = null;
  errorMessage.value = '';
};

const isFormValid = computed(() => {
  return (
    player1Id.value && 
    player2Id.value && 
    player1Id.value !== player2Id.value &&
    player1Score.value !== null && 
    player2Score.value !== null &&
    player1Score.value !== player2Score.value
  );
});

const getPlayerById = (id) => {
  return props.players.find(player => player._id === id);
};

const handleSubmit = () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Please fill all fields correctly. Players must be different and scores cannot be equal.';
    return;
  }

  const p1Score = player1Score.value;
  const p2Score = player2Score.value;
  
  const winnerId = p1Score > p2Score ? player1Id.value : player2Id.value;
  const loserId = p1Score > p2Score ? player2Id.value : player1Id.value;
  
  const players = [
    { playerId: player1Id.value, score: p1Score },
    { playerId: player2Id.value, score: p2Score }
  ];
  
  const matchData = {
    players,
    winnerId,
    loserId
  };
  
  emit('submit', matchData);
};

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Add Match Result</h3>
        <button class="close-button" @click="handleClose">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="error-message" v-if="errorMessage">
          {{ errorMessage }}
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="players-container">
            <div class="player-column">
              <PlayerSelect 
                v-model="player1Id" 
                :players="players"
                label="Player 1"
                :otherSelectedId="player2Id"
                :disabled="isSubmitting"
              />
              
              <div class="score-input">
                <label for="player1Score">Score</label>
                <input
                  id="player1Score"
                  type="number"
                  v-model.number="player1Score"
                  min="0"
                  max="99"
                  :disabled="isSubmitting"
                />
              </div>
            </div>
            
            <div class="versus">VS</div>
            
            <div class="player-column">
              <PlayerSelect 
                v-model="player2Id" 
                :players="players"
                label="Player 2"
                :otherSelectedId="player1Id"
                :disabled="isSubmitting"
              />
              
              <div class="score-input">
                <label for="player2Score">Score</label>
                <input
                  id="player2Score"
                  type="number"
                  v-model.number="player2Score"
                  min="0"
                  max="99"
                  :disabled="isSubmitting"
                />
              </div>
            </div>
          </div>
          
          <div class="match-summary" v-if="isFormValid">
            <strong>Match Summary:</strong>
            <p>
              {{ getPlayerById(player1Id)?.name }} {{ player1Score }} - {{ player2Score }} {{ getPlayerById(player2Id)?.name }}
            </p>
            <p class="winner">
              Winner: {{ getPlayerById(player1Score > player2Score ? player1Id : player2Id)?.name }}
            </p>
          </div>
          
          <div class="form-actions">
            <Button 
              variant="secondary" 
              @click="handleClose"
              :disabled="isSubmitting"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              :disabled="!isFormValid || isSubmitting"
            >
              {{ isSubmitting ? 'Saving...' : 'Save Match' }}
            </Button>
          </div>
        </form>
      </div>
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
  background-color: rgba(9, 31, 44, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 30px rgba(9, 31, 44, 0.2);
  animation: modal-appear 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 2px solid #A6BBC8;
}

.modal-header h3 {
  margin: 0;
  color: #091F2C;
  font-weight: 600;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #091F2C;
  padding: 0;
  line-height: 1;
}

.close-button:hover {
  color: #C10016;
}

.modal-body {
  padding: 24px;
}

.error-message {
  background-color: rgba(193, 0, 22, 0.1);
  color: #C10016;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.players-container {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.player-column {
  flex: 1;
}

.versus {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #091F2C;
  font-size: 1.2rem;
}

.score-input {
  margin-bottom: 20px;
}

.score-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #091F2C;
}

.score-input input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #A6BBC8;
  border-radius: 8px;
  font-size: 1rem;
  color: #091F2C;
}

.score-input input:focus {
  outline: none;
  border-color: #091F2C;
  box-shadow: 0 0 0 3px rgba(9, 31, 44, 0.1);
}

.match-summary {
  background-color: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  color: #091F2C;
}

.match-summary p {
  margin: 8px 0;
}

.winner {
  color: #C10016;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .players-container {
    flex-direction: column;
    gap: 16px;
  }
  
  .versus {
    padding: 8px 0;
  }

  .modal-content {
    margin: 16px;
  }

  .modal-header {
    padding: 16px;
  }

  .modal-body {
    padding: 16px;
  }
}
</style>