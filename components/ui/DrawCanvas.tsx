// @ts-nocheck
"use client";
import React, { useEffect } from "react";
import { useCanvas } from "@/hooks/CanvasContext";
import { ScrollArea } from "./scroll-area";

function CanvasInternal() {
  const { canvasRef, prepareCanvas } = useCanvas();

  useEffect(() => {
    prepareCanvas();
  }, []);

  return (
    <ScrollArea className="h-screen">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </ScrollArea>
  );
}

export function Canvas() {
  return (
    <>
      <CanvasInternal />
    </>
  );
}
