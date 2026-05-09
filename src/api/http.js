import { useAuthStores } from "@/stores/auth";
import axios from "axios";

const api = axios.create({
  baseURL: 'https://api-novia.g2.ant.com.kh',
    headers: {
        // "Content-Type": "multipart/form-data"
    }
})

api.interceptors.request.use((config) => {
    const auth = useAuthStores();
    if (auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
});

export default api;