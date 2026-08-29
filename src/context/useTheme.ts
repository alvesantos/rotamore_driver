import { useContext } from "react";
import { ThemeContext } from "./themeTypes";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser utilizado dentro de um ThemeProvider");
  }
  return context;
};

