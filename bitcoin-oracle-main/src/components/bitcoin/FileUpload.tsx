import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadStatus("error");
      return;
    }

    setUploadedFile(file);
    setUploadStatus("uploading");

    // Simulate upload
    setTimeout(() => {
      setUploadStatus("success");
      onFileUpload(file);
    }, 1500);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [onFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadStatus("idle");
  };

  return (
    <div className="glass-card-hover p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Upload className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Upload Bitcoin Data</h3>
          <p className="text-xs text-muted-foreground">CSV or Excel file with historical prices</p>
        </div>
      </div>

      {uploadStatus === "idle" && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border/50 hover:border-primary/50 hover:bg-secondary/30"
          }`}
        >
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
              isDragging ? "bg-primary/20" : "bg-secondary/50"
            }`}>
              <FileSpreadsheet className={`w-7 h-7 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {isDragging ? "Drop your file here" : "Drag & drop your file here"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or <span className="text-primary cursor-pointer hover:underline">browse</span> to upload
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports CSV, XLS, XLSX (max 10MB)
            </p>
          </div>
        </div>
      )}

      {uploadStatus === "uploading" && (
        <div className="border border-border/50 rounded-xl p-6 bg-secondary/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{uploadedFile?.name}</p>
              <p className="text-xs text-muted-foreground">Processing file...</p>
              <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-bitcoin-gold rounded-full animate-pulse" style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadStatus === "success" && (
        <div className="border border-success/30 rounded-xl p-6 bg-success/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{uploadedFile?.name}</p>
              <p className="text-xs text-success">Successfully uploaded • Ready for analysis</p>
            </div>
            <Button variant="ghost" size="icon" onClick={resetUpload} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {uploadStatus === "error" && (
        <div className="border border-destructive/30 rounded-xl p-6 bg-destructive/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Upload failed</p>
              <p className="text-xs text-destructive">Invalid file format. Please use CSV or Excel files.</p>
            </div>
            <Button variant="ghost" size="icon" onClick={resetUpload} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
