import { NextResponse } from "next/server";
import { CONVERSION_FAILED_MESSAGE, INVALID_FILE_MESSAGE } from "@/lib/conversion-messages";
import { contentTypeForFormat } from "@/lib/media-mime";
import { convertMediaBuffer, MediaConversionError, SUPPORTED_FORMATS } from "@/server/media-conversion";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: INVALID_FILE_MESSAGE }, { status: 400 });
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
        "Content-Type": contentTypeForFormat(result.targetFormat),
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "Content-Length": String(result.buffer.length),
      },
    });
  } catch (error) {
    // Only friendly messages ever reach the client; anything unexpected is logged here instead.
    if (!(error instanceof MediaConversionError)) {
      console.error("[api/convert] unexpected conversion failure", error);
    }
    const invalidInput = error instanceof MediaConversionError && error.kind === "input";
    return NextResponse.json({
      error: error instanceof MediaConversionError ? error.message : CONVERSION_FAILED_MESSAGE,
      supported: invalidInput ? Array.from(SUPPORTED_FORMATS) : undefined,
    }, { status: invalidInput ? 400 : 422 });
  }
}
