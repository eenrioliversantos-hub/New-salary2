'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Check, Clock3, MessageCircle, Send, Share2 } from 'lucide-react'

export function BlogEngagement({ articleId, title }: { articleId: string; title: string }) {
  const [comments, setComments] = useState<Array<{ id: string; authorName: string; body: string; createdAt: string }>>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => { fetch(`/api/blog/comments?articleId=${encodeURIComponent(articleId)}`).then((r) => r.ok ? r.json() : { comments: [] }).then((data) => setComments(data.comments ?? [])).catch(() => undefined) }, [articleId])
  const share = async () => { const url = window.location.href; if (navigator.share) await navigator.share({ title, url }); else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800) } }
  const submit = async (event: FormEvent) => { event.preventDefault(); const response = await fetch('/api/blog/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ articleId, authorName: name, authorEmail: email, body }) }); if (!response.ok) return; const data = await response.json(); setComments((current) => [data.comment, ...current]); setName(''); setEmail(''); setBody(''); setSent(true); setTimeout(() => setSent(false), 2200) }

  return <section className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-label="Engajamento do artigo">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Participe da conversa</p><h2 className="mt-1 text-xl font-black text-slate-950">Comentários da comunidade</h2><p className="mt-1 text-sm text-slate-500">Compartilhe uma dúvida ou experiência com outros leitores.</p></div><button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700">{copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}{copied ? 'Link copiado' : 'Compartilhar'}</button></div>
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2"><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail (opcional)" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" /><textarea required minLength={3} maxLength={2000} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Escreva seu comentário..." className="min-h-24 resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 sm:col-span-2" /><div className="flex items-center justify-between sm:col-span-2"><span className="text-xs text-slate-400">Seu comentário será publicado após o envio.</span><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-black text-white hover:bg-blue-800">{sent ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}{sent ? 'Publicado' : 'Publicar comentário'}</button></div></form>
    <div className="space-y-3">{comments.length === 0 ? <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500"><MessageCircle className="h-5 w-5 text-blue-600" />Ainda não há comentários. Seja o primeiro a participar.</div> : comments.map((comment) => <article key={comment.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"><div className="flex items-center justify-between gap-2"><strong className="text-sm text-slate-900">{comment.authorName}</strong><time className="flex items-center gap-1 text-[11px] text-slate-400"><Clock3 className="h-3 w-3" />{new Date(comment.createdAt).toLocaleDateString('pt-BR')}</time></div><p className="mt-2 text-sm leading-6 text-slate-700">{comment.body}</p></article>)}</div>
  </section>
}
