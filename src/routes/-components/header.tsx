import { Logo, ModeSelect } from '@/routes/-components'
import { cn } from '@/shared/lib/utils'

export function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        'flex items-center justify-between gap-4 px-4 py-2',
        className,
      )}
    >
      <Logo />
      <ModeSelect />
    </header>
  )
}
