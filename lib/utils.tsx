// @ts-nocheck
"use client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useCanvas } from "@/hooks/CanvasContext";
import { Copy, Delete, Redo, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ClearCanvasButton = () => {
  const { clearCanvas, strokes } = useCanvas();
  const handleClick = () => {
    clearCanvas(false);
  };
  return (
    <>
      <Button
        onClick={handleClick}
        disabled={strokes.length === 0}
        variant="outline"
      >
        <Delete className="h-6 w-6" />
      </Button>
    </>
  );
};

export const LatexRenderer = () => {
  const { latex } = useCanvas();
  return <div className="flex items-center justify-center">{latex.code}</div>;
};

export const UndoButton = () => {
  const { undoHistory, undo } = useCanvas();
  const handleClick = () => {
    undo();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={undoHistory.length === 0}
        variant="outline"
      >
        <Undo className="h-6 w-6" />
      </Button>
    </>
  );
};

export const RedoButton = () => {
  const { redoHistory, redo } = useCanvas();
  const handleClick = () => {
    redo();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={redoHistory.length === 0}
        variant="outline"
      >
        <Redo className="h-6 w-6" />
      </Button>
    </>
  );
};

export const CopyToClipboardButton = () => {
  const { latex } = useCanvas();
  const handleClick = () => {
    navigator.clipboard.writeText(latex.code);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={latex.isPlaceholder}
        variant="outline"
      >
        <Copy className="h-6 w-6" />
      </Button>
    </>
  );
};
