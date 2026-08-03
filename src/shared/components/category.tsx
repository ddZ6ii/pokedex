import { Heading } from '@/shared/components/ui/heading'

export function Category({
  children,
  className = 'flex items-center gap-x-2',
  label,
}: React.PropsWithChildren<{
  className?: string
  label: string
}>) {
  return (
    <div className={className}>
      <Heading
        as="h3"
        className="text-md min-w-23 font-sans font-bold whitespace-nowrap lg:text-base"
      >
        {label}:
      </Heading>
      {children}
    </div>
  )
}
