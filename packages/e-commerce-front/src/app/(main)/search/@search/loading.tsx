import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function SearchLoading() {
  return (
    <Stack spacing={3} width="100%">
      {/* FilterBar Skeleton */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton
            variant="rectangular"
            width={120}
            height={40}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width={120}
            height={40}
            sx={{ borderRadius: 2 }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton
            variant="rectangular"
            width={180}
            height={40}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width={100}
            height={40}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </Box>
    </Stack>
  );
}
