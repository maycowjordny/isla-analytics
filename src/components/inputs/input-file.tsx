import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type InputFileProps = {
  label?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  buttonLabel?: string;
  onFileSelect?: (files: FileList | null) => void;
  onUpload?: () => void;
};

export function InputFile({
  label = "Arquivo CSV",
  accept = ".csv,text/csv",
  multiple = false,
  disabled = false,
  buttonLabel = "Upload CSV",
  onFileSelect,
  onUpload,
}: InputFileProps) {
  return (
    <Field orientation="horizontal">
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <Input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => onFileSelect?.(e.target.files)}
        />
        <Button onClick={onUpload} disabled={disabled}>
          {buttonLabel}
        </Button>
      </FieldContent>
    </Field>
  );
}
