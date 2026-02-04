import { InputFile } from "@/components/inputs/input-file";
import { useState } from "react";
import { api } from "./services/api";

function App() {
  const [files, setFiles] = useState<FileList | null>(null);

  async function handleUpload() {
    if (!files?.[0]) return;

    const form = new FormData();
    form.append("file", files[0]);

    const response = await api.post("/import-linkedin-csv", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Upload response:", response.data);
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <InputFile
        label="CSV do LinkedIn"
        onFileSelect={setFiles}
        onUpload={handleUpload}
        buttonLabel="Enviar CSV"
      />
    </div>
  );
}

export default App;
