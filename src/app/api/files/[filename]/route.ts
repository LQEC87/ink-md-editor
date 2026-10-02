import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const NOTES_DIR = path.join(process.cwd(), "notes");
type Params = { params: Promise<{ filename: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { filename } = await params;
  const safe = path.basename(filename);
  const filepath = path.join(NOTES_DIR, safe);
  if (!fs.existsSync(filepath)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const content = fs.readFileSync(filepath, "utf-8");
  return NextResponse.json({ name: safe, content });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { filename } = await params;
  const safe = path.basename(filename);
  const filepath = path.join(NOTES_DIR, safe);
  if (!fs.existsSync(filepath)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  fs.unlinkSync(filepath);
  return NextResponse.json({ deleted: safe });
}
