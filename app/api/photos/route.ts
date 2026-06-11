import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { costumePhotos } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';
import { isCostumeSize } from '@/data/costumes';

const MAX_PHOTOS = 100;
const MAX_CAPTION_LENGTH = 120;
const MAX_IMAGE_DATA_LENGTH = 8 * 1024 * 1024;
const SAFE_IMAGE_DATA_PATTERN = /^data:image\/(?:png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/;
const PUBLIC_CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
  'X-Content-Type-Options': 'nosniff',
};
const ERROR_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

function isSafeImageData(value: string) {
  return value.length <= MAX_IMAGE_DATA_LENGTH && SAFE_IMAGE_DATA_PATTERN.test(value);
}

function normalizeCaption(caption: string | null) {
  if (!caption) {
    return null;
  }

  return caption.slice(0, MAX_CAPTION_LENGTH);
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: ERROR_HEADERS });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sizeRange = searchParams.get('size');

  if (sizeRange !== null && !isCostumeSize(sizeRange)) {
    return jsonError('Invalid size', 400);
  }

  try {
    const db = getDb();
    const rows = sizeRange
      ? await db
          .select({
            id: costumePhotos.id,
            sizeRange: costumePhotos.sizeRange,
            imageData: costumePhotos.imageData,
            caption: costumePhotos.caption,
          })
          .from(costumePhotos)
          .where(eq(costumePhotos.sizeRange, sizeRange))
          .orderBy(asc(costumePhotos.displayOrder), asc(costumePhotos.createdAt))
          .limit(MAX_PHOTOS)
      : await db
          .select({
            id: costumePhotos.id,
            sizeRange: costumePhotos.sizeRange,
            imageData: costumePhotos.imageData,
            caption: costumePhotos.caption,
          })
          .from(costumePhotos)
          .orderBy(asc(costumePhotos.sizeRange), asc(costumePhotos.displayOrder), asc(costumePhotos.createdAt))
          .limit(MAX_PHOTOS);

    const photos = rows
      .filter((row) => isSafeImageData(row.imageData) && isCostumeSize(row.sizeRange))
      .map((row) => ({
        ...row,
        caption: normalizeCaption(row.caption),
      }));

    return NextResponse.json(photos, { headers: PUBLIC_CACHE_HEADERS });
  } catch {
    return jsonError('Failed to load photos', 500);
  }
}
