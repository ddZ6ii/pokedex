import { useRef, useState } from 'react'

const MAX_RETRIES = 3

// Retry an <img> load with exponential backoff (+ jitter) up to
// MAX_RETRIES, appending a cache-busting `?retry=N` query param so a retry
// doesn't just replay the same failed response from cache. Shared by any
// image that should survive a transient network/CDN failure instead of
// staying blank forever.
function useRetryableImage(url: string) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [src, setSrc] = useState(url)
  const retriesRef = useRef(0)

  const handleLoad = () => {
    setLoaded(true)
  }

  const handleError = () => {
    if (retriesRef.current >= MAX_RETRIES) {
      // Give up, but still surface `failed` so callers gating other content
      // on this hook (e.g. holding a skeleton until the image is ready)
      // don't get stuck waiting on an image that will never load.
      setFailed(true)
      return
    }

    // Jitter scales with the backoff tier (delay in [base, 2*base)) rather
    // than a flat window, so a burst of cards sharing a type-background URL
    // that all fail together (e.g. a Cloudflare edge blip, which gets worse
    // under concurrent pressure) de-synchronize instead of retrying in
    // near lockstep.
    const delay = 500 * 2 ** retriesRef.current * (1 + Math.random())
    retriesRef.current += 1
    setTimeout(() => {
      setSrc(`${url}?retry=${retriesRef.current.toString()}`)
    }, delay)
  }

  return { src, loaded, failed, handleLoad, handleError }
}

export { useRetryableImage }
