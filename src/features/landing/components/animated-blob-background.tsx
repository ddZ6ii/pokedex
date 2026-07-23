import { motion, type MotionValue } from 'motion/react'

import { useColorCycle } from '@/features/landing/hooks'

const BLOB_SHAPES = [
  '90% 10% 15% 85% / 80% 5% 95% 20%',
  '10% 90% 95% 5% / 30% 85% 10% 70%',
  '95% 5% 20% 80% / 10% 70% 25% 90%',
  '15% 85% 90% 10% / 90% 10% 85% 5%',
  '75% 25% 5% 95% / 20% 90% 10% 80%',
  '10% 90% 75% 25% / 85% 5% 90% 15%',
  '90% 10% 45% 55% / 10% 80% 15% 90%',
  '25% 75% 10% 90% / 95% 15% 80% 10%',
]

export function AnimatedBlobBackground({
  color,
}: {
  color: MotionValue<string>
}) {
  const borderRadius = useColorCycle(BLOB_SHAPES, { duration: 24 })

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute h-[45vmax] w-[45vmax] -translate-x-1/2 -translate-y-1/2 blur-[100px]"
        style={{ backgroundColor: color, borderRadius }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          left: ['20%', '80%', '30%', '70%', '15%', '60%', '20%'],
          top: ['30%', '70%', '15%', '80%', '55%', '25%', '30%'],
        }}
        transition={{
          opacity: { duration: 2, ease: 'easeInOut' },
          left: {
            duration: 40,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0,
          },
          top: { duration: 45, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    </div>
  )
}
