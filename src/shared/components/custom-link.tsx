import { createLink, type LinkComponent } from '@tanstack/react-router'
import type { VariantProps } from 'class-variance-authority'
import { motion, type HTMLMotionProps } from 'motion/react'

import { buttonVariants, type ButtonProps } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

function BasicLinkComponent({
  ref,
  children,
  className,
  size,
  variant = 'link',
  ...props
}: Omit<ButtonProps, 'asChild' | 'loading' | 'dataIcon'> &
  React.ComponentProps<'a'>) {
  return (
    <a
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </a>
  )
}

type AnimatedLinkProps = HTMLMotionProps<'a'> &
  VariantProps<typeof buttonVariants>

function AnimatedLink({
  children,
  className,
  key,
  size = 'default',
  variant = 'default',
  ...motionProps
}: HTMLMotionProps<'a'> & VariantProps<typeof buttonVariants>) {
  return (
    <motion.a
      key={key}
      className={cn(
        buttonVariants({ variant, size }),
        'transition-colors',
        className,
      )}
      {...motionProps}
    >
      {children}
    </motion.a>
  )
}

function AnimatedLinkComponent({
  ref,
  children,
  className,
  key,
  variant = 'link',
  ...props
}: AnimatedLinkProps) {
  return (
    <AnimatedLink
      key={key}
      ref={ref}
      variant={variant}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className={cn(
        'group mx-auto w-fit rounded-full no-underline!',
        className,
      )}
      {...props}
    >
      {children}
    </AnimatedLink>
  )
}

const CreatedLinkComponent = createLink(BasicLinkComponent)
const CreatedAnimatedLinkComponent = createLink(AnimatedLinkComponent)

const CustomLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return (
    <CreatedLinkComponent
      preload={'intent'}
      activeProps={{
        className: 'font-semibold text-foreground',
      }}
      inactiveProps={{
        className: 'text-muted-foreground',
      }}
      {...props}
    />
  )
}

const CustomAnimatedLink: LinkComponent<typeof AnimatedLinkComponent> = (
  props,
) => {
  return <CreatedAnimatedLinkComponent preload={'intent'} {...props} />
}

export { CustomLink, CustomAnimatedLink }
