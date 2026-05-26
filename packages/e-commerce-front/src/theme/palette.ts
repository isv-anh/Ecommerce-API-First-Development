import type { ThemeOptions } from "@mui/material/styles";

export const palette: ThemeOptions["palette"] = {
  // brand / palette
  primary: {
    main: "#8225ec",
    light: "#9a28f1",
    // optionally dark / contrastText
    dark: "#7A3CC8",
    contrastText: "#FFFFFF",
  },

  // status
  success: { main: "#22C55E", contrastText: "#FFFFFF" },
  warning: { main: "#F59E0B", contrastText: "#000000" },
  error: { main: "#EF4444", contrastText: "#FFFFFF" },
  info: { main: "#3B82F6", contrastText: "#FFFFFF" },

  // text
  text: {
    primary: "#151426",
    secondary: "#6B6B78",
    white: "#FFFFFF",
  },
};
