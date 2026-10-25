import type { TransactionKind } from '@/db/types'

// Symbol before the amount, as read in Colombia/Venezuela; COP spelled out so it never reads as USD.
const SYMBOL: Record<string, string> = { USD: '$', COP: 'COP', VES: 'Bs' }
const number = new Intl.NumberFormat('es', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' })

/** Formats integer minor units (2 decimals for every supported currency): 123450 COP → "COP 1.234,50". */
export function formatMinor(minor: number, currency: string): string {
  return `${minor < 0 ? '−' : ''}${SYMBOL[currency] ?? currency}\u00a0${number.format(Math.abs(minor) / 100)}`
}

export function formatDay(isoDate: string): string {
  // occurredOn is a plain date; parse at noon so the timezone never shifts the day.
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' })
}

export const KIND_LABEL: Record<TransactionKind, string> = {
  income: 'Ingreso',
  expense: 'Gasto',
  transfer: 'Transferencia',
  activity_payment: 'Pago de actividad',
  settlement: 'Liquidación',
}

/** +1 money in, -1 money out, 0 when the sign depends on context (transfers, settlements). */
export const KIND_SIGN: Record<TransactionKind, 1 | -1 | 0> = {
  income: 1,
  expense: -1,
  transfer: 0,
  activity_payment: -1,
  settlement: 0,
}

export const RATE_LABEL = {
  trm: 'TRM',
  bcv_usd: 'BCV $',
  bcv_eur: 'BCV €',
  binance_usdt: 'Binance USDT',
  p2p: 'P2P',
} as const
