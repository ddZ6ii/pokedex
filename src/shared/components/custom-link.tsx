import { createLink, type LinkComponent } from '@tanstack/react-router'

import { AnimatedButton, type AnimatedButtonProps } from '@/shared/components'
import { Button, type ButtonProps } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

function BasicLinkComponent({
  ref,
  children,
  variant = 'link',
  ...props
}: ButtonProps) {
  return (
    <Button ref={ref} variant={variant} {...props}>
      {children}
    </Button>
  )
}

function AnimatedLinkComponent({
  ref,
  children,
  className,
  variant = 'link',
  ...props
}: AnimatedButtonProps) {
  return (
    <AnimatedButton
      ref={ref}
      className={cn(
        'group mx-auto w-fit rounded-full no-underline!',
        className,
      )}
      variant={variant}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      {...props}
    >
      {children}
    </AnimatedButton>
  )
}

const CreatedLinkComponent = createLink(BasicLinkComponent)
const CreatedAnimatedLinkComponent = createLink(AnimatedLinkComponent)

export const CustomLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return (
    <CreatedLinkComponent
      preload={'intent'}
      activeProps={{
        className: 'font-semibold',
      }}
      inactiveProps={{
        className: 'text-muted-foreground',
      }}
      {...props}
    />
  )
}

export const CustomAnimatedLink: LinkComponent<typeof AnimatedLinkComponent> = (
  props,
) => {
  return <CreatedAnimatedLinkComponent preload={'intent'} {...props} />
}
