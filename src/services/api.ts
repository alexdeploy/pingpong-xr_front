import axios from 'axios';
import type { Player, MatchSubmission } from '../types';

const API_URL = 'http://localhost:4000';

export const fetchRanking = async (): Promise<Player[]> => {
  try {
    const response = await axios.get<Player[]>(`${API_URL}/players/ranking`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ranking:', error);
    throw error;
  }
};

export const fetchPlayers = async (): Promise<Player[]> => {
  try {
    const response = await axios.get<Player[]>(`${API_URL}/players`);
    return response.data;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

export const submitMatch = async (match: MatchSubmission): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/matches`, match);
    return response.data;
  } catch (error) {
    console.error('Error submitting match:', error);
    throw error;
  }
};