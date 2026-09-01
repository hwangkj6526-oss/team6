import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const category = String(body.category || "").trim();
  const content = String(body.content || "").trim();

  if (!name || !email || !category || content.length < 10) {
    return NextResponse.json({ message: "이름·이메일·문의 유형과 10자 이상의 문의 내용을 입력해 주세요." }, { status: 400 });
  }

  return NextResponse.json({
    id: `CS-${Date.now().toString().slice(-8)}`,
    status: "접수완료",
    receivedAt: new Date().toISOString()
  }, { status: 201 });
}
