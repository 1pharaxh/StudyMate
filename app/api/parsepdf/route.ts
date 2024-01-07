import { NextResponse } from "next/server";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import { OpenAI } from "openai";

// IMPORTANT: THIS IS HOW YOU MAKE AN API : https://www.youtube.com/watch?v=O-NGENb6LNg
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadPDF(url: string | URL | Request): Promise<any> {
  const response = await fetch(url);
  const data = await response.blob();
  const loader = new WebPDFLoader(data);
  const docs = await loader.load();
  return docs;
}
let prev = 0;
async function SendToAI(book: String, notes: String): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI, // This is also the default, can be omitted
  });
  await delay(5000); // Add a 5-second delay to prevent rate limit
  prev += 1;
  console.log("AI RESPONSE COUNTER", prev);
  // New
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `You are a learning assistant. Your only job is to help students fix their notes ONLY IF THE NOTES ARE FUNDAMENTALLY WRONG.
        Given the book and the notes YOU CAN ONLY ANSWER with an array of 0 to multiple objects using the JSON FORMAT. Each object has the key read = false by default and follows the schema of
        [{ fixTitle: '', incorrectLineFromNotes: '', whatToFix: '', read:false}...]. If a particular notes comes close to the original concept in any sense then you should not give any suggestions for that note, also please no elaborations. Now given the book and notes return the suggestions array 
        
        Book: ${book}
        Notes: ${notes}`,
      },
    ],
  });
  console.log(chatCompletion.usage);
  return chatCompletion.choices[0].message.content !== null
    ? chatCompletion.choices[0].message.content
    : "No response from AI";
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
  const { pdfurl, userText } = body;
  if (!pdfurl || !userText || userText === "Draw your math below") {
    return NextResponse.json({
      message: "no pdfurl or userText!",
    });
  }
  const docs = await loadPDF(pdfurl);
  let pageContent = "";
  const filteredUserText = userText
    .replace(/(\r\n|\n|\r)/gm, " ")
    .replace(/ +/g, " ");
  docs.forEach((doc: any) => {
    pageContent += doc.pageContent;
  });
  pageContent = pageContent.replace(/(\r\n|\n|\r)/gm, " ").replace(/ +/g, " ");
  const aiMessage = await SendToAI(pageContent, filteredUserText);
  const aiMessageJSON = JSON.parse(aiMessage);
  console.log(aiMessageJSON);
  return NextResponse.json({
    ai_response: aiMessageJSON,
    userText: filteredUserText,
    pdfcontent: pageContent,
  });
};
