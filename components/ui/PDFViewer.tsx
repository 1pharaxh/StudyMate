"use client";
import { Expand, File } from "lucide-react";
import React, { useEffect } from "react";

type Props = {
  pdf_url: string;
  isCollapsed: boolean;
};

const PDFViewer = ({ pdf_url, isCollapsed }: Props) => {
  const [errorText, setErrorText] = React.useState<string>("");
  useEffect(() => {
    if (
      (pdf_url === "" || pdf_url === undefined || pdf_url === null) &&
      !isCollapsed
    ) {
      setErrorText("No file uploaded");
    } else if (isCollapsed) {
      setErrorText("a");
    } else {
      setErrorText("");
    }
  }, [pdf_url, isCollapsed]);
  return (
    <div className="h-full w-full">
      {errorText ? (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full">
            {isCollapsed ? (
              <Expand className="w-8 h-8" />
            ) : (
              <File className="w-8 h-8" />
            )}
          </div>
          <p className="">{errorText === "a" ? "" : errorText}</p>
        </div>
      ) : (
        <embed
          src={pdf_url}
          type="application/pdf"
          width="100%"
          height="100%"
          style={{ minHeight: "calc(100vh - 52px)" }}
        />
      )}
    </div>
  );
};

export default PDFViewer;
