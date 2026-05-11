import type { OptionGroup, SelectOption } from '@/shared/types'

export function groupOptions<T extends string>(
  options: SelectOption<T>[],
): OptionGroup<T>[] {
  const groups: OptionGroup<T>[] = []

  for (const option of options) {
    const groupLabel = option.group
    const last = groups[groups.length - 1]

    if (last && last.label === groupLabel) {
      last.options.push(option)
    } else {
      groups.push({ label: groupLabel, options: [option] })
    }
  }

  return groups
}
