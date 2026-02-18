import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {},
  palette: {
    primary: {
      main: "#A29BFE",
    },
  },
  components: {
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
            borderRadius: "24px",
          },
          "& .MuiInputBase-input": {
            padding: "6px 16px",
          },
        },
      },
      defaultProps: {
        variant: "outlined",
      },
    },
  },
});

export default theme;
