import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date)
}

export function paginate<T>(items: T[], page: number, perPage = 20): { data: T[]; total: number; pages: number } {
  const start = (page - 1) * perPage
  return {
    data: items.slice(start, start + perPage),
    total: items.length,
    pages: Math.ceil(items.length / perPage),
  }
}

export function apiError(message: string, status = 400) {
  return Response.json({ error: message }, { status })
}

export function apiOk<T>(data: T, status = 200) {
  return Response.json({ data }, { status })
}
