import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { costumePhotos } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sizeRange = searchParams.get('size');

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
      : await db
          .select({
            id: costumePhotos.id,
            sizeRange: costumePhotos.sizeRange,
            imageData: costumePhotos.imageData,
            caption: costumePhotos.caption,
          })
          .from(costumePhotos)
          .orderBy(asc(costumePhotos.sizeRange), asc(costumePhotos.displayOrder), asc(costumePhotos.createdAt));

    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
