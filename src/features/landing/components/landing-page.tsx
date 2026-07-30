import { ArrowRightIcon } from 'lucide-react'
import { motion, type Transition, type Variants } from 'motion/react'

import { AnimatedBlobBackground } from '@/features/landing/components/animated-blob-background'
import { useAccentStyles, useColorCycle } from '@/features/landing/hooks'
import { CustomAnimatedLink } from '@/shared/components'
import { headingVariants } from '@/shared/components/ui/heading'
import { cn } from '@/shared/lib/utils'

const COLORS = ['#13FFAA', '#1E67C6', '#CE84CF', '#DD335C']

const VARIANTS: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
}

const TRANSITION: Transition = { duration: 1.2, ease: 'easeOut' }

export function LandingPage() {
  const color = useColorCycle(COLORS)
  const { titleGradient, border, boxShadow } = useAccentStyles(color)

  return (
    <>
      <AnimatedBlobBackground color={color} />

      <section className="grid flex-1 place-content-center gap-10">
        <div className="space-y-3">
          <motion.h1
            variants={VARIANTS}
            initial="initial"
            animate="animate"
            transition={TRANSITION}
            className={cn(
              headingVariants({ as: 'h1' }),
              'bg-clip-text text-center font-sans text-5xl! text-transparent',
            )}
            style={{ backgroundImage: titleGradient }}
          >
            Pokédex
          </motion.h1>

          <motion.p
            variants={VARIANTS}
            initial="initial"
            animate="animate"
            transition={{ ...TRANSITION, delay: 0.1 }}
            className="text-muted-foreground text-center"
          >
            Explore every Pokémon, instantly.
          </motion.p>
        </div>

        <CustomAnimatedLink
          to="/pokemons"
          replace
          size="xl"
          variants={VARIANTS}
          initial="initial"
          animate="animate"
          transition={{ ...TRANSITION, delay: 0.2 }}
          className="focus-visible:bg-foreground/80! text-foreground! focus-visible:text-background! hover:bg-foreground/80! hover:text-background!"
          style={{ border, boxShadow }}
        >
          Get Started
          <ArrowRightIcon
            aria-hidden={true}
            className="text-base transition-transform duration-300 group-hover:rotate-90 group-focus-visible:rotate-90"
          />
        </CustomAnimatedLink>
      </section>
    </>
  )
}
