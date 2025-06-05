import axios from 'axios'

// Create axios instances for different base URLs
const apiBackend = axios.create({
  baseURL: 'http://pingpong-xrback-production.up.railway.app',
  headers: {
    'Content-Type': 'application/json'
  }
})

const apiLocal = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// API functions
export const fetchRanking = async () => {
  try {
    const response = await apiBackend.get('/players/ranking')
    return response.data
  } catch (error) {
    console.error('Error fetching ranking:', error)
    throw error
  }
}

export const fetchMatches = async () => {
  try {
    const response = await apiBackend.get('/matches')
    return response.data
  } catch (error) {
    console.error('Error fetching matches:', error)
    throw error
  }
}

export const fetchPlayers = async () => {
  try {
    const response = await apiLocal.get('/players')
    return response.data
  } catch (error) {
    console.error('Error fetching players:', error)
    throw error
  }
}

export const createMatch = async (matchData) => {
  try {
    const response = await apiLocal.post('/matches', matchData)
    return response.data
  } catch (error) {
    console.error('Error creating match:', error)
    throw error
  }
}