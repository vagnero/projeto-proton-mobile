import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import axios from 'axios';
import { useProtocol } from "../context/ProtocolContextType ";  // Remover o espaço extra no import
import Popup from "../components/Popup";
import { useTheme } from "../context/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import { API, getToken } from "@/services/api";

export default function TodasDevolutivas() {
  const { protocoloId } = useLocalSearchParams(); // Pega o parâmetro da URL
  const [devolutivas, setDevolutivas] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null); // Novo estado para erros
  const { theme } = useTheme();

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const showPopupMessage = (type: "success" | "error", message: string) => {
    setPopupType(type);
    setPopupMessage(message);
    setShowPopup(true);
  };

  useEffect(() => {
    async function fetchDevolutivas() {
      try {
        const response = await API.get(`/devolutiva/devolutiva-protocolo/${protocoloId}`);
        setDevolutivas(response.data);
      } catch (error) {
        setTimeout(() => {
          setLoading(false);
          console.error("Erro ao buscar as devolutivas", error);
        }, 3000);
      }
    }

    if (protocoloId) {
      fetchDevolutivas();
    }
  }, [protocoloId]);

  if (loading) {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }

  if (error) return <Text>{error}</Text>; // Exibir erro se houver

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      padding: 20,
    },
    title: {
      fontSize: 30,
      color: theme.text,
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: 20,
    },
    text: {
      fontSize: 30,
      color: theme.text,
      textAlign: 'center',
      fontWeight: 'bold',
      marginTop: 200,
    },
    card: {
      backgroundColor: '#D0D0D0',
      padding: 15,
      marginBottom: 10,
      marginLeft: '5%',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ddd',
      width: '90%',
    },
    cardTitle: {
      fontWeight: 'bold',
      marginBottom: 5,
    },
    cardText: {
      fontSize: 14,
      marginVertical: 5,
      color: '#555',
    },
    listContainer: {
      width: '100%',
      marginLeft: '5%',
      flex: 1,
    },
    descriptionContainer: {
      backgroundColor: '#f5f5f5',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    noDataText: {
      fontSize: 18,
      textAlign: 'center',
      marginTop: 50,
      color: theme.primary,
    },
    loading: {
      marginTop: 200
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todas as Devolutivas</Text>
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <FlatList
          data={devolutivas}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}

          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Data e Hora: {item.momento_devolutiva}</Text>
              {item.id_funcionario ? (
                <>
                  <Text style={styles.cardText}>Funcionário: {item.id_funcionario.nome}</Text>
                  <Text style={styles.cardText}>Secretaria: {item.id_funcionario.secretaria.nome_secretaria}</Text>
                </>
              ) : (
                <Text style={styles.cardText}>Nome do Funcionário: Não especificado</Text>
              )}
              <View style={styles.descriptionContainer}>
                <Text style={styles.cardText}>Descrição: {item.devolutiva}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.noDataText}>Não há devolutivas para este protocolo.</Text>}
        />
      )}
      {showPopup && (
        <Popup
          message={popupMessage}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}
    </View>
  );
}

