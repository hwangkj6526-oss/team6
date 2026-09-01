export type Highlight = { title: string; description: string };
export type Difference = { label: string; value: string };

export type CatalogProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  color: "coral" | "mint" | "lavender" | "yellow";
  image: string;
  specs: string[];
  highlights: Highlight[];
  differences: Difference[];
  deliveryDays: [number, number];
  captureCount30Days: number;
  modelVariant: "tower" | "air" | "night" | "mini";
  consumableIds: string[];
};

export type Consumable = {
  id: string;
  name: string;
  price: number;
  description: string;
  compatibleProductIds: string[];
  replacementCycle: string;
  stock: number;
  color: string;
  icon: string;
};

export type ProductReview = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  content: string;
  createdAt: string;
  verified: true;
  isDemo: true;
};

export const catalogProducts: CatalogProduct[] = [
  {
    id: "mg-one",
    name: "모스가드 ONE",
    price: 59000,
    description: "침실과 원룸을 위한 조용한 첫 번째 모기 포획기",
    stock: 12,
    color: "coral",
    image: "/images/mosqguard-one.png",
    specs: ["권장 면적 20㎡", "저소음 28dB", "USB-C 충전"],
    highlights: [
      { title: "침실 맞춤 저소음", description: "수면을 방해하지 않는 28dB 저소음 설계" },
      { title: "체취 모사 유인", description: "사람의 호흡과 체취 패턴을 모사한 듀얼 유인" },
      { title: "간편한 패드 교체", description: "손에 닿지 않는 슬라이드형 끈끈이 트레이" },
      { title: "USB-C 전원", description: "침대 옆과 책상 어디서나 편리한 범용 전원" }
    ],
    differences: [
      { label: "추천 공간", value: "침실·원룸" },
      { label: "소음", value: "28dB" },
      { label: "전원", value: "USB-C" },
      { label: "핵심 강점", value: "균형 잡힌 입문형" }
    ],
    deliveryDays: [1, 2],
    captureCount30Days: 8932,
    modelVariant: "tower",
    consumableIds: ["one-pad", "one-lure"]
  },
  {
    id: "mg-air",
    name: "모스가드 AIR",
    price: 45000,
    description: "거실까지 넓게 커버하는 강력한 흡입형 포획기",
    stock: 7,
    color: "mint",
    image: "/images/mosqguard-air.png",
    specs: ["권장 면적 40㎡", "3단계 흡입", "필터 교체 알림"],
    highlights: [
      { title: "40㎡ 광역 포획", description: "거실과 주방을 함께 커버하는 넓은 유인 범위" },
      { title: "3단계 터보 흡입", description: "환경에 맞춰 조절하는 강력한 공기 흐름" },
      { title: "360° 흡입구", description: "어느 방향에서 접근해도 놓치지 않는 원형 설계" },
      { title: "필터 알림", description: "교체 시기를 놓치지 않는 상태 표시 기능" }
    ],
    differences: [
      { label: "추천 공간", value: "거실·주방" },
      { label: "소음", value: "34dB" },
      { label: "전원", value: "전용 어댑터" },
      { label: "핵심 강점", value: "가장 넓은 포획 범위" }
    ],
    deliveryDays: [1, 3],
    captureCount30Days: 11420,
    modelVariant: "air",
    consumableIds: ["air-filter", "air-lure"]
  },
  {
    id: "mg-night",
    name: "모스가드 NIGHT",
    price: 63000,
    description: "수면을 방해하지 않는 프리미엄 야간 포획기",
    stock: 3,
    color: "lavender",
    image: "/images/mosqguard-night.png",
    specs: ["권장 면적 35㎡", "수면 모드", "무드등 내장"],
    highlights: [
      { title: "22dB 수면 모드", description: "네 제품 중 가장 조용한 프리미엄 저소음 설계" },
      { title: "빛 번짐 최소화", description: "눈부심 없이 모기만 유인하는 하향 무드 조명" },
      { title: "자동 밝기 조절", description: "주변 조도에 따라 유인광과 무드등을 자동 조절" },
      { title: "야간 집중 포획", description: "취침 시간대에 최적화된 유인 패턴" }
    ],
    differences: [
      { label: "추천 공간", value: "안방·아이방" },
      { label: "소음", value: "22dB" },
      { label: "전원", value: "USB-C PD" },
      { label: "핵심 강점", value: "최저 소음·무드등" }
    ],
    deliveryDays: [2, 3],
    captureCount30Days: 12784,
    modelVariant: "night",
    consumableIds: ["night-pad", "night-lure"]
  },
  {
    id: "mg-mini",
    name: "모스가드 MINI",
    price: 58500,
    description: "여행과 캠핑에 가볍게 챙기는 휴대용 포획기",
    stock: 18,
    color: "yellow",
    image: "/images/mosqguard-mini.png",
    specs: ["권장 면적 10㎡", "440g", "최대 8시간"],
    highlights: [
      { title: "440g 초경량", description: "가방과 텐트에 부담 없이 넣는 휴대용 크기" },
      { title: "최대 8시간", description: "충전 한 번으로 하룻밤 사용하는 내장 배터리" },
      { title: "걸이형 스트랩", description: "텐트·유모차·파라솔에 바로 걸 수 있는 구조" },
      { title: "생활 방수", description: "캠핑과 베란다에서 안심하고 쓰는 IPX4 설계" }
    ],
    differences: [
      { label: "추천 공간", value: "캠핑·여행" },
      { label: "소음", value: "30dB" },
      { label: "전원", value: "내장 배터리" },
      { label: "핵심 강점", value: "휴대성·생활 방수" }
    ],
    deliveryDays: [1, 2],
    captureCount30Days: 6318,
    modelVariant: "mini",
    consumableIds: ["mini-roll", "mini-lure"]
  }
];

export const consumables: Consumable[] = [
  { id: "one-pad", name: "ONE 포획 패드 6매", price: 9900, description: "냄새와 잔여물을 줄인 전용 슬라이드형 끈끈이 패드", compatibleProductIds: ["mg-one"], replacementCycle: "2~4주", stock: 84, color: "#ffd8d6", icon: "▤" },
  { id: "one-lure", name: "ONE 유인 캡슐 3개", price: 12000, description: "사람의 체취 패턴을 모사하는 무향 유인 리필", compatibleProductIds: ["mg-one"], replacementCycle: "30일", stock: 62, color: "#ffe8db", icon: "◉" },
  { id: "air-filter", name: "AIR 흡입 필터 2개", price: 15900, description: "흡입 성능을 안정적으로 유지하는 미세망 전용 필터", compatibleProductIds: ["mg-air"], replacementCycle: "60일", stock: 39, color: "#dff7e9", icon: "⌁" },
  { id: "air-lure", name: "AIR 광역 유인 카트리지 3개", price: 14900, description: "넓은 공간을 위한 고확산 체취 모사 카트리지", compatibleProductIds: ["mg-air"], replacementCycle: "30일", stock: 48, color: "#d6f2e7", icon: "◎" },
  { id: "night-pad", name: "NIGHT 저소음 포획 패드 6매", price: 12900, description: "공기 흐름 소리를 줄이도록 타공된 프리미엄 패드", compatibleProductIds: ["mg-night"], replacementCycle: "2~4주", stock: 31, color: "#eee3ff", icon: "▥" },
  { id: "night-lure", name: "NIGHT 무향 유인 캡슐 3개", price: 16900, description: "침실 사용에 맞춘 완전 무향 야간 유인 리필", compatibleProductIds: ["mg-night"], replacementCycle: "30일", stock: 28, color: "#e7dcfa", icon: "☾" },
  { id: "mini-roll", name: "MINI 포획 롤 6회분", price: 8900, description: "휴대용 본체에 맞춘 컴팩트 교체형 포획 롤", compatibleProductIds: ["mg-mini"], replacementCycle: "사용 5회", stock: 96, color: "#ffefbd", icon: "◫" },
  { id: "mini-lure", name: "MINI 아웃도어 캡슐 4개", price: 10900, description: "야외 확산에 최적화된 생활 방수 유인 캡슐", compatibleProductIds: ["mg-mini"], replacementCycle: "20일", stock: 75, color: "#ffe7a0", icon: "⌾" }
];

const reviewerSurnames = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "류", "전"];
const reviewerNames = ["서*", "도*", "지*", "하*", "민*", "수*", "현*", "예*", "준*", "채*", "유*", "은*", "시*", "태*", "아*", "재*", "나*", "성*", "우*", "혜*"];

const reviewTemplates: Record<string, string[]> = {
  "mg-one": ["침실에서 켜 두어도 조용하고 아침에 포획 패드 확인이 쉬워요.", "원룸에 크기가 적당하고 USB-C라 설치가 간단했습니다.", "패드를 밀어서 교체하니 손에 닿지 않아 위생적이에요.", "입문용으로 부담 없는 가격인데 포획 효과는 확실합니다.", "수면 중 소리가 거의 신경 쓰이지 않았어요.", "작은 방 한 칸은 충분히 커버하는 느낌입니다."],
  "mg-air": ["거실과 주방 사이에 두니 넓은 공간에서도 잘 잡혀요.", "강력 모드 흡입력이 좋고 단계 조절이 편합니다.", "필터 교체 알림이 있어 관리 시기를 놓치지 않아요.", "360도 흡입구라 벽에서 조금 떨어뜨려 두니 효과가 좋았습니다.", "집 전체용으로 ONE보다 AIR가 잘 맞았어요.", "소음보다 넓은 포획 범위를 중요하게 보면 추천합니다."],
  "mg-night": ["수면 모드는 정말 조용하고 무드등도 은은해서 만족합니다.", "아이방에 두었는데 빛이 눈부시지 않아 안심돼요.", "밤이 되면 자동으로 밝기가 줄어드는 점이 편리합니다.", "가격은 높지만 소음과 마감이 확실히 프리미엄이에요.", "야간 포획 수가 가장 안정적으로 나왔습니다.", "침실용으로 소리에 민감하다면 NIGHT가 잘 맞아요."],
  "mg-mini": ["캠핑 텐트에 걸어 두기 좋고 무게가 가벼워요.", "보조배터리 없이 한밤을 버텨서 편했습니다.", "작지만 텐트 안에서는 충분히 효과가 있었어요.", "스트랩 덕분에 유모차에도 쉽게 걸 수 있습니다.", "여행 가방에 넣기 좋은 크기라 자주 챙기게 돼요.", "베란다와 캠핑용으로 부담 없이 쓰기 좋습니다."]
};

export function getProductReviews(productId: string): ProductReview[] {
  const templates = reviewTemplates[productId] ?? reviewTemplates["mg-one"];
  const productOffset = Math.max(0, catalogProducts.findIndex((product) => product.id === productId));
  const baseDate = Date.UTC(2026, 7, 31);

  return Array.from({ length: 500 }, (_, index) => {
    const rating = index % 41 === 0 ? 3 : index % 9 === 0 ? 4 : 5;
    const name = reviewerSurnames[(index + productOffset * 3) % reviewerSurnames.length] + reviewerNames[(index * 7 + productOffset) % reviewerNames.length];
    return {
      id: `${productId}-review-${index + 1}`,
      productId,
      name,
      rating,
      content: templates[(index + productOffset) % templates.length],
      createdAt: new Date(baseDate - ((index * 11 + productOffset * 5) % 180) * 86400000).toISOString().slice(0, 10),
      verified: true,
      isDemo: true
    };
  });
}

export function getReviewSummary(productId: string) {
  const reviews = getProductReviews(productId);
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  return { count: reviews.length, average: Number(average.toFixed(1)) };
}

export const rankedProducts = [...catalogProducts].sort((a, b) => b.captureCount30Days - a.captureCount30Days);

export const supportFaqs = [
  { question: "포획 패드는 언제 교체하나요?", answer: "사용 환경에 따라 2~4주마다, 또는 포획 면적의 절반 이상이 찼을 때 교체해 주세요." },
  { question: "아이와 반려동물이 있는 집에서도 사용할 수 있나요?", answer: "화학 살충제를 분사하지 않으며 포획부가 본체 안쪽에 있습니다. 다만 제품은 손이 닿지 않는 안정된 곳에 설치해 주세요." },
  { question: "배송은 얼마나 걸리나요?", answer: "평일 오후 2시 이전 주문은 제품별 안내 범위인 1~3영업일 안에 도착하도록 출고합니다." },
  { question: "소모품은 다른 모델과 호환되나요?", answer: "포획 효율과 안전한 장착을 위해 각 상품 카드에 표시된 호환 모델 전용 소모품을 사용해 주세요." },
  { question: "장치가 연결되지 않으면 어떻게 하나요?", answer: "전원을 다시 연결한 뒤 내 장치 화면에서 상태를 확인해 주세요. 해결되지 않으면 고객지원 문의를 남겨 주세요." }
];

export const companyInfo = {
  name: "2team",
  email: "2team@naver.com",
  address: "정보 등록 예정",
  businessNumber: "정보 등록 예정"
};
