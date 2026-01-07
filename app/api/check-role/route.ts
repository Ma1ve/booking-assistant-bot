import { NextRequest, NextResponse } from "next/server";
import { validate, parse } from "@tma.js/init-data-node";

const BOT_TOKEN = process.env.BOT_TOKEN!;
const ADMIN_USERNAME = "malfeag";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { initData } = body;

    if (!initData) {
      return NextResponse.json({ ok: false, error: "No initData provided" }, { status: 400 });
    }

    try {
      validate(initData, BOT_TOKEN, { expiresIn: 3600 });
    } catch (e) {
      return NextResponse.json({ ok: false, error: "Invalid initData" }, { status: 401 });
    }
    const parsed = parse(initData);

    const isAdmin = parsed.user?.username === ADMIN_USERNAME;

    return NextResponse.json({ ok: true, isAdmin, user: parsed.user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
