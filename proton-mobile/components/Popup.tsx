import React, { useEffect, useState } from "react";

interface PopupProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

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

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: "5px 25px",
        borderRadius: "8px",
        position: "absolute",
        bottom: 10,

        display: "inline-block",
      }}
    >
      {message}
    </div>
  );
};

export default Popup;
