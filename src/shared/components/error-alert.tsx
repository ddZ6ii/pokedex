import { AlertCircleIcon } from 'lucide-react'

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

type ErrorAlertProps = Omit<React.ComponentProps<typeof Alert>, 'children'> & {
  title?: string
  errorMessage: string
  onRetry?: () => void
}

export function ErrorAlert({
  className,
  errorMessage,
  onRetry,
  title = 'Something went wrong',
  ...props
}: ErrorAlertProps) {
  return (
    <Alert
      variant="destructive"
      className={cn(
        'mx-auto max-w-md md:has-data-[slot=alert-action]:pr-24 *:[svg]:relative *:[svg]:top-0.5 md:*:[svg]:top-1',
        className,
      )}
      {...props}
    >
      <AlertCircleIcon aria-hidden={true} />
      <AlertTitle className="md:text-lg">{title}</AlertTitle>
      <AlertDescription>
        <pre className="text-xs whitespace-normal md:text-sm">
          {errorMessage}
        </pre>
      </AlertDescription>
      {onRetry && (
        <AlertAction>
          <Button variant="secondary" onClick={onRetry}>
            Retry
          </Button>
        </AlertAction>
      )}
    </Alert>
  )
}
