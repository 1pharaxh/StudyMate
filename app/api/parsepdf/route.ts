import { NextResponse } from "next/server";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";

// IMPORTANT: THIS IS HOW YOU MAKE AN API : https://www.youtube.com/watch?v=O-NGENb6LNg
type docs = {
  Document: {
    pageContent: string[];
  };
};
async function loadPDF(url: string | URL | Request): Promise<any> {
  const response = await fetch(url);
  const data = await response.blob();
  const loader = new WebPDFLoader(data);
  const docs = await loader.load();
  console.log({ docs });
  return docs;
}
export const GET = async (req: Request, res: Response) => {
  const urlString: string =
    "https://firebasestorage.googleapis.com/v0/b/hacked-2024-bucket.appspot.com/o/files%2Fresume_akarshan_mishra.pdf?alt=media&token=40b03f6c-16d1-4d4e-94e1-42dff456c9c9";
  const url = new URL(urlString);
  const docs = await loadPDF(url);

  return NextResponse.json({ message: "Test Parse", docs });
};

export const POST = async (req: Request, res: Response) => {
  const body = await req.json();
  if (!body) {
    return NextResponse.json({ message: "no body!" });
  }
  const { url } = body;
  const docs = await loadPDF(url);
  return NextResponse.json({ message: docs });
};
