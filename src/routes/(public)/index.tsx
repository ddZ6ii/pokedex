import { createFileRoute } from '@tanstack/react-router'

import { LandingPage } from '@/features/landing/components'

export const Route = createFileRoute('/(public)/')({
  component: LandingPage,
})
