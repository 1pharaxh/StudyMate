"use client";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMail } from "@/app/use-mail";
import { CheckCheck, X } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
type Suggestions = {
  id: string;
  fixTitle: string;
  incorrectLineFromNotes: string;
  whatToFix: string;
  read?: boolean;
};
interface MailListProps {
  items: Suggestions[];
  setSuggestions: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        fixTitle: string;
        incorrectLineFromNotes: string;
        whatToFix: string;
        read: boolean;
      }[]
    >
  >;
}

export function MailList({ items, setSuggestions }: MailListProps) {
  const [mail, setMail] = useMail();
  console.log(items);
  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0 h-full w-full">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                mail.selected ===
                  item.fixTitle +
                    item.incorrectLineFromNotes +
                    item.whatToFix && "bg-muted"
              )}
              onClick={() =>
                setMail({
                  ...mail,
                  selected:
                    item.fixTitle +
                    item.incorrectLineFromNotes +
                    item.whatToFix,
                })
              }
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.fixTitle}</div>
                    {!item.read && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "ml-auto text-xs",
                      mail.selected ===
                        item.fixTitle +
                          item.incorrectLineFromNotes +
                          item.whatToFix
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {item.read ? (
                          <Button
                            onClick={() => {
                              // match the selected item with the item in the array and then change the read property to true
                              setSuggestions((prev) => {
                                return prev.map((suggestion) => {
                                  if (
                                    suggestion.fixTitle +
                                      suggestion.incorrectLineFromNotes +
                                      suggestion.whatToFix ===
                                    item.fixTitle +
                                      item.incorrectLineFromNotes +
                                      item.whatToFix
                                  ) {
                                    suggestion.read = false;
                                  }
                                  return suggestion;
                                });
                              });
                            }}
                            variant="outline"
                            size="icon"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              // match the selected item with the item in the array and then change the read property to true
                              setSuggestions((prev) => {
                                return prev.map((suggestion) => {
                                  if (
                                    suggestion.fixTitle +
                                      suggestion.incorrectLineFromNotes +
                                      suggestion.whatToFix ===
                                    item.fixTitle +
                                      item.incorrectLineFromNotes +
                                      item.whatToFix
                                  ) {
                                    suggestion.read = true;
                                  }
                                  return suggestion;
                                });
                              });
                            }}
                            variant="outline"
                            size="icon"
                          >
                            <CheckCheck className="h-5 w-5" />
                          </Button>
                        )}
                      </TooltipTrigger>
                      <TooltipContent>Move to solved</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <div className="text-xs font-medium underline underline-offset-2 decoration-red-500 decoration-2">
                  {item.incorrectLineFromNotes}
                </div>
              </div>

              <div
                className={`${
                  mail.selected ===
                  item.fixTitle + item.incorrectLineFromNotes + item.whatToFix
                    ? ""
                    : " line-clamp-2 "
                } text-xs text-muted-foreground 
              transition-all ease-in-out duration-300
              `}
              >
                {mail.selected ===
                item.fixTitle + item.incorrectLineFromNotes + item.whatToFix
                  ? item.whatToFix
                  : item.whatToFix.substring(0, 300)}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 h-full w-full">
            <div className="text-2xl font-bold">No Suggestions</div>
            <div className="text-sm text-muted-foreground">
              There are no suggestions for this assignment.
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
