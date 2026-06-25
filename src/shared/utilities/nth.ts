/**
 * Returns the element at index `i`, throwing if absent.
 * @param arr - source array
 * @param i - index (default 0)
 * @returns element at `i`
 * @throws if no element exists at `i`
 */
export function nth<T>(arr: T[], i = 0) {
  const item = arr[i]
  if (item === undefined) throw new Error(`No item at index ${String(i)}`)
  return item
}
