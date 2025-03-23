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
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import Popup from "../components/Popup";
import { API, getToken } from "@/services/api";

interface Endereco {
    id_endereco: number;
    bairro: string;
    cidade: string;
    complemento: string;
    estado: string;
    logradouro: string;
    nome_endereco: string;
    num_cep: string;
    num_endereco: string;
    pais: string;
    tipo_endereco: string;
}

interface Secretaria {
    id_secretaria: number;
    nome_secretaria: string;
    nome_responsavel: string;
    email: string;
    endereco: Endereco;
}

interface Assunto {
    id_assunto: number;
    assunto: string;
    prioridade: string;
    tempoResolucao: number;
    valor_protocolo: number;  // Certifique-se de que esta propriedade está definida no tipo
    secretaria: Secretaria;
}

const SolicitarServico: React.FC = () => {
    const { theme } = useTheme();
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error">("success");
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    // 🔹 Estado do Formulário Tipado
    const [assuntos, setAssuntos] = useState<Assunto[]>([]);

    interface FormData {
        descricao: string;
        idSecretaria: number | null;
        status: number;
        valor: number | null;
        assunto: string;  // Adicione esta linha
    }

    const [formData, setFormData] = useState<FormData>({
        descricao: "",
        idSecretaria: null,
        status: 0,
        valor: null,
        assunto: "",  // Inicialize a propriedade 'assunto'
    });

    const router = useRouter();

    const showPopupMessage = (type: "success" | "error", message: string) => {
        setPopupType(type);
        setPopupMessage(message);
        setShowPopup(true);
    };

    // 🔹 Buscar Assuntos da API
    useEffect(() => {
        async function fetchAssuntos() {
            try {
                const response = await API.get<Assunto[]>("/assuntos");
                setAssuntos(response.data);
            } catch (error) {
                console.error("Erro ao buscar os assuntos:", error);
                showPopupMessage("error", "Falha ao carregar os assuntos");
            }
        }
        fetchAssuntos();
    }, []);

    const handleChange = (name: string, value: string) => {
        setFormData((prevState: FormData) => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'assunto') {
            const selectedAssunto = assuntos.find((assunto) => {
                return assunto.assunto === value;  // Retorne o resultado da comparação
            });

            setFormData((prevState: FormData) => ({
                ...prevState,
                idSecretaria: selectedAssunto ? selectedAssunto.secretaria.id_secretaria : null,
                valor: selectedAssunto && selectedAssunto.valor_protocolo !== undefined
                    ? selectedAssunto.valor_protocolo
                    : null  // Ou 0, dependendo de como você deseja tratar esse valor
            }));
        }
    };

    // 🔹 Enviar Dados para a API
    const handleSubmit = async () => {
        if (!formData.assunto) {
            showPopupMessage("error", "Selecione um problema");
            return;
        }

        if (formData.descricao.length < 3) {
            showPopupMessage("error", "Descreva o problema com mais detalhes");
            return;
        }

        setLoading(true);

        const token = await getToken(); // ✅ Obtendo o token do AsyncStorage

        try {
            if (!token || token === 'undefined') {
                setTimeout(() => {
                    setLoading(false); // Desativa o loading após a requisição
                    showPopupMessage("error", "Erro de autenticação. Faça login novamente.");
                }, 2000);
                setLoading(false);
                return;
            }

            const currentDate = new Date();

            const endpoint =
                formData.assunto === "Outros"
                    ? "/protocolo/abrir-protocolos-sem-secretaria"
                    : `/protocolo/abrir-protocolos/${formData.idSecretaria}`;

            await API.post(endpoint, {
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
            setTimeout(() => {
                setLoading(false); // Desativa o loading após a requisição
                showPopupMessage("error", "Falha ao enviar reclamação.");
            }, 2000);
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
            width: 300, // Faz ocupar toda a largura disponível
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
        campoValor: {
            fontSize: 20,
            color: theme.primary,
            textAlign: 'center'
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
        inputContainer: {
            marginTop: 20,
            width: 200,
            height: 100,
            textAlign: 'center'
        },
    });

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
                        <Picker.Item key={item.assunto} label={item.assunto} value={item.assunto} />
                    ))}
                </Picker>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Descreva o problema"
                value={formData.descricao}
                onChangeText={(text) => handleChange("descricao", text)}
                multiline
                textAlignVertical="top"
            />
            <View style={styles.inputContainer}>
                <Text style={{ marginLeft: 30, marginTop: 20 }}>Valor do Serviço</Text>
                <TextInput
                    style={[styles.campoValor, { backgroundColor: "#f0f0f0", color: "black" }]} // ReadOnly with different background
                    value={
                        formData.valor !== null && formData.valor !== undefined
                            ? `R$ ${formData.valor.toFixed(2)}`
                            : "Não definido"
                    }
                    editable={false} // Impede a edição do campo
                />
            </View>

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

export default SolicitarServico;
