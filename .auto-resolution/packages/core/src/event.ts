import { useEffect } from "react"

export const useWindowEvent = <K extends keyof WindowEventMap>(
  event: K,
  listener: (ev: WindowEventMap[K]) => void,
) =>
  useEffect(() => {
    window.addEventListener(event, listener)

    return () => window.removeEventListener(event, listener)
  })
