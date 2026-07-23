import { motion, type HTMLMotionProps } from 'motion/react'

import { Button, type ButtonProps } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

type ConflictingKeys =
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'

type AnimatedButtonProps = Omit<
  ButtonProps,
  'asChild' | 'loading' | 'dataIcon' | 'style' | ConflictingKeys
> &
  Omit<HTMLMotionProps<'button'>, Exclude<keyof ButtonProps, 'style'>>

function AnimatedButton({
  children,
  className,
  size = 'default',
  type = 'button',
  variant = 'default',
  ...motionProps
}: AnimatedButtonProps) {
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      type={type}
      className={cn('transition-colors', className)}
    >
      <motion.button {...motionProps}>{children}</motion.button>
    </Button>
  )
}

export { AnimatedButton, type AnimatedButtonProps }
