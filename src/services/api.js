import axios from 'axios';

const API_URL = 'https://pingpong-xrback-production.up.railway.app';

export const fetchRanking = async () => {
  try {
    const response = await axios.get(`${API_URL}/players/ranking`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ranking:', error);
    throw error;
  }
};

export const fetchPlayers = async () => {
  try {
    const response = await axios.get(`${API_URL}/players`);
    return response.data;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

export const submitMatch = async (match) => {
  try {
    const response = await axios.post(`${API_URL}/matches`, match);
    return response.data;
  } catch (error) {
    console.error('Error submitting match:', error);
    throw error;
  }
};