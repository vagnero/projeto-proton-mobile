import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { API } from "@/services/api";
export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      borderWidth: 1,
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

  const loginMethod = async () => {
    try {
      const response = await API.post("/auth/authenticate", { email, senha });
      if (response.status === 200) {
        // Handle successful login, e.g., navigate to home screen
        router.push("/home");
      } else {
        // Handle login failure, e.g., show error message
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      // Handle error, e.g., show error message
      alert("An error occurred. Please try again.");
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
    </View>
  );
}

