import axios from "axios";
const API_URL = 'http://localhost:8080/protoon';
const token = '' //PRECISA TER ALGO PARA GUARDAR O TOKEN PODE SER O async-storage
export const API = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`, // Passando o token no cabeçalho
      'Content-Type': 'application/json',
    },
  });
