import type { FallbackProps } from 'react-error-boundary'

import { ValidationError } from '@/shared/api'
import { ErrorAlert } from '@/shared/components'
import { cn } from '@/shared/lib/utils'

type ErrorFallbackProps = FallbackProps & {
  className?: string
  title?: string
  variant?: React.ComponentProps<typeof ErrorAlert>['variant']
}

function getStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) return undefined
  if ('status' in error && typeof error.status === 'number') {
    return error.status
  }
  // TanStack Router wraps errors thrown from a route's `params.parse` in its
  // own `PathParamError`, losing any `status` field on the original error —
  // the original is preserved as `cause`. Unwrap one level so a status set
  // there (e.g. a malformed-id error) is still honored.
  if ('cause' in error) return getStatus(error.cause)

  return undefined
}

function hasRecoverableStatus(error: unknown): boolean {
  const status = getStatus(error)
  // No status field at all (e.g. a network error) → usually transient →
  // recoverable. Only a *known* status < 500 is treated as non-recoverable.
  if (status === undefined) return true
  return status >= 500
}

export function ErrorFallback({
  className,
  error,
  resetErrorBoundary,
  title,
  variant = 'default',
}: ErrorFallbackProps) {
  // Validation errors are not recoverable (API contract broken) → non retryable.
  // Any status < 500 (4xx) → permanent → non retryable.
  // No status field, or 5xx, or unknown → retryable.
  const isRecoverable =
    !(error instanceof ValidationError) && hasRecoverableStatus(error)

  return (
    <div className={cn('grid place-content-center', className)}>
      <ErrorAlert
        title={title}
        errorMessage={error instanceof Error ? error.message : 'Unknown error'}
        onRetry={isRecoverable ? resetErrorBoundary : undefined}
        variant={variant}
      />
    </div>
  )
}
