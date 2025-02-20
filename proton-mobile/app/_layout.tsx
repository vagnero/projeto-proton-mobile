import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import Layout from "../components/Layout";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Layout>
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen name="index" options={{ title: "" }} />
          <Stack.Screen name="home" options={{ title: "", headerTintColor: "#2D9596" }} />
          <Stack.Screen name="login" options={{ title: ""}} />
          <Stack.Screen name="register" options={{ title: "", headerTintColor: "#2D9596" }} />
          <Stack.Screen name="reclamacoes" options={{ title: "", headerTintColor: "#2D9596" }} />
          <Stack.Screen name="consultar" options={{ title: "", headerTintColor: "#2D9596" }} />
          <Stack.Screen name="esqueceuSenha" options={{ title: "", headerTintColor: "#2D9596" }} />
        </Stack>
      </Layout>
    </ThemeProvider>
  );
}
