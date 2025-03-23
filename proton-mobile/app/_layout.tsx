import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import Layout from "../components/Layout";
import { ProtocolProvider } from "../context/ProtocolContextType "; // Importe o contexto

export default function RootLayout() {
  return (
    <ProtocolProvider>
      <ThemeProvider>
        <Layout>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: "" }} />
            <Stack.Screen name="home" options={{ title: "", headerTintColor: "#2D9596" }} />
            <Stack.Screen name="login" options={{ title: "" }} />
            <Stack.Screen name="register" options={{ title: "", headerTintColor: "#2D9596" }} />
            <Stack.Screen name="reclamacoes" options={{ title: "", headerTintColor: "#2D9596" }} />
            <Stack.Screen name="consultar" options={{ title: "", headerTintColor: "#2D9596" }} />
            <Stack.Screen name="todas-devolutivas" options={{ title: "", headerTintColor: "#2D9596" }} />
            <Stack.Screen name="esqueceuSenha" options={{ title: "", headerTintColor: "#2D9596" }} />
          </Stack>
        </Layout>
      </ThemeProvider>
    </ProtocolProvider>
  );
}
