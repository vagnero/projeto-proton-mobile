import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { API } from "../services/api";
import Popup from "../components/Popup";

export default function RegisterScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [celular, setCelular] = useState("(11)99876-5432");

  const generateCPF = () => {
    const randomDigits = () => Math.floor(Math.random() * 10);

    // Gera os primeiros 9 dígitos do CPF
    const cpfArray = Array.from({ length: 9 }, randomDigits);

    // Função para calcular o dígito verificador
    const calculateDigit = (base: number[]) => {
      const sum = base
        .map((num, index) => num * (base.length + 1 - index))
        .reduce((acc, val) => acc + val, 0);
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    // Calcula os dois últimos dígitos verificadores
    cpfArray.push(calculateDigit(cpfArray));
    cpfArray.push(calculateDigit(cpfArray));

    // Formata como CPF: XXX.XXX.XXX-XX
    return cpfArray.join("").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const generateBirthDate = () => {
    const today = new Date();
    const minYear = today.getFullYear() - 60; // Gera até 60 anos atrás
    const maxYear = today.getFullYear() - 15; // No mínimo 15 anos

    const year = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1; // Para evitar problemas com fevereiro

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const showPopupMessage = (type: "success" | "error", message: string) => {
    setPopupType(type);
    setPopupMessage(message);
    setShowPopup(true);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      showPopupMessage("error", "Preencha todos os campos!");
      return;
    }

    if (name.length < 3) {
      showPopupMessage("error", "O nome deve ter pelo menos 3 caracteres.");
      return;
    }

    // Expressão regular para validar o formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showPopupMessage("error", "Digite um e-mail válido.");
      return;
    }

    if (password.length < 6) {
      showPopupMessage("error", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const userData = {
      nome: name,
      email: email,
      senha: password,
      num_CPF: generateCPF(),
      celular: celular,
      data_nascimento: generateBirthDate(),
      endereco: {
        tipo_endereco: "Residencial",
        num_cep: "08541-000",
        logradouro: "Estrada",
        num_endereco: "1611",
        complemento: "Casa",
        bairro: "Cháracara Laguna",
        cidade: "Ferraz de Vasconcelos",
        estado: "SP",
        pais: "Brasil"
      },
    };

    setLoading(true);

    try {
      const response = await API.post("/auth/register/municipe", JSON.stringify(userData), {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setTimeout(() => {
          setLoading(false); // Desativa o loading após a requisição
          showPopupMessage("success", "Cadastro realizado!");
          setTimeout(() => {
            router.replace("/login");
          }, 2000);
        }, 2000);
      } else {
        setTimeout(() => {
          setLoading(false);
          showPopupMessage("error", "Cadastro falhou.");
        }, 3000);
      }
    } catch (error) {
      setTimeout(() => {
        setLoading(false); // Desativa o loading após a requisição
        console.error("Erro no cadastro:", error);
        showPopupMessage("error", "Falha ao cadastrar. Tente outro email.");
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
    input: {
      width: "50%",
      borderWidth: 1,
      borderColor: theme.primary,
      backgroundColor: theme.primary,
      color: theme.secondary,
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nome</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.text}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())} // Converte para minúsculas
        autoCapitalize="none" // Impede a capitalização automática
      />

      <Text style={styles.text}>Senha</Text>
      <TextInput style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={[styles.text, { color: theme.secondary }]}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/login')}>
        <Text style={[styles.text, { color: theme.secondary }]}>Voltar</Text>
      </TouchableOpacity>
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
