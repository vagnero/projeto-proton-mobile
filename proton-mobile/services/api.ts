import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:8080/protoon";

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
