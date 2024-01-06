"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";
import { Mail } from "@/app/mail/data";
import { useDraw } from "@/hooks/useDraw";
import { useState } from "react";
import { Canvas } from "@/components/ui/DrawCanvas";
import {
  ClearCanvasButton,
  CopyToClipboardButton,
  RedoButton,
  UndoButton,
} from "@/lib/utils";

interface MailDisplayProps {
  mail: Mail | null;
}

export function MailDisplay({ mail }: MailDisplayProps) {
  const today = new Date();
  const [color, setColor] = useState<string>("#000");
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine);

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <ClearCanvasButton />
          <CopyToClipboardButton />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <UndoButton />
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <RedoButton />
      </div>
      <Separator />
      <div className="flex flex-1 flex-col">
        <div className="flex items-start p-4">
          <div className="flex items-start gap-4 text-sm">
            <Avatar>
              <AvatarImage alt={"Student Name"} />
              <AvatarFallback>
                {"Student Name"
                  .split(" ")
                  .map((chunk) => chunk[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="font-semibold">{"Student Name"}</div>
              <div className="line-clamp-1 text-xs">{"Name of class"}</div>
              <div className="line-clamp-1 text-xs">
                <span className="font-medium">Joined </span>{" "}
                <span className="decoration-blue-500 decoration-1 underline">
                  {" "}
                  {"Professor Name"}
                </span>
                's class
              </div>
            </div>
          </div>

          <div className="ml-auto text-xs text-muted-foreground">
            40 minutes (length of class)
          </div>
        </div>
        <Separator />
        <div className="flex-1 whitespace-pre-wrap">
          {/* {mail.text} */}
          <Canvas />
        </div>
      </div>
    </div>
  );
}
