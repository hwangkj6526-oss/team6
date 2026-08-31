import "./globals.css";

export const metadata = {
  title: "모스가드 | 모기 포획 솔루션",
  description: "모기 포획 장치 쇼핑과 제어 시연"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
