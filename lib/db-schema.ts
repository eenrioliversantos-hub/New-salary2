import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const blogComments = pgTable('blog_comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  articleId: text('article_id').notNull(),
  authorName: text('author_name').notNull(),
  authorEmail: text('author_email'),
  body: text('body').notNull(),
  status: text('status').notNull().default('published'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
