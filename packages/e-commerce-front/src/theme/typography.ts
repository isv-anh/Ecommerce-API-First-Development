import type { ThemeOptions } from "@mui/material/styles";

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

export const typography: ThemeOptions["typography"] = {
  // use same keys as your theme augmentation (title, subtitle, header, regularS...)
  title: { fontSize: "24px", fontWeight: 600, lineHeight: 1.25 },
  header: { fontSize: "20px", fontWeight: 500, lineHeight: 1.3 },
  subtitle: { fontSize: "16px", fontWeight: 400, lineHeight: 1.4 },

  regularXxs: { fontSize: "10px", fontWeight: 400 },
  regularXs: { fontSize: "12px", fontWeight: 400 },
  regularS: { fontSize: "14px", fontWeight: 400 },
  regularM: { fontSize: "16px", fontWeight: 400 },
  regularL: { fontSize: "18px", fontWeight: 400 },

  boldXs: { fontSize: "12px", fontWeight: 700 },
  boldS: { fontSize: "14px", fontWeight: 700 },
  boldM: { fontSize: "16px", fontWeight: 700 },
  boldL: { fontSize: "18px", fontWeight: 700 },
};
