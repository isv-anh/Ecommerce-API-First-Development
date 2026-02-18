import { CssBaseline } from "@mui/material";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import Providers from "../src/app/Providers";
import { Preview } from "@storybook/nextjs";
import { initialize, mswLoader } from "msw-storybook-addon";
initialize();

const preview: Preview = {
  loaders: [mswLoader],
  decorators: [
    withThemeFromJSXProvider({
      Provider: Providers,
      GlobalStyles: CssBaseline,
    }),
  ],
  parameters: {
    layout: "centered",
  },
};

export default preview;
