import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const NOTES_DIR = path.join(process.cwd(), "notes");
function ensureNotesDir() { if (!fs.existsSync(NOTES_DIR)) fs.mkdirSync(NOTES_DIR, { recursive: true }); }

export async function GET() {
  ensureNotesDir();
  const files = fs.readdirSync(NOTES_DIR).filter((f) => f.endsWith(".md")).map((name) => {
    const stat = fs.statSync(path.join(NOTES_DIR, name));
    return { name, size: stat.size, updatedAt: stat.mtime.toISOString() };
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return NextResponse.json(files);
}

export async function POST(req: NextRequest) {
  ensureNotesDir();
  const { filename, content } = await req.json();
  if (!filename || typeof content !== "string") return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const safe = path.basename(filename);
  if (!safe.endsWith(".md")) return NextResponse.json({ error: "Only .md files allowed" }, { status: 400 });
  fs.writeFileSync(path.join(NOTES_DIR, safe), content, "utf-8");
  return NextResponse.json({ name: safe });
}
