import { NextRequest, NextResponse } from 'next/server'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { blogComments } from '@/lib/db-schema'

export async function GET(request: NextRequest) {
  const articleId = request.nextUrl.searchParams.get('articleId')?.trim()
  if (!articleId) return NextResponse.json({ error: 'articleId é obrigatório' }, { status: 400 })
  const comments = await db.select({ id: blogComments.id, authorName: blogComments.authorName, body: blogComments.body, createdAt: blogComments.createdAt }).from(blogComments).where(eq(blogComments.articleId, articleId)).orderBy(desc(blogComments.createdAt)).limit(50)
  return NextResponse.json({ comments })
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null)
  const articleId = typeof payload?.articleId === 'string' ? payload.articleId.trim() : ''
  const authorName = typeof payload?.authorName === 'string' ? payload.authorName.trim() : ''
  const authorEmail = typeof payload?.authorEmail === 'string' ? payload.authorEmail.trim().slice(0, 160) : null
  const body = typeof payload?.body === 'string' ? payload.body.trim() : ''
  if (!articleId || authorName.length < 2 || body.length < 3 || body.length > 2000) return NextResponse.json({ error: 'Preencha nome e comentário válido.' }, { status: 400 })
  const [comment] = await db.insert(blogComments).values({ articleId, authorName: authorName.slice(0, 80), authorEmail, body }).returning({ id: blogComments.id, authorName: blogComments.authorName, body: blogComments.body, createdAt: blogComments.createdAt })
  return NextResponse.json({ comment }, { status: 201 })
}
