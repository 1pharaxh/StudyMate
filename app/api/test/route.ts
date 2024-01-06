import { NextResponse } from "next/server";
// IMPORTANT: THIS IS HOW YOU MAKE AN API : https://www.youtube.com/watch?v=O-NGENb6LNg
const url: string =
  "https://firebasestorage.googleapis.com/v0/b/hacked-2024-bucket.appspot.com/o/files%2Fresume_akarshan_mishra.pdf?alt=media&token=40b03f6c-16d1-4d4e-94e1-42dff456c9c9";

export const GET = async (req: Request, res: Response) => {
  return NextResponse.json({ message: "Hello from the API!" });
};

export const POST = async (req: Request, res: Response) => {
  const body = await req.json();
  if (!body) {
    return NextResponse.json({ message: "no body!" });
  }
  return NextResponse.json({ message: "Hello from the API!", body });
};
