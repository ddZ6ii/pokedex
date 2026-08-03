import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ErrorFallback } from '@/shared/components/error-fallback'

class FakeStatusError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

describe('ErrorFallback', () => {
  it('hides the retry button for any error carrying a status below 500, not just HttpError', () => {
    render(
      <ErrorFallback
        error={new FakeStatusError(404, 'Not found')}
        resetErrorBoundary={vi.fn()}
      />,
    )
    expect(
      screen.queryByRole('button', { name: /retry/i }),
    ).not.toBeInTheDocument()
  })

  it('shows the retry button for a status of 500 or above', () => {
    render(
      <ErrorFallback
        error={new FakeStatusError(500, 'Server error')}
        resetErrorBoundary={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('shows the retry button for an error with no status field at all', () => {
    render(
      <ErrorFallback error={new Error('boom')} resetErrorBoundary={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })
})
