import axios from 'axios';

// Automatically selects the URL based on the environment:
// 1. If running locally (npm start), it uses http://localhost:5000/api
// 2. If deployed on Vercel, it uses the Environment Variable you set in the Vercel Dashboard
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});