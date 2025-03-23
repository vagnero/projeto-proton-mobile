import { NetworkInfo } from 'react-native-network-info';

// let API_URL = "http://localhost:8080/protoon"; // Para emular na web
let API_URL = "http://192.168.18.3:8080/protoon"; // Para emular no android

// Função para obter a URL da API com base no IP local
const getAPIUrl = async () => {
  try {
    // Tente obter o IP local da máquina
    const localIp = NetworkInfo.getIPAddress();

    // Substitua o localhost pelo IP local
    const apiUrl = `http://${localIp}:8080/protoon`; 

    // Teste a URL com o IP local
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Falha ao acessar a API');
    }

    // Se a URL com o IP local for válida, usa essa URL
    API_URL = apiUrl;
  } catch (error) {
    // Caso a URL com o IP local falhe, usa o localhost
    API_URL = "http://localhost:8080/protoon";
  }
};

// Chama a função para definir a URL de API
// getAPIUrl();

// Exporta a URL final para ser usada em outros arquivos
export default API_URL;
