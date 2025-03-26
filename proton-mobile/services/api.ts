import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import URL from '../services/url'

const API_URL = URL


// Função para obter o token armazenado
const getToken = async () => {
  try {
    return await AsyncStorage.getItem("token");
  } catch (error) {
    console.error("Erro ao recuperar o token:", error);
    return null;
  }
};

// Função para armazenar o token
const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("token", token);
  } catch (error) {
    console.error("Erro ao salvar o token:", error);
  }
};

// Criar instância do Axios e atualizar o token dinamicamente
const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Linux; Android 11; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36"
  },
});

// Interceptador para adicionar o token antes de cada requisição
API.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export { API, saveToken, getToken };
