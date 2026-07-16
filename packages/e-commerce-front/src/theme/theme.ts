/* eslint-disable @typescript-eslint/no-magic-numbers */
import { palette } from "@/theme/palette";
import { typography } from "@/theme/typography";
import { alpha, createTheme, type Shadows } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    primaryGradient: string;
    primaryGradientHover: string;
  }
  interface PaletteOptions {
    primaryGradient?: string;
    primaryGradientHover?: string;
  }
}

const createPrimaryShadow = (mainColor: string): Shadows => {
  return [
    "none",
    `0px 2px 4px ${alpha(mainColor, 0.08)}, 0px 4px 12px rgba(0,0,0,0.04)`,
    `0px 4px 8px ${alpha(mainColor, 0.12)}, 0px 8px 16px rgba(0,0,0,0.04)`,
    `0px 8px 16px ${alpha(mainColor, 0.16)}, 0px 12px 24px rgba(0,0,0,0.04)`,
    `0px 12px 24px ${alpha(mainColor, 0.20)}, 0px 16px 32px rgba(0,0,0,0.04)`,
    // ... we can just map the rest to a generic deep shadow for simplicity or keep it same.
    // I'll keep the same interpolation but make it slightly softer
    `0px 16px 32px ${alpha(mainColor, 0.24)}, 0px 20px 40px rgba(0,0,0,0.04)`,
    `0px 20px 40px ${alpha(mainColor, 0.28)}, 0px 24px 48px rgba(0,0,0,0.04)`,
    `0px 24px 48px ${alpha(mainColor, 0.32)}, 0px 28px 56px rgba(0,0,0,0.04)`,
    `0px 28px 56px ${alpha(mainColor, 0.36)}, 0px 32px 64px rgba(0,0,0,0.04)`,
    `0px 32px 64px ${alpha(mainColor, 0.40)}, 0px 36px 72px rgba(0,0,0,0.04)`,
    `0px 36px 72px ${alpha(mainColor, 0.42)}, 0px 40px 80px rgba(0,0,0,0.04)`,
    `0px 40px 80px ${alpha(mainColor, 0.44)}, 0px 44px 88px rgba(0,0,0,0.04)`,
    `0px 44px 88px ${alpha(mainColor, 0.46)}, 0px 48px 96px rgba(0,0,0,0.04)`,
    `0px 48px 96px ${alpha(mainColor, 0.48)}, 0px 52px 104px rgba(0,0,0,0.04)`,
    `0px 52px 104px ${alpha(mainColor, 0.50)}, 0px 56px 112px rgba(0,0,0,0.04)`,
    `0px 56px 112px ${alpha(mainColor, 0.52)}, 0px 60px 120px rgba(0,0,0,0.04)`,
    `0px 60px 120px ${alpha(mainColor, 0.54)}, 0px 64px 128px rgba(0,0,0,0.04)`,
    `0px 64px 128px ${alpha(mainColor, 0.56)}, 0px 68px 136px rgba(0,0,0,0.04)`,
    `0px 68px 136px ${alpha(mainColor, 0.58)}, 0px 72px 144px rgba(0,0,0,0.04)`,
    `0px 72px 144px ${alpha(mainColor, 0.60)}, 0px 76px 152px rgba(0,0,0,0.04)`,
    `0px 76px 152px ${alpha(mainColor, 0.62)}, 0px 80px 160px rgba(0,0,0,0.04)`,
    `0px 80px 160px ${alpha(mainColor, 0.64)}, 0px 84px 168px rgba(0,0,0,0.04)`,
    `0px 84px 168px ${alpha(mainColor, 0.66)}, 0px 88px 176px rgba(0,0,0,0.04)`,
    `0px 88px 176px ${alpha(mainColor, 0.68)}, 0px 92px 184px rgba(0,0,0,0.04)`,
    `0px 92px 184px ${alpha(mainColor, 0.70)}, 0px 96px 192px rgba(0,0,0,0.04)`,
  ] as Shadows;
};

const theme = createTheme({
  cssVariables: true,
  shadows: createPrimaryShadow("#000000"), // Monochrome shadows
  typography: typography,
  palette: palette,
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

        "*::-webkit-scrollbar-thumb": {
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
        containedPrimary: () => ({
          background: "#000000",
          color: "#ffffff",
          border: "none",
          boxShadow: "none",
          transition: "all 0.2s ease",
          "&:hover": {
            background: "#27272A", // Zinc 800
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          },
        }),
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
            borderRadius: "16px",
          },
        },
      },
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
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
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.025)",
          border: "1px solid #E5E7EB", // very thin light border
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "12px",
        },
      },
    },
  },
});

export default theme;
