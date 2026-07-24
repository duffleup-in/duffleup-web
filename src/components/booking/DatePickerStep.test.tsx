import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatePickerStep } from './DatePickerStep'

const baseProps = {
  checkin: null,
  checkout: null,
  onRangeChange: vi.fn(),
  onSkip: vi.fn(),
}

const renderStep = (props = {}) =>
  render(<DatePickerStep {...baseProps} {...props} />)

const WARNING = 'Weekend app. Longer stays welcome. Options get thinner.'

describe('DatePickerStep', () => {
  it('renders a calendar grid', () => {
    renderStep()
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('disables Next until a valid range is present', () => {
    renderStep()
    expect(screen.getByRole('button', { name: /next →/i })).toBeDisabled()
  })

  it('enables Next and commits the range when both dates are set', async () => {
    const onRangeChange = vi.fn()
    const checkin = new Date(2026, 7, 5)
    const checkout = new Date(2026, 7, 8)
    renderStep({ checkin, checkout, onRangeChange })

    const next = screen.getByRole('button', { name: /next →/i })
    expect(next).toBeEnabled()

    await userEvent.click(next)
    expect(onRangeChange).toHaveBeenCalledWith({ checkin, checkout })
  })

  it('shows no soft-cap warning for a short stay', () => {
    renderStep({ checkin: new Date(2026, 7, 5), checkout: new Date(2026, 7, 8) })
    expect(screen.queryByText(WARNING)).not.toBeInTheDocument()
  })

  it('shows the soft-cap warning past seven nights', () => {
    renderStep({ checkin: new Date(2026, 7, 5), checkout: new Date(2026, 7, 15) })
    expect(screen.getByText(WARNING)).toBeInTheDocument()
  })

  it('routes through onSkip from the See stays link', async () => {
    const onSkip = vi.fn()
    renderStep({ onSkip })

    await userEvent.click(screen.getByRole('button', { name: /see stays/i }))
    expect(onSkip).toHaveBeenCalledOnce()
  })
})
