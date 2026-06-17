import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";

interface SectionLayoutProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  elevation?: number;
}

const SectionLayout = ({
  title,
  subtitle,
  children,
  elevation = 1,
}: SectionLayoutProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
      }}
    >
      <Paper
        elevation={elevation}
        sx={{
          borderRadius: 2,
          backgroundColor: "background.paper",
          p: 2,
        }}
      >
        {(title || subtitle) && (
          <Box mb={3}>
            {title && (
              <Typography variant="subtitle" fontWeight={600} gutterBottom>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="subtitle" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}

        {children}
      </Paper>
    </Box>
  );
};

export default SectionLayout;
