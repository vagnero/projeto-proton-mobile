import { Text, View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function Index() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text>TESTANDO SE PEGA app/teste.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});
