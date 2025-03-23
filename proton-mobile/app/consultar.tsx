import { useState, useEffect } from "react";
import axios from 'axios';
import { View, Text, Button, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { API } from "../services/api";
import Popup from "../components/Popup";
import { useProtocol } from "../context/ProtocolContextType ";
import { useNavigation } from "@react-navigation/native";

const Consultar = () => {
    const { theme } = useTheme();
    const { setProtocoloId } = useProtocol(); // Pega a função para setar o protocolo
    const router = useRouter();
    const [protocolos, setProtocolos] = useState<Protocolo[]>([]);
    const navigation = useNavigation();

    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error">("success");
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",     // Formato numérico de 2 dígitos
            month: "2-digit",   // Formato numérico de 2 dígitos
            year: "numeric",    // Ano no formato numérico
        };

        return new Intl.DateTimeFormat("pt-BR", options).format(new Date(date));
    };

    useEffect(() => {
        const fetchProtocolos = async () => {
            setLoading(true);
            try {
                const response = await API.get(`/protocolo/meus-protocolos/bytoken`);
                if (response.data.length === 0) {
                    showPopupMessage('error', 'Não há nenhum Protocolo até o momento');
                }
                setProtocolos(response.data);
            } catch (err) {
                showPopupMessage('error', "Erro ao buscar os protocolos. Por favor, tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchProtocolos();
    }, []);

    const showPopupMessage = (type: "success" | "error", message: string) => {
        setPopupType(type);
        setPopupMessage(message);
        setShowPopup(true);
    };

    const handleBack = () => {
        router.replace("/home");
    };

    const handleProtocolClick = (protocolo_id?: number) => {
        if (!protocolo_id) {
            console.error("Erro: protocolo_id está undefined!");
            return;
        }
    
        // Corrigido: passando protocoloId usando params
        router.push({
            pathname: "/todas-devolutivas",  // Caminho da rota
            params: { protocoloId: protocolo_id },  // Passando parâmetros para a URL
        });
    };

    interface Protocolo {
        id_protocolo: number;
        assunto: string;
        descricao: string;
        secretaria?: {
            nome_secretaria: string;
        };
        status: string;
        valor: number | null;
        data_protocolo: string;
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "flex-start",
            paddingHorizontal: 10,
            paddingTop: 50,
        },
        header: {
            flexDirection: "row",
            marginBottom: 10,
            paddingVertical: 10,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        headerText: {
            fontSize: 10,
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
            paddingHorizontal: 1,
        },
        card: {
            marginBottom: 15,
            width: '100%',
            minHeight: 50,
            padding: 5,
            paddingHorizontal: 10,
            backgroundColor: "#f2f2f2",
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            flexDirection: "row",
        },
        cardText: {
            fontSize: 10,
            marginTop: 5,
        },
        row: {
            marginBottom: 10, // Espaço entre as linhas de dados
        },
    });


    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {loading && <ActivityIndicator size="large" color={theme.primary} />}
            {!loading &&
                <View style={{ flex: 1 }}>
                    {/* Cabeçalho da tabela */}
                    <View style={[styles.header, { backgroundColor: "#f2f2f2" }]}>
                        <Text style={[styles.headerText, { flex: 1 }]}>Assunto</Text>
                        <Text style={[styles.headerText, { flex: 1 }]}>Descrição</Text>
                        <Text style={[styles.headerText, { flex: 1 }]}>Secretaria</Text>
                        <Text style={[styles.headerText, { flex: 1 }]}>Etapa</Text>
                        <Text style={[styles.headerText, { flex: 1 }]}>Valor</Text>
                        <Text style={[styles.headerText, { flex: 1 }]}>Data Prot.</Text>
                    </View>
                    <FlatList
                        data={protocolos}
                        keyExtractor={(item) => item.id_protocolo ? item.id_protocolo.toString() : 'defaultKey'}
                        renderItem={({ item: protocolo }) => (
                            <View style={styles.row}>
                                <TouchableOpacity style={styles.card} onPress={() => {
                                    if (protocolo?.id_protocolo) {
                                        handleProtocolClick(protocolo.id_protocolo);
                                    } else {
                                        console.error("Erro: protocolo.id está undefined!", protocolo);
                                    }
                                }}>
                                    <Text style={[styles.cardText, { color: theme.secondary, maxWidth: '15%', minWidth: '15%' }]}>{protocolo.assunto}</Text>
                                    <Text style={[styles.cardText, { color: theme.secondary, marginHorizontal: '1%', maxWidth: '18%', minWidth: '18%', textAlign: 'center' }]}>{protocolo.descricao.substring(0, 50)}...</Text>
                                    <Text style={[styles.cardText, { color: theme.secondary, marginLeft: '-1%', marginHorizontal: '1%', maxWidth: '18%', minWidth: '15%', textAlign: 'center' }]}>{protocolo.secretaria?.nome_secretaria || "Não informado"}</Text>
                                    <Text style={[styles.cardText, { color: theme.secondary, maxWidth: '18%', minWidth: '15%', textAlign: 'center' }]}>{protocolo.status}</Text>
                                    <Text style={[styles.cardText, { color: theme.secondary, position: 'absolute', right: 10, textAlign: 'center' }]}>{formatDate(protocolo.data_protocolo)}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>

            }
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {showPopup && (
                <Popup
                    message={popupMessage}
                    type={popupType}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </View>
    );
};

export default Consultar;
