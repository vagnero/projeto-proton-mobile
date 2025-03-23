import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { API, saveToken } from "@/services/api";
import Popup from "../components/Popup";

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      borderWidth: 1,
      width: '80%',
      borderColor: theme.primary,
      color: theme.text,
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

  const loginMethod = async () => {
    // Remove espaços extras e converter para minúsculas
    const emailFormatado = email.trim().toLowerCase();
    const senhaFormatada = senha.trim();

    // Validações
    if (!emailFormatado || !senhaFormatada) {
      showPopupMessage("error", "Preencha todos os campos!");
      return;
    }

    if (emailFormatado.length < 3) {
      showPopupMessage("error", "O e-mail deve ter pelo menos 3 caracteres.");
      return;
    }

    // Expressão regular para validar o formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailFormatado)) {
      showPopupMessage("error", "Digite um e-mail válido.");
      return;
    }

    if (senhaFormatada.length < 6) {
      showPopupMessage("error", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      // Requisição à API
      const response = await API.post("/auth/authenticate", {
        email: emailFormatado,
        senha: senhaFormatada
      });

      if (response.status === 200) {
        // Login bem-sucedido
        await saveToken(response.data.access_token);
        setTimeout(() => {
          setLoading(false);
          router.push("/home");
        }, 3000);
      } else {
        setTimeout(() => {
          setLoading(false);
          showPopupMessage("error", "Login falhou.");
        }, 3000);
      }
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        showPopupMessage("error", "Login falhou. Verifique suas credenciais.");
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.text}>Senha:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={loginMethod} >
        <Text style={[styles.text, { color: theme.secondary }]}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/register")} >
        <Text style={[styles.text, { color: theme.secondary }]}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.secondary }]}
        onPress={() => router.replace("/esqueceuSenha")} >
        <Text style={[styles.text, { color: theme.primary }]}>Esqueceu a senha?</Text>
      </TouchableOpacity>
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
}

