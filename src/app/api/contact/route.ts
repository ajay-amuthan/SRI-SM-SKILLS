import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    console.log("[Contact Form]", data);

    return NextResponse.json({
      success: true,
      message: "Thank you! We will get back to you within 24 hours.",
    });
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
}
