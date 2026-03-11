import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeText {
    white: string;
  }
}

const theme = createTheme({
  typography: {},
  palette: {
    primary: {
      main: "#9B5DE0",
      light: "#C77DFF",
    },
    text: {
      white: "#FFFFFF",
    },
    common: {
      white: "#FFFFFF",
      black: "#000000",
    },
  },
  breakpoints: {
    values: {
      xs: 600,
      sm: 900,
      md: 1200,
      lg: 1536,
      xl: 1920,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarGutter: "stable overlay", // modern browser
        },

        "*::-webkit-scrollbar": {
          width: "4px",
          height: "4px",
        },
        "*::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(255,255,255,0.3)",
          borderRadius: "8px",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(255,255,255,0.5)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "24px",
        },
        outlined: {
          borderWidth: 2,
        },
      },
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "48px",
          },
        },
      },
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          height: "64px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
        },
      },
    },
  },
});

export default theme;
