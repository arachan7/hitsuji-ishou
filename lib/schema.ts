import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const costumePhotos = pgTable('costume_photos', {
  id: serial('id').primaryKey(),
  sizeRange: text('size_range').notNull(),
  imageData: text('image_data').notNull(),
  caption: text('caption'),
  displayOrder: integer('display_order').notNull().default(0),
  uploadedBy: text('uploaded_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
