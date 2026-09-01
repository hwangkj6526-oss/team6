export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  color: string;
  image: string;
  specs: string[];
};

export const products: Product[] = [
  { id: "mg-one", name: "모스가드 ONE", price: 59000, description: "침실과 원룸을 위한 조용한 첫 번째 모기 포획기", stock: 12, color: "coral", image: "/images/mosqguard-one.png", specs: ["권장 면적 20㎡", "저소음 28dB", "USB-C 충전"] },
  { id: "mg-air", name: "모스가드 AIR", price: 45000, description: "거실까지 넓게 커버하는 강력한 흡입형 포획기", stock: 7, color: "mint", image: "/images/mosqguard-air.png", specs: ["권장 면적 40㎡", "3단계 흡입", "필터 교체 알림"] },
  { id: "mg-night", name: "모스가드 NIGHT", price: 63000, description: "수면을 방해하지 않는 프리미엄 야간 포획기", stock: 3, color: "lavender", image: "/images/mosqguard-night.png", specs: ["권장 면적 35㎡", "수면 모드", "무드등 내장"] },
  { id: "mg-mini", name: "모스가드 MINI", price: 58500, description: "여행과 캠핑에 가볍게 챙기는 휴대용 포획기", stock: 18, color: "yellow", image: "/images/mosqguard-mini.png", specs: ["권장 면적 10㎡", "440g", "최대 8시간"] }
];

export const reviews = [
  { name: "김서연", rating: 5, text: "잠들기 전에 켜두니 다음 날 아침 포획 수를 확인할 수 있어 안심돼요." },
  { name: "이도윤", rating: 4, text: "작동 소리가 거의 없고 앱처럼 조작 화면이 직관적입니다." },
  { name: "박지민", rating: 5, text: "실제 구매 후기에만 표시가 있어서 선택하기 편했어요." }
];



