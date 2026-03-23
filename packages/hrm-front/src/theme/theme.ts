/* eslint-disable @typescript-eslint/no-magic-numbers */
import { alpha, createTheme, Shadows } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeText {
    white: string;
  }

  interface TypographyVariants {
    title: React.CSSProperties;
    subtitle: React.CSSProperties;
    header: React.CSSProperties;
    regularXxs: React.CSSProperties;
    regularXs: React.CSSProperties;
    regularS: React.CSSProperties;
    regularM: React.CSSProperties;
    regularL: React.CSSProperties;
    boldXs: React.CSSProperties;
    boldS: React.CSSProperties;
    boldM: React.CSSProperties;
    boldL: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    title?: React.CSSProperties;
    subtitle?: React.CSSProperties;
    header?: React.CSSProperties;
    regularXxs?: React.CSSProperties;
    regularXs?: React.CSSProperties;
    regularS?: React.CSSProperties;
    regularM?: React.CSSProperties;
    regularL?: React.CSSProperties;
    boldXs?: React.CSSProperties;
    boldS?: React.CSSProperties;
    boldM?: React.CSSProperties;
    boldL?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    h1: false;
    h2: false;
    h3: false;
    h4: false;
    h5: false;
    h6: false;
    subtitle1: false;
    subtitle2: false;
    body1: false;
    body2: false;
    button: false;
    caption: false;
    overline: false;

    title: true;
    subtitle: true;
    header: true;
    regularXxs: true;
    regularXs: true;
    regularS: true;
    regularM: true;
    regularL: true;
    boldXs: true;
    boldS: true;
    boldM: true;
    boldL: true;
  }
}

const createPrimaryShadow = (mainColor: string): Shadows => {
  return [
    "none",
    `0px 1px 2px ${alpha(mainColor, 0.12)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 1px 4px ${alpha(mainColor, 0.14)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 2px 6px ${alpha(mainColor, 0.16)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 2px 8px ${alpha(mainColor, 0.18)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 3px 10px ${alpha(mainColor, 0.2)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 4px 12px ${alpha(mainColor, 0.22)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 4px 14px ${alpha(mainColor, 0.24)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 5px 16px ${alpha(mainColor, 0.26)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 6px 18px ${alpha(mainColor, 0.28)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 6px 20px ${alpha(mainColor, 0.3)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 7px 22px ${alpha(mainColor, 0.32)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 8px 24px ${alpha(mainColor, 0.34)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 8px 26px ${alpha(mainColor, 0.36)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 9px 28px ${alpha(mainColor, 0.38)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 10px 30px ${alpha(mainColor, 0.4)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 10px 32px ${alpha(mainColor, 0.42)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 11px 34px ${alpha(mainColor, 0.44)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 12px 36px ${alpha(mainColor, 0.46)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 12px 38px ${alpha(mainColor, 0.48)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 13px 40px ${alpha(mainColor, 0.5)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 14px 42px ${alpha(mainColor, 0.52)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 14px 44px ${alpha(mainColor, 0.54)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 15px 46px ${alpha(mainColor, 0.56)}, 0px 2px 6px rgba(0,0,0,0.05)`,
    `0px 16px 48px ${alpha(mainColor, 0.58)}, 0px 2px 6px rgba(0,0,0,0.05)`,
  ];
};

const theme = createTheme({
  shadows: createPrimaryShadow("#9B5DE0"),
  typography: {
    title: {
      fontSize: "24px",
      fontWeight: 600,
    },
    subtitle: {
      fontSize: "16px",
      fontWeight: 400,
    },
    header: {
      fontSize: "20px",
      fontWeight: 500,
    },
    regularXxs: {
      fontSize: "10px",
      fontWeight: 400,
    },
    regularXs: {
      fontSize: "12px",
      fontWeight: 400,
    },
    regularS: {
      fontSize: "14px",
      fontWeight: 400,
    },
    regularM: {
      fontSize: "16px",
      fontWeight: 400,
    },
    regularL: {
      fontSize: "18px",
      fontWeight: 400,
    },
    boldXs: {
      fontSize: "12px",
      fontWeight: 700,
    },
    boldS: {
      fontSize: "14px",
      fontWeight: 700,
    },
    boldM: {
      fontSize: "16px",
      fontWeight: 700,
    },
    boldL: {
      fontSize: "18px",
      fontWeight: 700,
    },
  },
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

        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "#C77DFF",
          borderRadius: "8px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "12px",
        },
        outlined: {
          borderWidth: 2,
        },
        text: ({ theme, ownerState }) => {
          const color = ownerState.color;

          let paletteColor: string;

          if (!color) {
            paletteColor = theme.palette.action.active;
          } else if (color === "inherit") {
            return {
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            };
          } else {
            paletteColor = theme.palette[color].main;
          }
          return {
            "&:hover": {
              backgroundColor: alpha(paletteColor, 0.12),
            },
          };
        },
      },
      defaultProps: {
        variant: "outlined",
        size: "medium",
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
    MuiTypography: {
      defaultProps: {
        variant: "regularS",
        variantMapping: {
          title: "h1",
          subtitle: "h2",
          header: "h3",
          regularS: "p",
          regularM: "p",
          regularL: "p",
          regularXs: "p",
          regularXxs: "p",
          boldS: "p",
          boldM: "p",
          boldL: "p",
          boldXs: "p",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          const color = ownerState.color;

          let paletteColor: string;

          if (!color || color === "default") {
            paletteColor = theme.palette.action.active;
          } else if (color === "inherit") {
            return {
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            };
          } else {
            paletteColor = theme.palette[color].main;
          }

          return {
            borderRadius: 12,

            '&[data-active="true"]': {
              backgroundColor: alpha(paletteColor, 0.08),
            },

            "&:hover": {
              backgroundColor: alpha(paletteColor, 0.12),
            },
          };
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
      defaultProps: {
        elevation: 6,
      },
    },
  },
});

export default theme;
