import { Header } from '@/shared/components'
import { cn } from '@/shared/lib/utils'

export function PageLayout({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        'relative container mx-auto flex min-h-screen flex-col p-3',
        className,
      )}
    >
      <Header />

      <main className="flex-1">{children}</main>
    </div>
  )
}
