import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";

const SKELETON_ITEMS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function Loading() {
  return (
    <Grid container spacing={1.5}>
      {SKELETON_ITEMS.map((key) => (
        <Grid key={key} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
          <Card
            sx={{
              height: "100%",
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(21, 20, 38, 0.04)",
            }}
          >
            <Box
              sx={{
                aspectRatio: "4/3",
                position: "relative",
                overflow: "hidden",
                bgcolor: "#f5f3ff",
              }}
            >
              <Skeleton variant="rectangular" width="100%" height="100%" />
            </Box>
            <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
              <Stack spacing={1.25}>
                <Stack spacing={0.5}>
                  <Skeleton variant="text" width="90%" height={24} />
                  <Skeleton variant="text" width="70%" height={24} />
                </Stack>
                <Stack spacing={0.25}>
                  <Skeleton variant="text" width="50%" height={28} />
                  <Skeleton variant="text" width="30%" height={16} />
                </Stack>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={36}
                  sx={{ borderRadius: 1.5 }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
