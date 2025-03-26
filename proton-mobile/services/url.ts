import { NetworkInfo } from 'react-native-network-info';

// let API_URL_DEV = "http://localhost:8080/protoon";
// let API_URL_PROD = "http://192.168.18.3:8080/protoon"; // Para emular no android

// let API_URL = __DEV__ ? API_URL_PROD : API_URL_DEV;

// let API_URL = "http://192.168.18.3:8080/protoon"; // IP da rede da api
let API_URL = "http://hotel-engine.gl.at.ply.gg:42212/protoon"; // URL do tunel do site playit.gg

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
