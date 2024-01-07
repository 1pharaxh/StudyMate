"use client";
import * as React from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { Search } from "lucide-react";

import { UploadButton } from "@/app/mail/components/upload-button";
import { MailDisplay } from "@/app/mail/components/mail-display";
import { MailList } from "@/app/mail/components/mail-list";
import { Mail } from "@/app/mail/data";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import PDFViewer from "@/components/ui/PDFViewer";
import { storage } from "@/hooks/firebase";
import { useCanvas } from "@/hooks/CanvasContext";
const API_REQUEST_TIMEOUT = 20000;
interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail({
  accounts,
  mails,
  defaultLayout = [550, 440, 440],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const { latex } = useCanvas();
  const [downloadURI, setDownloadURI] = React.useState("");

  // File upload function
  async function uploadFile(file: File) {
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log("Uploaded");
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => {
          setDownloadURI(downloadURL);
        });
      }
    );
  }
  React.useEffect(() => {
    console.log(latex.code);
    // Create a timer that will run every 10 seconds
    const timer = setInterval(() => {
      fetch("/api/parsepdf", {
        method: "POST",
        body: JSON.stringify({ pdfurl: downloadURI, userText: latex.code }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        response.json().then((data) => {
          console.log(data);
        });
      });
    }, API_REQUEST_TIMEOUT); // 10000 milliseconds = 10 seconds

    // Return a cleanup function that will clear the timer
    return () => {
      clearInterval(timer);
    };
  }, [latex, downloadURI]); // The dependencies are still the same

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full max-h-screen"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={400}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duratison-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px] px-2" : "px-2"
            )}
          >
            <UploadButton isCollapsed={isCollapsed} onUpload={uploadFile} />
          </div>
          <Separator />
          <PDFViewer isCollapsed={isCollapsed} pdf_url={downloadURI} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <MailDisplay />
        </ResizablePanel>

        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MailList items={mails} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList items={mails.filter((item) => !item.read)} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
