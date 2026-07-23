import {
  animate,
  useMotionValue,
  type ValueAnimationTransition,
} from 'motion/react'
import { useEffect } from 'react'

import { nth } from '@/shared/utilities'

export function useColorCycle(
  colors: string[],
  options?: ValueAnimationTransition<string>,
) {
  const color = useMotionValue<string>(nth(colors, 0))

  useEffect(() => {
    const controls = animate(color, colors, {
      ease: 'easeInOut',
      duration: 10,
      repeat: Infinity,
      repeatType: 'mirror',
      ...options,
    })
    return () => {
      controls.stop()
    }
  }, [color, colors, options])

  return color
}
