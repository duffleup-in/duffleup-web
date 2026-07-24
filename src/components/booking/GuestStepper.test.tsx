import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GuestStepper } from './GuestStepper'

const baseProps = {
  adults: 1,
  childrenCount: 0,
  infants: 0,
  onAdultsChange: vi.fn(),
  onChildrenChange: vi.fn(),
  onInfantsChange: vi.fn(),
  onSubmit: vi.fn(),
  moodName: 'Chill',
}

const renderStepper = (props = {}) =>
  render(<GuestStepper {...baseProps} {...props} />)

describe('GuestStepper', () => {
  it('renders all three tiers with their descriptors', () => {
    renderStepper()
    expect(screen.getByText('Adults')).toBeInTheDocument()
    expect(screen.getByText('Ages 12+')).toBeInTheDocument()
    expect(screen.getByText('Children')).toBeInTheDocument()
    expect(screen.getByText('Ages 2–12')).toBeInTheDocument()
    expect(screen.getByText('Infants')).toBeInTheDocument()
    expect(screen.getByText('Under 2')).toBeInTheDocument()
  })

  it('increments a tier through its change handler', async () => {
    const onAdultsChange = vi.fn()
    renderStepper({ onAdultsChange })

    await userEvent.click(screen.getByRole('button', { name: /add one adult/i }))

    expect(onAdultsChange).toHaveBeenCalledWith(2)
  })

  it('disables the adults minus at 1 and children minus at 0', () => {
    renderStepper({ adults: 1, childrenCount: 0 })
    expect(screen.getByRole('button', { name: /remove one adult/i })).toBeDisabled()
    expect(
      screen.getByRole('button', { name: /remove one child/i })
    ).toBeDisabled()
  })

  it('allows decrementing adults above the floor', async () => {
    const onAdultsChange = vi.fn()
    renderStepper({ adults: 3, onAdultsChange })

    await userEvent.click(
      screen.getByRole('button', { name: /remove one adult/i })
    )

    expect(onAdultsChange).toHaveBeenCalledWith(2)
  })

  it('disables every plus once the combined total hits 60', () => {
    renderStepper({ adults: 58, childrenCount: 1, infants: 1 })
    expect(screen.getByRole('button', { name: /add one adult/i })).toBeDisabled()
    expect(
      screen.getByRole('button', { name: /add one child/i })
    ).toBeDisabled()
    expect(
      screen.getByRole('button', { name: /add one infant/i })
    ).toBeDisabled()
  })

  it('submits with a mood-labelled CTA', async () => {
    const onSubmit = vi.fn()
    renderStepper({ moodName: 'Romance', onSubmit })

    const cta = screen.getByRole('button', { name: /see romance stays/i })
    await userEvent.click(cta)

    expect(onSubmit).toHaveBeenCalledOnce()
  })
})
