import { describe, expect, it } from 'vitest'
import { formatLyd, formatNumber } from './money'

describe('formatLyd — عقد الدينار الليبي', () => {
  it('يُلحق « د.ل» ويلغي الكسور الصفرية', () => {
    expect(formatLyd(19)).toBe('19 د.ل')
    expect(formatLyd(0)).toBe('0 د.ل')
  })

  it('يجمع بفواصل ar-LY (نقاط) ويُبقي الكسور بفاصلة', () => {
    expect(formatLyd(1234)).toBe('1.234 د.ل')
    expect(formatLyd(1234567)).toBe('1.234.567 د.ل')
    expect(formatLyd(19.5)).toBe('19,50 د.ل')
    expect(formatLyd(1234.25)).toBe('1.234,25 د.ل')
  })

  it('يقبل السالب ويُعيّن الصفر لغير المنتهي', () => {
    expect(formatLyd(-45)).toBe('-45 د.ل')
    expect(formatLyd(Number.NaN)).toBe('0 د.ل')
    expect(formatLyd(Number.POSITIVE_INFINITY)).toBe('0 د.ل')
  })

  it('يقرب لأقرب هللة (نفس عقد الويب)', () => {
    expect(formatLyd(19.999)).toBe('20 د.ل')
    expect(formatLyd(10.005)).toBe('10,01 د.ل')
  })
})

describe('formatNumber — صيغة مجردة', () => {
  it('يجمع بلا لاحقة', () => {
    expect(formatNumber(1500)).toBe('1.500')
    expect(formatNumber(42)).toBe('42')
  })
})
