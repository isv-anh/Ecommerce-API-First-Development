import { usePostPresignedUrl } from "@e-commerce/api-client/endpoints/system";
import { useState } from "react";

const useUpload = () => {
  const postPresignedUrl = usePostPresignedUrl();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const handleUpload = async (files: File[]) => {
    try {
      setIsUploading(true);
      setUploadError(null);

      const response = await postPresignedUrl.mutateAsync({
        data: {
          files: files.map((file) => ({
            contentType: file.type,
            fileName: file.name,
          })),
        },
      });

      await Promise.all(
        response.uploads.map(async (presigned, index) => {
          const file = files[index];

          const formData = new FormData();

          Object.entries(presigned.fields as Record<string, string>).forEach(
            ([k, v]) => {
              formData.append(k, v);
            },
          );

          formData.append("file", file);

          const uploadResponse = await fetch(presigned.uploadUrl, {
            method: "POST",
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${file.name}`);
          }
        }),
      );

      return response.uploads.map((file) => file.fileUrl);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error : new Error("Upload thất bại"),
      );
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  return { handleUpload, isUploading, uploadError };
};

export default useUpload;
