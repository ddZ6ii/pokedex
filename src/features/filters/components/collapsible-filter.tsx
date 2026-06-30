import { ChevronDownIcon } from 'lucide-react'

import { CountBadge } from '@/shared/components'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible'
import { cn } from '@/shared/lib/utils'

export function CollapsibleFilter({
  activeFiltersCount,
  className,
  children,
  label,
  ...props
}: React.ComponentProps<typeof Collapsible> & {
  activeFiltersCount: number
  className?: string
  label: string
}) {
  return (
    <Card className={cn('w-full py-1', className)}>
      <CardContent className="p-0">
        <Collapsible {...props}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="group w-full items-center px-4 aria-expanded:bg-transparent"
            >
              {label}
              {activeFiltersCount > 0 && (
                <CountBadge
                  variant="default"
                  count={activeFiltersCount}
                  className="static"
                />
              )}
              <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="flex flex-col items-start gap-4 p-4 text-sm">
            {children}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
