import axios from 'axios'
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
export const api = axios.create({
    baseURL: baseUrl,    
})

export default api;
