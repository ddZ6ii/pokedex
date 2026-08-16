import { motion, type Variants } from 'motion/react'

import { PageSizeControl } from '@/features/pagination/components/page-size-control'
import { Pagination } from '@/features/pagination/components/pagination'
import { useScrollVisibility } from '@/shared/hooks'
import { cn } from '@/shared/lib/utils'

const variants: Variants = {
  hidden: {
    opacity: 0,
    y: '200%',
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

export function PaginationBar({
  className,
  maxPage,
  totalItems,
}: {
  className?: string
  maxPage: number
  totalItems: number
}) {
  const hidden = useScrollVisibility(0.95, 'up', true)

  if (maxPage <= 1) return null

  return (
    <motion.nav
      aria-label="Pagination"
      inert={hidden}
      className={cn(
        'sticky bottom-4 z-10 flex w-full max-w-78 flex-col items-center gap-3 rounded-lg border px-4 py-2 text-sm backdrop-blur-sm md:max-w-125',
        className,
      )}
      variants={variants}
      initial="hidden"
      animate={hidden ? 'hidden' : 'visible'}
      transition={{
        duration: 0.35,
        ease: 'easeInOut',
      }}
    >
      <Pagination maxPage={maxPage} />

      <PageSizeControl totalItems={totalItems} />
    </motion.nav>
  )
}
