import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const MAX_CATEGORIES = 4;

export default function CategoryLoading() {
  return (
    <Box component="section" sx={{ width: "100%", px: 0, py: 4 }}>
      <Typography variant="header" sx={{ mb: 3, fontWeight: 700 }}>
        Danh mục
      </Typography>
      <Grid container spacing={2.5}>
        {Array.from(new Array(MAX_CATEGORIES)).map((_, idx) => (
          <Grid key={idx} size={{ xs: 6, md: 3 }}>
            <Skeleton variant="rounded" height={80} sx={{ borderRadius: "12px" }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
