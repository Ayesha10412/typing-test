import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://type.fit/api/quotes");

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid API response");
    }

    const random = data[Math.floor(Math.random() * data.length)];

    return NextResponse.json({
      text: random?.text || "Practice makes perfect.",
    });
  } catch (error) {
    return NextResponse.json({
      text: "The quick brown fox jumps over the lazy dog.",
    });
  }
}
