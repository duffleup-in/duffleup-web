import { describe, it, expect } from 'vitest'
import { formatPrice } from './format-price'

describe('formatPrice', () => {
  it('formats basic amounts', () => {
    expect(formatPrice(800000)).toBe('₹8,000')
  })

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('₹0')
  })

  it('groups large amounts with the Indian numbering system', () => {
    expect(formatPrice(1000000000)).toBe('₹1,00,00,000')
  })
})
