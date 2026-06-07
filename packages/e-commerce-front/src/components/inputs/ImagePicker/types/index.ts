import type {
  ControllerRenderProps,
  FieldError,
  FieldValues,
  UseFormSetError,
} from "react-hook-form";

export type CommonProps<TField extends FieldValues> = {
  field: ControllerRenderProps<TField>;
  fieldError?: FieldError;
  setError?: UseFormSetError<TField>;
};

type MultipleImagePickerProps<TField extends FieldValues> =
  CommonProps<TField> & {
    multiple: true;
    setImages: (urls: string[]) => void;
  };

type SingleImagePickerProps<TField extends FieldValues> =
  CommonProps<TField> & {
    multiple?: false;
    setImages?: never;
  };

export type ImagePickerProps<TField extends FieldValues> =
  | MultipleImagePickerProps<TField>
  | SingleImagePickerProps<TField>;
