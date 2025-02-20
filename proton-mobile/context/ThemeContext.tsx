import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import { lightTheme, darkTheme } from "../styles/theme";

const ThemeContext = createContext({ theme: lightTheme, toggleTheme: () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(colorScheme === "dark" ? darkTheme : lightTheme);

  useEffect(() => {
    setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(theme === lightTheme ? darkTheme : lightTheme) }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
