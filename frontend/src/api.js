import axios from 'axios';

// 1. FOR LOCAL DEVELOPMENT (Run this when working on your laptop)
const API_URL = 'http://localhost:5000/api'; 

// 2. FOR DEPLOYMENT (Uncomment and replace this later when you go live)
// const API_URL = 'https://your-backend-app.onrender.com/api'; 

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});