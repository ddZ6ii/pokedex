import { ChevronDownIcon } from 'lucide-react'

import { CountBadge } from '@/shared/components'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible'

export function CollapsibleFilter({
  activeFiltersCount,
  children,
  label,
  ...props
}: React.ComponentProps<typeof Collapsible> & {
  label: string
  activeFiltersCount: number
}) {
  return (
    <Card className="w-full py-1">
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
