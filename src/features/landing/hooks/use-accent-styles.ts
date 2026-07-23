import { useMotionTemplate, type MotionValue } from 'motion/react'

export function useAccentStyles(color: MotionValue<string>) {
  return {
    titleGradient: useMotionTemplate`linear-gradient(90deg, ${color}, color-mix(in oklab, var(--foreground) 70%, transparent))`,
    border: useMotionTemplate`1px solid ${color}`,
    boxShadow: useMotionTemplate`0px 4px 24px ${color}`,
  }
}
