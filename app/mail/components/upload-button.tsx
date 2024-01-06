"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadButtonProps {
  isCollapsed: boolean;
  onUpload: (file: File) => void;
}

export function UploadButton({ isCollapsed, onUpload }: UploadButtonProps) {
  const [fileName, setFileName] = React.useState<string | null>(null);

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => {
        document.getElementById("upload_file_input")?.click();
      }}
    >
      <Upload className="h-4 w-4" />
      {!isCollapsed && (
        <span className="ml-2">{fileName ? fileName : "Upload a pdf"}</span>
      )}
      <input
        type="file"
        id="upload_file_input"
        className="hidden"
        onChange={(e: any) => {
          const file = e.target.files[0];
          setFileName(file?.name); // This sets the file name when a file is uploaded
          onUpload(file);
        }}
      />
    </Button>
  );
}
