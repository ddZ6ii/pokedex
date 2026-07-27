import { useMotionTemplate, type MotionValue } from 'motion/react'

// eslint-disable-next-line react-x/no-unnecessary-use-prefix -- useMotionTemplate is a hook, but the rule can't see it because it's invoked as a tagged template, not a call expression
export function useAccentStyles(color: MotionValue<string>) {
  const titleGradient = useMotionTemplate`linear-gradient(90deg, ${color}, color-mix(in oklab, var(--foreground) 70%, transparent))`
  const border = useMotionTemplate`1px solid ${color}`
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`

  return {
    titleGradient,
    border,
    boxShadow,
  }
}
