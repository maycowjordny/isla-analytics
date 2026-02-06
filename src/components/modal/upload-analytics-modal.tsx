import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lightbulb, Upload } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

type UploadModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => Promise<void>;
};

export function UploadAnalyticsModal({
  isOpen,
  onOpenChange,
  onUpload,
}: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const ext = droppedFile.name.split(".").pop()?.toLowerCase();
      if (ext === "csv" || ext === "xlsx") {
        setFile(droppedFile);
      } else {
        toast.error("Formato inválido. Envie um arquivo CSV ou Excel.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Selecione um arquivo CSV antes de enviar.");
      return;
    }

    if (file.size === 0) {
      toast.error("O CSV está vazio. Envie um arquivo com dados válidos.");
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(file);
      onOpenChange(false);
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-5 sm:p-8 rounded-4xl border-none w-full max-w-[90vw] sm:max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-auto">
        <DialogHeader className="space-y-0.5 sm:space-y-1">
          <DialogTitle className="text-lg sm:text-2xl font-semibold text-slate-800">
            Check and Upload LinkedIn weekly analytics
          </DialogTitle>
          <DialogDescription className="sm:hidden text-sm sm:text-base text-slate-500 leading-relaxed">
            Share your LinkedIn data to get personalized insights
          </DialogDescription>
        </DialogHeader>
        <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-xl p-3 sm:p-4 flex gap-3 items-start my-4 sm:my-6">
          <Lightbulb className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
          <p className="text-[#92400E] text-sm leading-relaxed">
            Don't overthink it. We're looking for:{" "}
            <span className="font-medium">
              impressions, clicks, follows, and top posts.
            </span>
          </p>
        </div>
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <h4 className="font-semibold text-slate-800 text-base sm:text-lg">
            How to export your Analytics
          </h4>
          <ol className="space-y-2.5 sm:space-y-3 text-slate-600 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="font-medium">1.</span>
              <span>
                Open your{" "}
                <a
                  href="https://www.linkedin.com/analytics/creator/content/?timeRange=past_7_days&metricType=IMPRESSIONS"
                  className="text-cyan-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn Creator Analytics
                </a>{" "}
                page
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium">2.</span>
              <span>Click the "Export" button to download your analytics</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium">3.</span>
              <span>Upload the downloaded file below</span>
            </li>
          </ol>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group relative border-2 border-dashed rounded-2xl p-4 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 ${
            isDragging
              ? "border-cyan-400 bg-cyan-50/50"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
          />
          <Upload className="w-6 h-6 sm:w-10 sm:h-10 text-slate-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-slate-700 font-medium text-xs sm:text-base text-center">
            {file ? file.name : "Click to upload or drag and drop"}
          </p>
          <p className="text-slate-400 text-[9px] sm:text-xs mt-1 text-center">
            CSV or Excel files (max 10MB)
          </p>
        </div>

        <p className="text-center text-[8px] sm:text-[10px] text-slate-400 mt-3 sm:mt-4">
          We only use this data to generate insights for your dashboard.
        </p>
        <div className="flex justify-center mt-6 sm:mt-8">
          <Button
            onClick={handleSubmit}
            disabled={!file || isUploading}
            className="px-7 sm:px-12 py-3.5 sm:py-6 rounded-xl text-sm sm:text-base font-medium transition-all min-w-36 sm:min-w-60"
          >
            {isUploading ? "Uploading..." : "Submit Analytics File"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
