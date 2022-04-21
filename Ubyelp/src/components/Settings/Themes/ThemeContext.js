import React from "react";

export const initialThemeState = {
  darkTheme: true,
  setDarkTheme: () => null
};

const ThemeContext = React.createContext(initialThemeState);
export default ThemeContext;
