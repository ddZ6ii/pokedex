import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

const noop = () => undefined
const polyfill = (proto: object, method: string, value: unknown) => {
  if (!(method in proto))
    Object.defineProperty(proto, method, {
      value,
      configurable: true,
      writable: true,
    })
}

// ── Radix UI ─────────────────────────────────────────────────────────────────

// Pointer Capture API — required to open Select dropdowns (jsdom 28 omits it).
polyfill(HTMLElement.prototype, 'hasPointerCapture', () => false)
polyfill(HTMLElement.prototype, 'releasePointerCapture', noop)
polyfill(HTMLElement.prototype, 'setPointerCapture', noop)

// scrollIntoView — called on the active item after a Select opens.
polyfill(Element.prototype, 'scrollIntoView', noop)

// ResizeObserver — react-use-size measures elements with it.
polyfill(
  window,
  'ResizeObserver',
  class ResizeObserver {
    observe = noop
    unobserve = noop
    disconnect = noop
  },
)

// ── Vaul (drawer) ────────────────────────────────────────────────────────────

// getComputedStyle().transform — Vaul reads vendor-prefixed transform to compute
// drag state. jsdom returns "" for all of them, making the fallback chain
// (transform || webkitTransform || mozTransform) resolve to undefined and crash.
const _getComputedStyle = window.getComputedStyle.bind(window)
window.getComputedStyle = (el, pseudo?) => {
  const style = _getComputedStyle(el, pseudo)
  return new Proxy(style, {
    get(target, prop, receiver) {
      if (
        prop === 'transform' ||
        prop === 'webkitTransform' ||
        prop === 'mozTransform'
      ) {
        return (
          (target as CSSStyleDeclaration & Record<string, string>)[
            prop as string
          ] ?? 'none'
        )
      }
      const val: unknown = Reflect.get(target, prop, receiver)
      return typeof val === 'function' ? (val.bind(target) as unknown) : val
    },
  })
}

// ── matchMedia ───────────────────────────────────────────────────────────────

// Defaults to desktop (matches: false). Individual tests override via mockMobile().
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// ── Cleanup ───────────────────────────────────────────────────────────────────

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
