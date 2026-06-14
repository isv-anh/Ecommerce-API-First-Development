export type RichTextEditorProps = {
  value?: string | null;
  onChange: (value: string) => void;
  onImageUpload?: (files: File[]) => Promise<string[] | null>;
};
