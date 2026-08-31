import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.productId || !body.shippingAddress || !body.paymentMethod) {
    return NextResponse.json({ message: "필수 주문 정보를 입력해 주세요." }, { status: 400 });
  }
  return NextResponse.json({
    id: "ORDER-" + Date.now(),
    status: "결제완료",
    ...body,
    createdAt: new Date().toISOString()
  }, { status: 201 });
}
