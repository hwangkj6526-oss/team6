"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import DeviceProduct3D, { DeviceMode, modeColors } from "../components/device-product-3d";
import {
  CatalogProduct,
  Consumable,
  catalogProducts,
  companyInfo,
  consumables,
  getProductReviews,
  getReviewSummary,
  rankedProducts,
  supportFaqs
} from "../lib/catalog";
import styles from "./storefront.module.css";

type View = "home" | "detail" | "supplies" | "support" | "device" | "checkout" | "complete";
type PurchaseItem = CatalogProduct | Consumable;
type Order = { id: string; itemName: string; total: number; address: string; delivery: string };

const won = (price: number) => new Intl.NumberFormat("ko-KR").format(price) + "원";
const isProduct = (item: PurchaseItem): item is CatalogProduct => "highlights" in item;
const deliveryText = (product: CatalogProduct) => `${product.deliveryDays[0]}~${product.deliveryDays[1]}영업일 도착 예상`;
const modeIntervals: Record<DeviceMode, number> = { 자동: 4, 수동: 7, 강력: 2 };
const modeDescriptions: Record<DeviceMode, string> = {
  자동: "주변 환경을 감지해 약 4초마다 포획",
  수동: "조용한 청색광으로 약 7초마다 포획",
  강력: "최대 출력으로 약 2초마다 집중 포획"
};
const runtimeText = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

function Stars({ rating }: { rating: number }) {
  return <span className={styles.stars} aria-label={`별점 ${rating}점`}>{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>;
}

function ProductModel3D({ product, active, mode }: { product: CatalogProduct; active: boolean; mode: DeviceMode }) {
  const [rotation, setRotation] = useState(-20);
  const modeClass = mode === "자동" ? styles.modeAuto : mode === "수동" ? styles.modeManual : styles.modePower;

  return (
    <div className={styles.viewerShell}>
      <div className={`${styles.viewerStage} ${modeClass} ${active ? styles.viewerActive : ""}`}>
        <DeviceProduct3D active={active} className={styles.webglModel} image={product.image} mode={mode} name={product.name} onRotationChange={setRotation} rotation={rotation} variant={product.modelVariant} />
        <div className={`${styles.mosquitoSwarm} ${active ? styles.swarmActive : ""}`} aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <span key={index}>⌁</span>)}</div>
        <span className={styles.lightStatus}><i style={{ background: active ? modeColors[mode] : "#aeb4ba" }} />{active ? `${mode} 모드 발광 중` : "발광 대기"}</span>
        <span className={styles.dragHint}>↔ 제품을 드래그해서 360° 회전</span>
      </div>
      <div className={styles.rotateButtons}>
        <button onClick={() => setRotation((value) => value - 30)} aria-label="제품을 왼쪽으로 회전">↶</button>
        <button onClick={() => setRotation(0)}>정면</button>
        <button onClick={() => setRotation((value) => value + 30)} aria-label="제품을 오른쪽으로 회전">↷</button>
      </div>
    </div>
  );
}

export default function Storefront() {
  const [view, setView] = useState<View>("home");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct>(catalogProducts[0]);
  const [selectedSupply, setSelectedSupply] = useState<Consumable | null>(null);
  const [supplyFilter, setSupplyFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [reviewPage, setReviewPage] = useState(1);
  const [supportTicket, setSupportTicket] = useState<string | null>(null);
  const [supportError, setSupportError] = useState("");
  const [deviceOn, setDeviceOn] = useState(false);
  const [mode, setMode] = useState<DeviceMode>("자동");
  const [captured, setCaptured] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 600);
    const saved = window.localStorage.getItem("mosq-guard-order-v2");
    if (saved) {
      try { setOrder(JSON.parse(saved)); } catch { window.localStorage.removeItem("mosq-guard-order-v2"); }
    }
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!deviceOn) return;
    let ticks = 0;
    const timer = window.setInterval(() => {
      ticks += 1;
      setElapsedSeconds((seconds) => seconds + 1);
      if (ticks % modeIntervals[mode] === 0) setCaptured((count) => count + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [deviceOn, mode]);

  const products = useMemo(
    () => catalogProducts.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  const productReviews = useMemo(() => getProductReviews(selectedProduct.id), [selectedProduct.id]);
  const reviewSummary = useMemo(() => getReviewSummary(selectedProduct.id), [selectedProduct.id]);
  const visibleReviews = productReviews.slice((reviewPage - 1) * 6, reviewPage * 6);
  const reviewPages = Math.ceil(productReviews.length / 6);
  const visibleSupplies = supplyFilter === "all"
    ? consumables
    : consumables.filter((supply) => supply.compatibleProductIds.includes(supplyFilter));
  const selectedRank = rankedProducts.findIndex((product) => product.id === selectedProduct.id) + 1;
  const purchaseItem: PurchaseItem = selectedSupply ?? selectedProduct;

  function navigate(nextView: View) {
    setView(nextView);
    setError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseProduct(product: CatalogProduct) {
    setSelectedProduct(product);
    setSelectedSupply(null);
    setReviewPage(1);
    navigate("detail");
  }

  function openSupplies(productId = "all") {
    setSupplyFilter(productId);
    setSelectedSupply(null);
    navigate("supplies");
  }

  function startPurchase(item: PurchaseItem) {
    if (isProduct(item)) {
      setSelectedProduct(item);
      setSelectedSupply(null);
    } else {
      setSelectedSupply(item);
    }
    navigate("checkout");
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const address = String(data.get("address") || "").trim();
    const paymentMethod = String(data.get("payment") || "");
    if (!address || !paymentMethod) return;
    setSubmitting(true);
    setError(false);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: purchaseItem.id, shippingAddress: address, paymentMethod, totalPrice: purchaseItem.price })
      });
      if (!response.ok) throw new Error("order failed");
      const result = await response.json();
      const nextOrder = {
        id: result.id,
        itemName: purchaseItem.name,
        total: purchaseItem.price,
        address,
        delivery: isProduct(purchaseItem) ? deliveryText(purchaseItem) : "1~2영업일 도착 예상"
      };
      window.localStorage.setItem("mosq-guard-order-v2", JSON.stringify(nextOrder));
      setOrder(nextOrder);
      navigate("complete");
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitSupport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSupportError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      category: String(data.get("category") || ""),
      content: String(data.get("content") || "").trim()
    };
    try {
      const response = await fetch("/api/support", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "문의 접수에 실패했습니다.");
      setSupportTicket(result.id);
      form.reset();
    } catch (requestError) {
      setSupportError(requestError instanceof Error ? requestError.message : "문의 접수에 실패했습니다.");
    }
  }

  return (
    <main className={styles.app}>
      <header className={styles.topbar}>
        <button className={styles.brand} onClick={() => navigate("home")} aria-label="모스가드 홈">mosq<span>guard</span></button>
        <nav className={styles.nav} aria-label="주요 메뉴">
          <button className={view === "home" || view === "detail" ? styles.active : ""} onClick={() => navigate("home")}>스토어</button>
          <button className={view === "supplies" ? styles.active : ""} onClick={() => openSupplies()}>소모품</button>
          <button className={view === "device" ? styles.active : ""} onClick={() => navigate("device")}>내 장치</button>
          <button className={view === "support" ? styles.active : ""} onClick={() => navigate("support")}>고객지원</button>
        </nav>
        <button className={styles.orderChip} onClick={() => order ? navigate("complete") : navigate("device")}>{order ? "주문 조회" : "시연 모드"}</button>
      </header>

      {error && <div className={styles.errorBanner}>요청을 처리하지 못했습니다. 연결 상태를 확인하고 다시 시도해 주세요.<button onClick={() => setError(false)}>닫기</button></div>}

      {view === "home" && <>
        <section className={styles.hero}>
          <div><p className={styles.eyebrow}>GOOD NIGHT, GOOD GUARD</p><h1>제품마다 다른 강점으로<br /><em>조용한 밤</em>을 지켜드립니다.</h1><p>체취 모사 유인부터 휴대용 포획까지, 공간과 생활 방식에 맞는 모스가드를 비교해 보세요.</p><button className={styles.primary} onClick={() => document.getElementById("products-v2")?.scrollIntoView({ behavior: "smooth" })}>제품 비교하기 <span>→</span></button></div>
          <div className={styles.heroVisual}><img src="/images/mosqguard-hero.png" alt="침실에서 작동하는 모스가드" /><span>누적 시연 포획<br /><b>{rankedProducts.reduce((sum, product) => sum + product.captureCount30Days, 0).toLocaleString()}마리</b></span></div>
        </section>

        <section className={styles.rankSection}>
          <div className={styles.sectionTitle}><div><p className={styles.eyebrow}>30-DAY CAPTURE RANKING</p><h2>최근 30일 포획 랭킹</h2></div><small>시연 데이터 기준</small></div>
          <div className={styles.rankGrid}>{rankedProducts.map((product, index) => <button key={product.id} onClick={() => chooseProduct(product)}><b>#{index + 1}</b><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{product.captureCount30Days.toLocaleString()}마리</small></span></button>)}</div>
        </section>

        <section id="products-v2" className={styles.catalog}>
          <div className={styles.sectionTitle}><div><p className={styles.eyebrow}>MOSQGUARD COLLECTION</p><h2>공간에 맞는 포획 솔루션</h2></div><small>{products.length} products</small></div>
          <div className={styles.filterbar}><label>⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제품명을 검색하세요" /></label><button onClick={() => setQuery("")}>전체 제품</button></div>
          {loading ? <div className={styles.productGrid}>{catalogProducts.map((product) => <div className={styles.skeleton} key={product.id} />)}</div> : products.length === 0 ? <div className={styles.empty}>검색 결과가 없습니다.<button onClick={() => setQuery("")}>전체 제품 보기</button></div> : <div className={styles.productGrid}>{products.map((product) => {
            const summary = getReviewSummary(product.id);
            const rank = rankedProducts.findIndex((item) => item.id === product.id) + 1;
            return <article className={styles.productCard} key={product.id}><button onClick={() => chooseProduct(product)}><div className={styles.productImage}><img src={product.image} alt={product.name} /><span>포획 #{rank}</span></div><div className={styles.productInfo}><p>{product.name}</p><strong>{won(product.price)}</strong><small><Stars rating={Math.round(summary.average)} /> {summary.average} · 후기 {summary.count}명</small><em>{product.differences[3].value}</em><span>상세 보기 →</span></div></button></article>;
          })}</div>}
        </section>
      </>}

      {view === "detail" && <section className={styles.pageSection}>
        <button className={styles.back} onClick={() => navigate("home")}>← 제품 목록</button>
        <div className={styles.productTabs}>{catalogProducts.map((product) => <button className={product.id === selectedProduct.id ? styles.selectedTab : ""} key={product.id} onClick={() => chooseProduct(product)}>{product.name.replace("모스가드 ", "")}</button>)}</div>
        <div className={styles.detailGrid}>
          <div className={styles.detailArt}><img src={selectedProduct.image} alt={selectedProduct.name} /><span>최근 30일 포획 #{selectedRank}</span></div>
          <div className={styles.detailContent}><p className={styles.eyebrow}>MOSQGUARD COLLECTION</p><h1>{selectedProduct.name}</h1><p>{selectedProduct.description}</p><div className={styles.ratingLine}><Stars rating={Math.round(reviewSummary.average)} /><b>{reviewSummary.average}</b><span>구매 인증 후기 {reviewSummary.count}명</span></div><strong className={styles.price}>{won(selectedProduct.price)}</strong><p className={styles.delivery}>🚚 {deliveryText(selectedProduct)} · 무료배송</p><p className={styles.stock}>● 재고 {selectedProduct.stock}개 · 지금 주문 가능</p><button className={styles.primary} onClick={() => startPurchase(selectedProduct)}>구매하기 <span>→</span></button></div>
        </div>

        <section className={styles.contentBlock}><div className={styles.sectionTitle}><div><p className={styles.eyebrow}>PRODUCT HIGHLIGHTS</p><h2>{selectedProduct.name}만의 특징</h2></div></div><div className={styles.highlightGrid}>{selectedProduct.highlights.map((item, index) => <article key={item.title}><b>0{index + 1}</b><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>

        <section className={styles.contentBlock}><div className={styles.sectionTitle}><div><p className={styles.eyebrow}>MODEL DIFFERENCES</p><h2>모델별 차이점</h2></div><small>현재 선택: {selectedProduct.name}</small></div><div className={styles.compareGrid}>{catalogProducts.map((product) => <article className={product.id === selectedProduct.id ? styles.compareSelected : ""} key={product.id}><img src={product.image} alt="" /><h3>{product.name}</h3>{product.differences.map((difference) => <p key={difference.label}><span>{difference.label}</span><b>{difference.value}</b></p>)}<button onClick={() => chooseProduct(product)}>이 모델 보기</button></article>)}</div></section>

        <section className={styles.contentBlock}><div className={styles.sectionTitle}><div><p className={styles.eyebrow}>COMPATIBLE SUPPLIES</p><h2>꼭 맞는 전용 소모품</h2></div><button className={styles.textButton} onClick={() => openSupplies(selectedProduct.id)}>전체 보기 →</button></div><div className={styles.supplyGrid}>{consumables.filter((supply) => selectedProduct.consumableIds.includes(supply.id)).map((supply) => <article className={styles.supplyCard} key={supply.id}><div style={{ background: supply.color }}><b>{supply.icon}</b></div><span><small>{selectedProduct.name} 전용</small><h3>{supply.name}</h3><p>{supply.description}</p><strong>{won(supply.price)}</strong><button onClick={() => startPurchase(supply)}>바로 구매</button></span></article>)}</div></section>

        <section className={styles.reviewSection}><div className={styles.reviewSummary}><p className={styles.eyebrow}>VERIFIED REVIEWS</p><h2>구매자 후기</h2><strong>{reviewSummary.average}</strong><Stars rating={Math.round(reviewSummary.average)} /><p>제품별 구매 인증 후기 {reviewSummary.count}명</p><small>발표용으로 생성된 시연 데이터입니다.</small></div><div><div className={styles.reviewGrid}>{visibleReviews.map((review) => <article key={review.id}><div><Stars rating={review.rating} /><small>구매 인증 · {review.createdAt}</small></div><p>{review.content}</p><b>{review.name}</b></article>)}</div><div className={styles.pagination}><button disabled={reviewPage === 1} onClick={() => setReviewPage((page) => page - 1)}>이전</button><span>{reviewPage} / {reviewPages}</span><button disabled={reviewPage === reviewPages} onClick={() => setReviewPage((page) => page + 1)}>다음</button></div></div></section>
      </section>}

      {view === "supplies" && <section className={styles.pageSection}>
        <div className={styles.pageHero}><p className={styles.eyebrow}>REFILL STORE</p><h1>성능을 오래 유지하는<br />전용 소모품</h1><p>제품에 꼭 맞는 패드·필터·유인 캡슐을 확인하고 바로 주문하세요.</p></div>
        <div className={styles.productTabs}><button className={supplyFilter === "all" ? styles.selectedTab : ""} onClick={() => setSupplyFilter("all")}>전체</button>{catalogProducts.map((product) => <button className={supplyFilter === product.id ? styles.selectedTab : ""} key={product.id} onClick={() => setSupplyFilter(product.id)}>{product.name.replace("모스가드 ", "")}</button>)}</div>
        <div className={styles.supplyCatalog}>{visibleSupplies.map((supply) => { const compatible = catalogProducts.filter((product) => supply.compatibleProductIds.includes(product.id)); return <article key={supply.id}><div className={styles.supplyVisual} style={{ background: supply.color }}><b>{supply.icon}</b><span>REFILL</span></div><div><small>{compatible.map((product) => product.name).join(", ")} 호환</small><h2>{supply.name}</h2><p>{supply.description}</p><dl><div><dt>교체 주기</dt><dd>{supply.replacementCycle}</dd></div><div><dt>재고</dt><dd>{supply.stock}개</dd></div></dl><strong>{won(supply.price)}</strong><button className={styles.primary} onClick={() => startPurchase(supply)}>바로 구매 <span>→</span></button></div></article>; })}</div>
      </section>}

      {view === "support" && <section className={styles.pageSection}>
        <div className={styles.supportHero}><div><p className={styles.eyebrow}>CUSTOMER SUPPORT</p><h1>사용 중 궁금한 점을<br />빠르게 해결하세요.</h1><p>제품 선택부터 소모품 교체, 장치 연결까지 모스가드 팀이 도와드립니다.</p></div><div><span>이메일 상담</span><a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a><small>평일 10:00–17:00 · 주말/공휴일 제외</small></div></div>
        <section className={styles.supportGrid}><div><p className={styles.eyebrow}>FREQUENTLY ASKED</p><h2>자주 묻는 질문</h2><div className={styles.faqList}>{supportFaqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></div><div className={styles.contactCard}><p className={styles.eyebrow}>1:1 INQUIRY</p><h2>문의 남기기</h2>{supportTicket ? <div className={styles.ticketSuccess}><b>✓</b><h3>문의가 접수되었습니다.</h3><p>접수 번호 <strong>{supportTicket}</strong></p><button onClick={() => setSupportTicket(null)}>새 문의 작성</button></div> : <form onSubmit={submitSupport}><label>이름<input name="name" required placeholder="이름을 입력하세요" /></label><label>이메일<input name="email" type="email" required placeholder="답변 받을 이메일" /></label><label>문의 유형<select name="category" required defaultValue=""><option value="" disabled>선택하세요</option><option>제품 문의</option><option>배송 문의</option><option>소모품 문의</option><option>장치 연결</option><option>기타</option></select></label><label>문의 내용<textarea name="content" required minLength={10} placeholder="궁금한 내용을 10자 이상 입력하세요" /></label>{supportError && <p className={styles.formError}>{supportError}</p>}<button className={styles.primary} type="submit">문의 접수하기 <span>→</span></button></form>}</div></section>
      </section>}

      {view === "device" && <section className={styles.pageSection}>
        <div className={styles.sectionTitle}><div><p className={styles.eyebrow}>MY DEVICE · INTERACTIVE 3D</p><h1>제품을 돌려보고<br />오늘의 포획을 제어하세요.</h1></div><small>드래그 · 화살표 키 지원</small></div>
        <div className={styles.productTabs}>{catalogProducts.map((product) => <button className={product.id === selectedProduct.id ? styles.selectedTab : ""} key={product.id} onClick={() => { setSelectedProduct(product); setCaptured(0); setElapsedSeconds(0); setDeviceOn(false); }}>{product.name.replace("모스가드 ", "")}</button>)}</div>
        <div className={styles.deviceGrid}>
          <ProductModel3D product={selectedProduct} active={deviceOn} mode={mode} />
          <div className={styles.controlPanel}>
            <div><span>연결된 장치</span><b>{selectedProduct.name}</b><small>Wi-Fi 안정 · 포획 랭킹 #{selectedRank}</small></div>
            <div className={styles.liveStats}><span><small>작동 시간</small><b>{runtimeText(elapsedSeconds)}</b></span><span><small>실시간 제거</small><b>{captured}마리</b></span></div>
            <hr />
            <p>장치 전원</p><button className={`${styles.toggle} ${deviceOn ? styles.toggleOn : ""}`} onClick={() => setDeviceOn(!deviceOn)} aria-label="장치 전원 전환"><span /></button><b className={styles.powerState}>{deviceOn ? `${mode} 모드로 유인 · 포획 중` : "전원이 꺼져 있습니다"}</b>
            <hr />
            <p>작동 모드와 발광</p>
            <div className={styles.modeButtons}>{(["자동", "수동", "강력"] as DeviceMode[]).map((item) => <button className={mode === item ? styles.modeSelected : ""} key={item} onClick={() => setMode(item)} style={mode === item ? { borderColor: modeColors[item], color: modeColors[item], background: `${modeColors[item]}14` } : undefined}><i style={{ background: modeColors[item] }} />{item}</button>)}</div>
            <p className={styles.modeDescription}>{modeDescriptions[mode]}</p>
            <div className={styles.capture} aria-live="polite"><span>시간이 지나며 포획된 모기</span><b>{captured} <small>마리 제거</small></b><div className={styles.capturePulse}>{deviceOn ? "모기가 발광부로 유인되어 자동 포획되고 있습니다." : "전원을 켜면 포획 시뮬레이션이 시작됩니다."}</div><button onClick={() => deviceOn && setCaptured((value) => value + 1)} disabled={!deviceOn}>{mode === "수동" ? "수동 포획 +1" : "포획 테스트 +1"}</button></div>
          </div>
        </div>
      </section>}

      {view === "checkout" && <section className={styles.checkout}>
        <button className={styles.back} onClick={() => navigate(selectedSupply ? "supplies" : "detail")}>← 이전 화면</button><div className={styles.checkoutGrid}><form onSubmit={submitOrder}><p className={styles.eyebrow}>CHECKOUT</p><h1>주문 정보를 입력하세요</h1><label>받는 분<input name="name" required placeholder="이름을 입력하세요" /></label><label>연락처<input name="phone" type="tel" required placeholder="010-0000-0000" /></label><label>배송지<textarea name="address" required placeholder="주소를 입력하세요" /></label><fieldset><legend>결제 수단</legend><label><input type="radio" name="payment" value="카드" required /> 카드 결제</label><label><input type="radio" name="payment" value="간편결제" /> 간편결제</label></fieldset><button className={styles.primary} type="submit" disabled={submitting}>{submitting ? "주문 처리 중…" : "결제하고 주문하기 →"}</button><p className={styles.demoNote}>시연용 주문입니다. 실제 결제는 진행되지 않습니다.</p></form><aside>{isProduct(purchaseItem) ? <img src={purchaseItem.image} alt={purchaseItem.name} /> : <div className={styles.checkoutSupply} style={{ background: purchaseItem.color }}>{purchaseItem.icon}</div>}<p>{purchaseItem.name}</p><b>{won(purchaseItem.price)}</b><hr /><span>예상 배송</span><strong>{isProduct(purchaseItem) ? deliveryText(purchaseItem) : "1~2영업일 도착 예상"}</strong></aside></div>
      </section>}

      {view === "complete" && <section className={styles.complete}><div>✓</div><p className={styles.eyebrow}>ORDER COMPLETE</p><h1>주문이 완료되었습니다.</h1><p>{order?.itemName || purchaseItem.name} 주문을 안전하게 접수했습니다.</p><dl><dt>주문 번호</dt><dd>{order?.id || "ORDER-DEMO"}</dd><dt>배송지</dt><dd>{order?.address || "입력된 배송지"}</dd><dt>예상 배송</dt><dd>{order?.delivery || "1~3영업일"}</dd><dt>결제 금액</dt><dd>{won(order?.total || purchaseItem.price)}</dd></dl><button className={styles.primary} onClick={() => navigate("home")}>쇼핑 계속하기 <span>→</span></button></section>}

      <footer className={styles.footer}><div><button className={styles.brand} onClick={() => navigate("home")}>mosq<span>guard</span></button><p>사람의 생활 공간을 이해하는 조용한 모기 포획 솔루션</p></div><div><b>고객지원</b><button onClick={() => navigate("support")}>자주 묻는 질문</button><button onClick={() => navigate("support")}>1:1 문의</button><a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a></div><div><b>사업자 정보</b><span>상호: {companyInfo.name}</span><span>주소: {companyInfo.address}</span><span>사업자등록번호: {companyInfo.businessNumber}</span><small>본 사이트는 시연·발표용이며 실제 결제가 진행되지 않습니다.</small></div></footer>
    </main>
  );
}
