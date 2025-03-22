import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    Alert,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity
} from "react-native";
import axios from "axios";
import URL from "../services/url";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import Popup from "../components/Popup";
import Cookies from '@react-native-cookies/cookies';

// 🔹 Interface para os Assuntos
interface Assunto {
    id_assunto: number;
    assunto: string;
    secretaria: { id_secretaria: number };
}

// 🔹 Interface para o Estado do Formulário
interface FormData {
    assunto: string;
    descricao: string;
    idSecretaria: string | number | null; // 🔹 Alterado para aceitar number também
    status: number;
    valor: number;
}

const Reclamar: React.FC = () => {
    const { theme } = useTheme();
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error">("success");
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    // 🔹 Estado do Formulário Tipado
    const [formData, setFormData] = useState<FormData>({
        assunto: "",
        descricao: "",
        idSecretaria: null,
        status: 1,
        valor: 0,
    });

    const [assuntos, setAssuntos] = useState<Assunto[]>([]);
    const router = useRouter();

    // 🔹 Configuração do Axios com Tipagem
    const axiosInstance = axios.create({
        baseURL: URL,
        withCredentials: true,
    });

    const getTokenFromCookie = async () => {
        try {
            const cookies = await Cookies.get("https://seu-dominio.com"); // Passe a URL aqui
            const token = cookies['token']?.value; // Acesse o valor do cookie diretamente
            return { token: token || null }; // Retorna o token, ou null se não existir
        } catch (error) {
            console.error("Erro ao pegar o token do cookie:", error);
            return { token: null }; // Retorna null caso ocorra erro
        }
    };

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.background,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        pickerContainer: {
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10, // Borda arredondada
            overflow: "hidden", // Evita que o conteúdo ultrapasse as bordas
            marginBottom: 15,
        },
        picker: {
            height: 50, // Ajusta a altura
            width: "100%", // Faz ocupar toda a largura disponível
            color: "#333", // Cor do texto
            backgroundColor: "#f9f9f9", // Cor de fundo
        },
        input: {
            width: "70%",
            height: "40%",
            borderWidth: 1,
            backgroundColor: theme.primary,
            color: theme.secondary,
            borderColor: theme.primary,
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
        },
        text: {
            fontSize: 20,
            color: theme.primary,
        },
        button: {
            backgroundColor: theme.primary,
            minWidth: 150,
            paddingVertical: 12,
            paddingHorizontal: 20,
            marginVertical: 10,
            borderRadius: 10,
            alignItems: "center",
        },
    });

    const showPopupMessage = (type: "success" | "error", message: string) => {
        setPopupType(type);
        setPopupMessage(message);
        setShowPopup(true);
    };

    // 🔹 Buscar Assuntos da API
    useEffect(() => {
        async function fetchAssuntos() {
            try {
                const response = await axiosInstance.get<Assunto[]>("/protoon/assuntos");
                setAssuntos(response.data);
            } catch (error) {
                console.error("Erro ao buscar os assuntos:", error);
                showPopupMessage("error", "Falha ao carregar os assuntos");
            }
        }
        fetchAssuntos();
    }, []);

    // 🔹 Manipular Alterações no Formulário
    const handleChange = (name: keyof FormData, value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
            ...(name === "assunto"
                ? {
                    idSecretaria:
                        assuntos.find((item) => item.assunto === value)?.secretaria
                            .id_secretaria || null,
                }
                : {}),
        }));
    };

    // 🔹 Enviar Dados para a API
    const handleSubmit = async () => {
        setLoading(true);

        if (!formData.assunto) {
            showPopupMessage("error", "Selecione um problema");
            return;
        }

        if (formData.descricao.length < 3) {
            showPopupMessage("error", "Descreva o problema com mais detalhes");
            return;
        }

        try {
            const currentDate = new Date();
            const endpoint =
                formData.assunto === "Outros"
                    ? "/protoon/protocolo/abrir-protocolos-reclamar-sem-secretaria"
                    : `/protoon/protocolo/abrir-protocolos-reclamar/${formData.idSecretaria}`;

            // const token = "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwic3ViIjoiZnVsYW5vQGVtYWlsLmNvbSIsImlhdCI6MTc0MjY1MzA0OCwiZXhwIjoxNzQyNzEzMDQ4fQ.A30Wgo_p3v-S-4cjRu09jVWo8_i5oyiakmsebVLbomA"; // Aqui você vai recuperar o token (de AsyncStorage, por exemplo)
            const { token } = await getTokenFromCookie();

            await axiosInstance.post(endpoint, {
                ...formData,
                data_protocolo: currentDate,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTimeout(() => {
                setLoading(false); // Desativa o loading após a requisição
                showPopupMessage("success", "Reclamação enviada com sucesso!")
                setTimeout(() => {
                    router.push("/home");
                }, 3000);
            }, 3000);

        } catch (error) {
            console.error("Erro ao enviar dados:", error);
            showPopupMessage("error", "Falha ao enviar reclamação");
            setLoading(false); // Desativa o loading após a requisição
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Reclame Aqui</Text>

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={formData.assunto}
                    onValueChange={(value) => handleChange("assunto", value)}
                    style={styles.picker}
                >
                    <Picker.Item label="Selecione um problema" value="" />
                    {assuntos.map((item) => (
                        <Picker.Item key={item.id_assunto} label={item.assunto} value={item.assunto} />
                    ))}
                </Picker>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Descreva o problema"
                value={formData.descricao}
                onChangeText={(text) => handleChange("descricao", text)}
                multiline
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit} >
                <Text style={[styles.text, { color: theme.secondary }]}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/home")} >
                <Text style={[styles.text, { color: theme.secondary }]}>Voltar</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {showPopup && (
                <Popup
                    message={popupMessage}
                    type={popupType}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </SafeAreaView>
    );
};

export default Reclamar;
