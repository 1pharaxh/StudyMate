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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export const ClearCanvasButton = () => {
  const { clearCanvas, strokes } = useCanvas();
  const handleClick = () => {
    clearCanvas(false);
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          disabled={strokes.length === 0}
        >
          <Delete className="h-4 w-4" />
          <span className="sr-only">Clear canvas</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Clear canvas</TooltipContent>
    </Tooltip>
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
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          disabled={undoHistory.length === 0}
        >
          <Undo className="h-4 w-4" />
          <span className="sr-only">Undo drawing</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Undo drawing</TooltipContent>
    </Tooltip>
  );
};

export const RedoButton = () => {
  const { redoHistory, redo } = useCanvas();
  const handleClick = () => {
    redo();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          disabled={redoHistory.length === 0}
        >
          <Redo className="h-4 w-4" />
          <span className="sr-only">Redo drawing</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Undo drawing</TooltipContent>
    </Tooltip>
  );
};

export const CopyToClipboardButton = () => {
  const { latex } = useCanvas();
  const handleClick = () => {
    navigator.clipboard.writeText(latex.code);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={latex.isPlaceholder}
          onClick={handleClick}
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy text</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy Text</TooltipContent>
    </Tooltip>
  );
};
