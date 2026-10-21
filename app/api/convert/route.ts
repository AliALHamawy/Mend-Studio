import { NextResponse } from "next/server";
import { convertMediaBuffer, SUPPORTED_FORMATS } from "@/server/media-conversion";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A media file is required." }, { status: 400 });
  }
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "Files must be 50 MB or smaller." }, { status: 413 });
  }

  try {
    const result = await convertMediaBuffer(
      Buffer.from(await file.arrayBuffer()),
      file.name,
      formData.get("target"),
      formData.get("quality"),
    );
    return new NextResponse(result.buffer, {
      status: 200,
      headers: {
        "Content-Type": `application/${result.targetFormat}`,
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "Content-Length": String(result.buffer.length),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Media conversion failed.";
    const status = message === "Unsupported target format." ? 400 : 422;
    return NextResponse.json({
      error: message,
      supported: status === 400 ? Array.from(SUPPORTED_FORMATS) : undefined,
    }, { status });
  }
}
