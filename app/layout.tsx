import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ひつじの衣装 | Jungle Studio',
  description: 'ジャングルスタジオのお子様衣装をサイズ別にご覧いただけます',
  icons: { icon: '/hitsuji.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
