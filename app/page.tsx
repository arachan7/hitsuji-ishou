'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { COSTUME_SIZES, type CostumeSize } from '@/data/costumes';

type Photo = { id: number; sizeRange: string; imageData: string; caption: string | null };

const SIZE_LABELS: Record<CostumeSize, string> = {
  '50-60':   '50〜60cm',
  '70-80':   '70〜80cm',
  '80-90':   '80〜90cm',
  '90-100':  '90〜100cm',
  '100-110': '100〜110cm',
  '110-120': '110〜120cm',
  '120-130': '120〜130cm',
};

export default function HitsujiPage() {
  const [selectedSize, setSelectedSize] = useState<CostumeSize>('90-100');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ src: string; caption?: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/photos?size=${selectedSize}`)
      .then((r) => {
        if (!r.ok) {
          throw new Error('Failed to load photos');
        }
        return r.json();
      })
      .then((data: Photo[]) => { if (!cancelled) { setPhotos(data); setLoading(false); } })
      .catch(() => { if (!cancelled) { setPhotos([]); setLoading(false); } });
    return () => { cancelled = true; };
  }, [selectedSize]);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fdf8f0 0%, #fce4ec22 100%)' }}>
      {/* ヘッダー */}
      <header
        className="relative overflow-hidden py-8 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #e1bee7 100%)' }}
      >
        <div className="absolute top-2 left-4 opacity-30 text-5xl select-none pointer-events-none">☁️</div>
        <div className="absolute top-4 right-8 opacity-20 text-4xl select-none pointer-events-none">☁️</div>
        <div className="absolute bottom-4 left-16 opacity-15 text-3xl select-none pointer-events-none">☁️</div>

        <div className="relative z-10 flex flex-col items-center gap-2">
          <div style={{ animation: 'float 3s ease-in-out infinite' }}>
            <Image src="/hitsuji.png" alt="ひつじ" width={90} height={90} className="drop-shadow-lg" priority />
          </div>
          <h1 className="text-3xl font-black tracking-wide" style={{ color: '#7b3f6e', textShadow: '0 2px 8px rgba(255,255,255,0.8)' }}>
            ひつじの衣装
          </h1>
          <p className="text-sm" style={{ color: '#a0607a' }}>Jungle Studio ✦ お子様衣装コレクション</p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-5">
          <svg viewBox="0 0 1200 20" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,20 C200,0 400,20 600,10 C800,0 1000,20 1200,10 L1200,20 Z" fill="#fdf8f0" />
          </svg>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-16">
        {/* サイズ選択 */}
        <section className="mb-8">
          <p className="text-center text-xs font-semibold mb-4" style={{ color: '#b07070' }}>
            🐑 サイズを選んでね 🐑
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {COSTUME_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className="px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 shadow-sm"
                style={
                  selectedSize === size
                    ? { background: 'linear-gradient(135deg, #f48fb1, #ce93d8)', color: '#fff', transform: 'scale(1.05)', boxShadow: '0 4px 12px rgba(206,147,216,0.5)' }
                    : { background: '#fff', color: '#9e6080', border: '2px solid #f8bbd0' }
                }
              >
                {SIZE_LABELS[size]}
              </button>
            ))}
          </div>
        </section>

        {/* 写真グリッド */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🐑</span>
            <h2 className="font-black text-lg" style={{ color: '#7b3f6e' }}>{SIZE_LABELS[selectedSize]} の衣装</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold ml-auto" style={{ background: '#fce4ec', color: '#b07070' }}>
              {photos.length}着
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-16 gap-4">
              <div style={{ animation: 'float 3s ease-in-out infinite' }}><Image src="/hitsuji.png" alt="ひつじ" width={60} height={60} /></div>
              <p className="text-sm" style={{ color: '#c09090' }}>読み込み中...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <Image src="/hitsuji.png" alt="ひつじ" width={60} height={60} className="opacity-40" />
              <p className="text-sm font-semibold" style={{ color: '#c0a0a0' }}>
                このサイズの衣装はまだ登録されていません
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setLightbox({ src: photo.imageData, caption: photo.caption ?? undefined })}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border-2 text-left transition-all duration-200"
                  style={{ borderColor: '#fce4ec' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(206,147,216,0.3)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
                >
                  <div className="relative aspect-square">
                    <Image src={photo.imageData} alt={photo.caption ?? `衣装 ${selectedSize}`} fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" style={{ background: 'rgba(248,187,208,0.3)' }}>
                      <span className="text-2xl">🔍</span>
                    </div>
                  </div>
                  {photo.caption && (
                    <p className="text-xs px-2 py-1.5 truncate font-semibold" style={{ color: '#9e6080', background: '#fdf8f0' }}>{photo.caption}</p>
                  )}

                </button>
              ))}
            </div>
          )}
        </section>

        {/* 予約ボタン */}
        <div className="mt-12 flex justify-center">
          <a
            href="https://studio-app-two.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 rounded-full font-black text-base shadow-lg transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #f48fb1, #ce93d8)',
              color: '#fff',
              boxShadow: '0 6px 20px rgba(206,147,216,0.5)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.04)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = ''; }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            撮影の予約・料金はこちら
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <footer className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full" style={{ background: '#fce4ec' }}>
            <Image src="/hitsuji.png" alt="ひつじ" width={22} height={22} />
            <span className="text-xs font-semibold" style={{ color: '#9e6080' }}>Jungle Studio</span>
          </div>
        </footer>
      </main>

      {/* ライトボックス */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={() => setLightbox(null)}>
          <div className="relative max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl" style={{ background: '#fdf8f0' }} onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
              <Image src={lightbox.src} alt={lightbox.caption ?? '衣装'} fill className="object-contain" />
            </div>
            {lightbox.caption && (
              <p className="text-center font-semibold py-3 px-4" style={{ color: '#7b3f6e' }}>{lightbox.caption}</p>
            )}
            <button onClick={() => setLightbox(null)} className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center font-black text-lg shadow" style={{ background: '#fce4ec', color: '#9e6080' }}>✕</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
