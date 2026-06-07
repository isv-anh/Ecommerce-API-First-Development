import useFabs from "@/components/inputs/Fabs/provider/hooks/useFabs";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import NextLink from "next/link";

const Fabs = () => {
  const { fabs } = useFabs();
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        display: "flex",
        flexDirection: "row",
        gap: 1,
        zIndex: (theme) => theme.zIndex.fab,
      }}
    >
      {fabs.map((fab, index) => {
        if (fab.type === "back") {
          return (
            <Fab
              LinkComponent={NextLink}
              href={fab.href}
              variant="extended"
              key={index}
              color="default"
              aria-label={fab.label ?? "Quay lại"}
            >
              {fab.label ?? "Quay lại"}
            </Fab>
          );
        } else {
          return (
            <Fab
              variant="extended"
              key={index}
              color="primary"
              aria-label={fab.label}
              onClick={fab.onClick}
            >
              {fab.label}
            </Fab>
          );
        }
      })}
    </Box>
  );
};

export default Fabs;
