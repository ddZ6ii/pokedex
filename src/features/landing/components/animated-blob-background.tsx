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
    <div className="fixed inset-0 -z-10">
      <motion.div
        className="absolute h-[45vmax] w-[45vmax] blur-[100px] will-change-transform"
        style={{ backgroundColor: color, borderRadius, z: 0 }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: [
            'calc(20vw - 50%)',
            'calc(80vw - 50%)',
            'calc(30vw - 50%)',
            'calc(70vw - 50%)',
            'calc(15vw - 50%)',
            'calc(60vw - 50%)',
            'calc(20vw - 50%)',
          ],
          y: [
            'calc(30vh - 50%)',
            'calc(70vh - 50%)',
            'calc(15vh - 50%)',
            'calc(80vh - 50%)',
            'calc(55vh - 50%)',
            'calc(25vh - 50%)',
            'calc(30vh - 50%)',
          ],
        }}
        transition={{
          opacity: { duration: 2, ease: 'easeInOut' },
          x: {
            duration: 40,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0,
          },
          y: { duration: 45, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    </div>
  )
}
