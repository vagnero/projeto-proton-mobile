import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface PopupProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const bgColor = type === "success" ? "#4CAF50" : "#F44336"; // Verde para sucesso, vermelho para erro
  const textColor = "#FFFFFF"; // Texto sempre branco

  const styles = StyleSheet.create({
    container: {
      backgroundColor: bgColor, // bgColor já deve ser uma variável ou string com a cor
      paddingVertical: 5, // Substituindo "5px" por um valor numérico
      paddingHorizontal: 25, // Substituindo "25px" por um valor numérico
      borderRadius: 8, // O valor de borderRadius é numérico, sem unidades
      position: "absolute",
      bottom: 10,
      left: 50, // Definindo a posição "left", caso necessário para controle visual
    },
  });

  return (
    <View style={styles.container}>
      <Text>
        {message}
      </Text>
    </View>
  );


  return (
    <View style={styles.container}>
      {message}
    </View>
  );
};

export default Popup;
