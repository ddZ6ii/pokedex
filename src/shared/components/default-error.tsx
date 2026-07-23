import { useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { AlertCircleIcon, RefreshCcw } from 'lucide-react'

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

type ErrorMessageProps = ErrorComponentProps &
  React.ComponentProps<typeof Alert> & {
    containerClassName?: string
  }

function DefaultErrorComponent({
  className,
  containerClassName,
  ...props
}: ErrorMessageProps) {
  const router = useRouter()

  const { error, reset, info: _, ...restProps } = props

  return (
    <div
      className={cn('flex flex-1 flex-col justify-center', containerClassName)}
    >
      <Alert
        {...restProps}
        variant="destructive"
        className={cn(
          '*: mx-auto max-w-lg has-data-[slot=alert-action]:pr-2.5',
          className,
        )}
      >
        <AlertCircleIcon />
        <AlertTitle className="text-base">Failed to load this page.</AlertTitle>
        <AlertDescription>
          <pre className="w-full min-w-0 text-sm wrap-anywhere whitespace-pre-line">
            {error.message}
          </pre>
        </AlertDescription>
        <AlertAction className="static col-start-2 my-2 pr-2.5!">
          <Button
            type="button"
            variant="outline"
            className="text-foreground"
            onClick={async () => {
              await router.invalidate() // re-runs loaders
              reset() // resets the boundary in case it was a render error
            }}
          >
            <RefreshCcw />
            <span>Retry</span>
          </Button>
        </AlertAction>
      </Alert>
    </div>
  )
}

function RootErrorComponent(props: ErrorComponentProps) {
  return (
    <DefaultErrorComponent
      containerClassName="min-h-screen grid place-content-center"
      {...props}
    />
  )
}

export { DefaultErrorComponent, RootErrorComponent }
