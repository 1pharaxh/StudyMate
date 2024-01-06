// @ts-nocheck
"use client";
import React, { useEffect } from "react";
import {
  ClearCanvasButton,
  LatexRenderer,
  UndoButton,
  RedoButton,
  CopyToClipboardButton,
} from "@/lib/utils";
import { useCanvas } from "@/hooks/CanvasContext";

function CanvasInternal() {
  const { canvasRef, prepareCanvas } = useCanvas();

  useEffect(() => {
    prepareCanvas();
  }, []);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} className="canvas" />
    </div>
  );
}

export function Canvas() {
  return (
    <>
      <LatexRenderer />
      <div className="canvas-buttons-container">
        <ClearCanvasButton />
        <UndoButton />
        <RedoButton />
        <CopyToClipboardButton />
      </div>
      <CanvasInternal />
    </>
  );
}
