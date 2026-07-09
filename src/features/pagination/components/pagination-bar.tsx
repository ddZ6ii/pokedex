import { motion, type Variants } from 'motion/react'
import { useTransition } from 'react'

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

  // ℹ️ Why `useTransition`?
  //
  // 🔴 Problem
  // `useSuspenseQuery` unmounts the current UI while fetching:
  // -> jumpy UI alterning between the content and the fallback
  // -> poor UX on each page transition
  //
  // 🟢 Solution
  // Show stale data while fetching new data in the background
  // to prevents the UI from being replaced by a fallback during
  // an update.
  // However, `useSuspenseQuery` has no `placeholderData` /
  // `keepPreviousData` escape hatch (that's a useQuery-only feature).
  // To work around this, we can use React `startTransition` to delay
  // the update of the QueryKey until after the new data has been
  // fetched:
  //  -> wrap the updates that change the QueryKey with React `startTransition`
  //  -> pass `isPending` state to disable controls until the transition settles
  //
  // Share the same transition state between Pagination and PageSizePicker to disable both controls during any transition
  const [isPending, startTransition] = useTransition()

  if (maxPage <= 1) return null

  return (
    <motion.nav
      aria-label="Pagination"
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
      <Pagination
        disabled={isPending}
        maxPage={maxPage}
        startTransition={startTransition}
      />

      <PageSizeControl
        totalItems={totalItems}
        disabled={isPending}
        startTransition={startTransition}
      />
    </motion.nav>
  )
}
