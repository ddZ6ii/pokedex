import { motion } from 'motion/react'

export function Logo(props: React.ComponentProps<typeof motion.img>) {
  return (
    <motion.img
      src="/logo.png"
      alt=""
      width={32}
      height={32}
      className="size-8"
      initial={{ scale: 1, rotate: 0, opacity: 0 }}
      animate={{ scale: 1, rotate: 1080, opacity: 1 }}
      transition={{
        rotate: { duration: 1.2, ease: 'easeInOut' },
        opacity: { duration: 0.3 },
      }}
      {...props}
    />
  )
}
