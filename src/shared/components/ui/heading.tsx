import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const headingVariants = cva('scroll-m-20 tracking-tight ', {
  variants: {
    as: {
      h1: 'text-2xl lg:text-4xl font-extrabold text-balance',
      h2: 'text-xl lg:text-3xl font-semibold first:mt-0',
      h3: 'text-lg lg:text-2xl font-semibold',
      h4: 'text-md lg:text-xl font-semibold',
      h5: 'text-base lg:text-lg font-bold',
      h6: 'text-sm lg:text-base font-bold',
    },
  },
  defaultVariants: {
    as: 'h2',
  },
})

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    as?: HeadingTag
  }

function Heading({ className, as = 'h2', ...props }: HeadingProps) {
  const Tag = as
  return <Tag className={cn(headingVariants({ as, className }))} {...props} />
}

// eslint-disable-next-line react-refresh/only-export-components -- shadcn/ui convention: variants co-located with component
export { Heading, headingVariants }
