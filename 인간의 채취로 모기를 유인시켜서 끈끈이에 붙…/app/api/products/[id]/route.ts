import { NextResponse } from "next/server";
import { products } from "../../../../lib/data";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);
  return product ? NextResponse.json(product) : NextResponse.json({ message: "상품을 찾을 수 없습니다." }, { status: 404 });
}
