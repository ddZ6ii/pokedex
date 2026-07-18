import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import { useCallback, useRef } from 'react'

const NOOP_HANDLER = () => void 0
const SPRING_CONFIG = { stiffness: 300, damping: 30 }

export function useMouseTilt(angle = 17.5) {
  const prefersReducedMotion = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rectRef = useRef<DOMRect | null>(null)

  const mouseXSpring = useSpring(x, SPRING_CONFIG)
  const mouseYSpring = useSpring(y, SPRING_CONFIG)

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${angle.toString()}deg`, `-${angle.toString()}deg`],
  )
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${angle.toString()}deg`, `${angle.toString()}deg`],
  )

  const handleMouseEnter: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      rectRef.current = e.currentTarget.getBoundingClientRect()
    },
    [],
  )

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const rect = rectRef.current ?? e.currentTarget.getBoundingClientRect()

      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const xPct = mouseX / rect.width - 0.5
      const yPct = mouseY / rect.height - 0.5

      x.set(xPct)
      y.set(yPct)
    },
    [x, y],
  )

  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (_e) => {
      x.set(0)
      y.set(0)
      rectRef.current = null
    },
    [x, y],
  )

  if (prefersReducedMotion) {
    return {
      rotateX: 0,
      rotateY: 0,
      handleMouseEnter: NOOP_HANDLER,
      handleMouseMove: NOOP_HANDLER,
      handleMouseLeave: NOOP_HANDLER,
    }
  }

  return {
    rotateX,
    rotateY,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
  }
}
