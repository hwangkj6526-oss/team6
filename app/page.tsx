"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Product, products, reviews } from "../lib/data";

type View = "home" | "detail" | "checkout" | "complete" | "device";
type Order = { id: string; productName: string; total: number; address: string };

const won = (price: number) => new Intl.NumberFormat("ko-KR").format(price) + "원";

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [selected, setSelected] = useState<Product>(products[0]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deviceOn, setDeviceOn] = useState(false);
  const [mode, setMode] = useState("자동");
  const [captured, setCaptured] = useState(3);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 600);
    const saved = window.localStorage.getItem("mosq-guard-order");
    if (saved) setOrder(JSON.parse(saved));
    return () => window.clearTimeout(timer);
  }, []);

  const items = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  function choose(product: Product) {
    setSelected(product);
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const address = String(data.get("address") || "").trim();
    const paymentMethod = String(data.get("payment") || "");
    if (!address || !paymentMethod) return;

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: selected.id, shippingAddress: address, paymentMethod, totalPrice: selected.price })
    });
    if (!response.ok) {
      setError(true);
      return;
    }
    const result = await response.json();
    const nextOrder = { id: result.id, productName: selected.name, total: selected.price, address };
    window.localStorage.setItem("mosq-guard-order", JSON.stringify(nextOrder));
    setOrder(nextOrder);
    setView("complete");
  }

  function goHome() {
    setError(false);
    setView("home");
  }

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={goHome} aria-label="모스가드 홈">mosq<span>guard</span></button>
        <div className="nav">
          <button className={view === "home" ? "active" : ""} onClick={goHome}>스토어</button>
          <button className={view === "device" ? "active" : ""} onClick={() => setView("device")}>내 장치</button>
        </div>
        <button className="order-chip" onClick={() => order && setView("complete")}>{order ? "주문 조회" : "시연 모드"}</button>
      </header>

      {error && <div className="error-banner">요청을 처리하지 못했습니다. 연결 상태를 확인하고 다시 시도해 주세요.<button onClick={() => setError(false)}>닫기</button></div>}

      {view === "home" && (
        <>
          <section className="hero">
            <div>
              <p className="eyebrow">GOOD NIGHT, GOOD GUARD</p>
              <h1>모기를 기다리지 않는<br /><em>조용한 밤</em>을 시작하세요.</h1>
              <p className="hero-copy">사람의 체취를 모사해 모기를 유인하고, 안전한 포획 방식으로 밤의 불편을 줄입니다.</p>
              <button className="primary" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>제품 둘러보기 <span>→</span></button>
            </div>
            <div className="hero-visual"><img className="hero-photo" src="/images/mosqguard-hero.png" alt="침실에서 작동하는 모기 포획기" /><span className="float-tag">오늘 밤부터<br /><b>모기 걱정 OFF</b></span></div>
          </section>

          <section className="benefits">
            <div><b>01</b><span><strong>체취 모사 유인</strong>사람에게 가까이 가는 모기의 습성을 활용합니다.</span></div>
            <div><b>02</b><span><strong>화학 살충제 없이</strong>끈끈이 포획 방식으로 깔끔하게 관리합니다.</span></div>
            <div><b>03</b><span><strong>구매 인증 후기</strong>실제 구매자의 경험만 모아 보여드립니다.</span></div>
          </section>

          <section id="products" className="catalog">
            <div className="section-heading"><div><p className="eyebrow">MOSQGUARD COLLECTION</p><h2>공간에 맞는 포획 솔루션</h2></div><span>{items.length} products</span></div>
            <div className="filterbar">
              <label><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="제품명을 검색하세요" /></label>
              <button className="filter">전체 제품⌄</button>
            </div>
            {loading ? <div className="product-grid">{[1,2,3,4].map((item) => <div className="skeleton" key={item} />)}</div> :
              items.length === 0 ? <div className="empty">검색 결과가 없습니다.<button onClick={() => setQuery("")}>전체 제품 보기</button></div> :
              <div className="product-grid">{items.map((product) => <article className="product-card" key={product.id} onClick={() => choose(product)}>
                <div className={"product-image " + product.color}><img src={product.image} alt={product.name} /><span>NEW</span></div>
                <div className="product-info"><p>{product.name}</p><strong>{won(product.price)}</strong><button aria-label={product.name + " 상세 보기"}>자세히 보기 →</button></div>
              </article>)}</div>}
          </section>

          <section className="review-strip"><p className="eyebrow">VERIFIED REVIEW</p><h2>먼저 써본 사람들의<br />편안한 밤 이야기</h2><div className="review-list">{reviews.map((review) => <article key={review.name}><div>★★★★★ <small>구매 인증</small></div><p>“{review.text}”</p><b>{review.name}</b></article>)}</div></section>
        </>
      )}

      {view === "detail" && <section className="detail">
        <button className="back" onClick={goHome}>← 제품 목록</button>
        <div className="detail-grid">
          <div className={"detail-art " + selected.color}><img src={selected.image} alt={selected.name} /><span>mosqguard</span></div>
          <div className="detail-content"><p className="eyebrow">MOSQGUARD COLLECTION</p><h1>{selected.name}</h1><p className="description">{selected.description}</p><strong className="price">{won(selected.price)}</strong><p className="stock">● 재고 {selected.stock}개 · 지금 주문 가능</p>
            <ul>{selected.specs.map((spec) => <li key={spec}>✓ {spec}</li>)}</ul>
            <button className="primary full" onClick={() => setView("checkout")}>구매하기 <span>→</span></button>
          </div>
        </div>
        <section className="detail-reviews"><div><p className="eyebrow">VERIFIED REVIEWS</p><h2>구매자 후기</h2></div>{reviews.map((review) => <article key={review.name}><b>{review.name} · <span>★★★★★</span></b><p>{review.text}</p></article>)}</section>
      </section>}

      {view === "checkout" && <section className="checkout">
        <button className="back" onClick={() => setView("detail")}>← 상품 상세</button>
        <div className="checkout-grid"><form onSubmit={submitOrder}><p className="eyebrow">CHECKOUT</p><h1>주문 정보를 입력하세요</h1>
          <label>받는 분<input name="name" required placeholder="이름을 입력하세요" /></label>
          <label>배송지<textarea name="address" required placeholder="주소를 입력하세요" /></label>
          <fieldset><legend>결제 수단</legend><label className="radio"><input type="radio" name="payment" value="카드" required /> 카드 결제</label><label className="radio"><input type="radio" name="payment" value="간편결제" /> 간편결제</label></fieldset>
          <button className="primary full" type="submit">결제하고 주문하기 <span>→</span></button><p className="form-note">시연용 주문입니다. 실제 결제는 진행되지 않습니다.</p>
        </form><aside><div className={"mini-art " + selected.color}><img src={selected.image} alt={selected.name} /></div><div><p>{selected.name}</p><b>{won(selected.price)}</b></div><hr /><strong>총 결제금액 <em>{won(selected.price)}</em></strong></aside></div>
      </section>}

      {view === "complete" && <section className="complete"><div className="check">✓</div><p className="eyebrow">ORDER COMPLETE</p><h1>주문이 완료되었습니다.</h1><p>{order?.productName || selected.name}로 오늘 밤을 더 편안하게 준비했어요.</p><div className="order-box"><span>주문 번호</span><b>{order?.id || "ORDER-DEMO"}</b><span>배송지</span><b>{order?.address || "입력된 배송지"}</b><span>결제 금액</span><b>{won(order?.total || selected.price)}</b></div><button className="primary" onClick={() => setView("device")}>장치 제어 시연하기 <span>→</span></button></section>}

      {view === "device" && <section className="device">
        <div><p className="eyebrow">MY DEVICE</p><h1>오늘 밤의 포획 상태</h1><p className="device-copy">모스가드 ONE · 침실</p></div>
        <div className="device-grid"><div className={"device-display " + (deviceOn ? "on" : "")}><img className="device-photo" src={selected.image} alt={selected.name + " 제어 화면"} /><div className="signal"><i /><i /><i /></div><p>{deviceOn ? "유인 · 포획 중" : "대기 중"}</p><strong>{deviceOn ? "ON" : "OFF"}</strong></div>
        <div className="control-panel"><p>장치 전원</p><button className={"toggle " + (deviceOn ? "on" : "")} onClick={() => setDeviceOn(!deviceOn)} aria-label="장치 전원 전환"><span /></button><b>{deviceOn ? "작동 중" : "전원이 꺼져 있습니다"}</b><hr /><p>작동 모드</p><div className="mode-buttons">{["자동","수면","강력"].map((item) => <button className={mode === item ? "selected" : ""} key={item} onClick={() => setMode(item)}>{item}</button>)}</div><div className="capture"><span>오늘 포획</span><b>{captured} <small>마리</small></b><button onClick={() => deviceOn && setCaptured(captured + 1)} disabled={!deviceOn}>시뮬레이션 +1</button></div></div></div>
        <p className="sim-note">시연 모드: 실제 기기와 연결되지 않으며, 버튼으로 상태 변화를 확인할 수 있습니다.</p>
      </section>}
    </main>
  );
}

function TrapArt({ color, large = false }: { color: string; large?: boolean }) {
  return <div className={"trap " + color + (large ? " large" : "")}><div className="glow" /><div className="cap" /><div className="body"><i /><i /><i /><i /></div><div className="base" /></div>;
}

