type SelectOption<T extends string> = {
  group?: string
  label: string
  value: T | (string & {})
}

type OptionGroup<T extends string> = {
  label?: string
  options: SelectOption<T>[]
}

export type { OptionGroup, SelectOption }
