"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";
import { Mail } from "@/app/mail/data";
import { useDraw } from "@/hooks/useDraw";
import { Dispatch, SetStateAction, useState } from "react";
import { Canvas } from "@/components/ui/DrawCanvas";
import {
  ClearCanvasButton,
  CopyToClipboardButton,
  LatexRenderer,
  RedoButton,
  UndoButton,
} from "@/lib/utils";

interface MailDisplayProps {}

export function MailDisplay({}: MailDisplayProps) {
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
        <Canvas />
      </div>
    </div>
  );
}
