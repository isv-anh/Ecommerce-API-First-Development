import VisuallyHiddenInput from "@/components/inputs/VisuallyHiddenInput/VisuallyHiddenInput";
import useUpload from "@/hooks/useUpload";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import type { ImagePickerProps } from "@/components/inputs/ImagePicker/types";
import type { FieldValues } from "react-hook-form";
import { useRef } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ImagePicker = <TField extends FieldValues>({
  field,
  fieldError,
  setError,
  multiple = false,
  setImages,
}: ImagePickerProps<TField>) => {
  const { handleUpload, isUploading, uploadError } = useUpload();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // validate type
    const invalidType = files.some((file) => !file.type.startsWith("image/"));

    if (invalidType) {
      setError?.(field.name, {
        message: "Chỉ được chọn file hình ảnh",
      });
      return;
    }

    // validate size
    const invalidSize = files.some((file) => file.size > MAX_FILE_SIZE);

    if (invalidSize) {
      setError?.(field.name, {
        message: "Kích thước file không được vượt quá 5MB",
      });
      return;
    }

    try {
      const urls = await handleUpload(files);

      if (!urls) return;

      if (multiple) {
        setImages?.(urls);
      } else {
        field.onChange(urls[0]);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  if (uploadError) {
    return (
      <Typography color="error">Lỗi tải lên: {uploadError.message}</Typography>
    );
  }

  return (
    <>
      <Box
        onClick={() => inputRef.current?.click()}
        sx={{
          width: 60,
          height: 60,
          border: "2px dashed",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        {isUploading ? (
          <CircularProgress aria-label="Loading…" size={30} />
        ) : (
          <AddPhotoAlternateIcon
            sx={{ fontSize: 30, color: "action.active" }}
          />
        )}
      </Box>

      <VisuallyHiddenInput
        ref={inputRef}
        type="file"
        multiple={multiple}
        max={10}
        onChange={handleFileChange}
        accept="image/*"
      />

      {fieldError && (
        <Typography color="error">{fieldError.message}</Typography>
      )}
    </>
  );
};

export default ImagePicker;
