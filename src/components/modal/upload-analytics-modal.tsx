import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lightbulb, Upload } from "lucide-react";
import React, { useState } from "react";
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
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
      <DialogContent className="sm:max-w-160 p-8 rounded-4xl border-none">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-semibold text-slate-800">
            Check and Upload LinkedIn weekly analytics
          </DialogTitle>
          <DialogDescription className="text-base text-slate-500">
            Share your LinkedIn data to get personalized insights
          </DialogDescription>
        </DialogHeader>
        <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-xl p-4 flex gap-3 items-start my-6">
          <Lightbulb className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
          <p className="text-[#92400E] text-sm">
            Don't overthink it. We're looking for:{" "}
            <span className="font-medium">
              impressions, clicks, follows, and top posts.
            </span>
          </p>
        </div>
        <div className="space-y-4 mb-8">
          <h4 className="font-semibold text-slate-800">
            How to export your Analytics
          </h4>
          <ol className="space-y-3 text-slate-600 text-sm">
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
        <label className="group relative border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-slate-300 transition-colors bg-slate-50/50">
          <input
            type="file"
            className="hidden"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
          />
          <Upload className="w-10 h-10 text-slate-400 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-slate-700 font-medium">
            {file ? file.name : "Click to upload or drag and drop"}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            CSV or Excel files (max 10MB)
          </p>
        </label>

        <p className="text-center text-[10px] text-slate-400 mt-4">
          We only use this data to generate insights for your dashboard.
        </p>
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleSubmit}
            disabled={!file || isUploading}
            className="px-12 py-6 rounded-xl text-base font-medium transition-all min-w-60"
          >
            {isUploading ? "Uploading..." : "Submit Analytics File"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
