import type { UploadImageViewerProps } from "@/components/data-display/UploadImageViewer/types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";

const defaultSize = 100;

const UploadImageViewer = ({
  url,
  width,
  height,
  onDelete,
}: UploadImageViewerProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: width || defaultSize,
        height: height || defaultSize,
        borderRadius: 2,
        overflow: "hidden",

        "&:hover .delete-overlay": {
          opacity: 1,
        },
      }}
    >
      <Image
        src={url}
        alt="Thumbnail"
        width={width || defaultSize}
        height={height || defaultSize}
        style={{
          objectFit: "cover",
        }}
      />

      <Box
        className="delete-overlay"
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          transition: "opacity 0.2s ease",
          cursor: "pointer",
        }}
        onClick={() => {
          onDelete();
        }}
      >
        <Typography color="white">Xóa</Typography>
      </Box>
    </Box>
  );
};

export default UploadImageViewer;
