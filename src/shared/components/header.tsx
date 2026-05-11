import { motion, type Variants } from 'motion/react'

import { Logo, ModeSelect } from '@/shared/components'
import { useScrollVisibility, useSystemModeSync } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'

const variants: Variants = {
  hidden: {
    opacity: 0,
    y: '-200%',
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

export function Header({ className }: { className?: string }) {
  const hidden = useScrollVisibility(0.05, 'down')
  useSystemModeSync()

  return (
    <motion.header
      className={cn(
        'sticky top-4 z-10 flex items-center justify-between gap-4 rounded-lg px-4 py-2 backdrop-blur-sm',
        className,
      )}
      variants={variants}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{
        duration: 0.35,
        ease: 'easeInOut',
      }}
    >
      <Logo />
      <ModeSelect />
    </motion.header>
  )
}
