"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import Box from "@mui/material/Box";
import type { RichTextEditorProps } from "@/components/inputs/RichTextEditor/types";

const RichTextEditor = ({
  value,
  onChange,
  onImageUpload,
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    fileInput.multiple = true;
    fileInput.max = "10";
    document.body.appendChild(fileInput);
    fileInputRef.current = fileInput;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Nhập nội dung...",
      modules: {
        toolbar: {
          container: [
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- quill toolbar config
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            ["link", "image"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
          ],
          handlers: {
            image: () => {
              fileInput.click();
            },
          },
        },
      },
    });

    quillRef.current = quill;

    fileInput.addEventListener("change", async () => {
      const files = fileInput.files;
      if (!files || files.length === 0) return;

      const range = quill.getSelection(true);
      try {
        if (onImageUpload) {
          const urls = await onImageUpload(Array.from(files));
          if (urls) {
            urls.forEach((url, index) => {
              quill.insertEmbed(range.index + index, "image", url);
            });
            quill.setSelection(range.index + urls.length);
          }
        } else {
          const readFile = (file: File): Promise<string> =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });

          const base64List = await Promise.all(Array.from(files).map(readFile));

          base64List.forEach((base64, index) => {
            quill.insertEmbed(range.index + index, "image", base64);
          });
          quill.setSelection(range.index + base64List.length);
        }
      } finally {
        fileInput.value = "";
      }
    });

    // Render initial html
    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }

    // Sync change
    quill.on("text-change", () => {
      onChange(quill.root.innerHTML);
    });

    // Cleanup
    return () => {
      document.body.removeChild(fileInput);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value change
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    if (value !== quill.root.innerHTML) {
      quill.clipboard.dangerouslyPasteHTML(value || "");
    }
  }, [value]);

  return (
    <Box
      component="div"
      ref={editorRef}
      style={{ height: 600 }}
      sx={{
        "& .ql-tooltip": { zIndex: 1400 },
      }}
    />
  );
};

export default RichTextEditor;
