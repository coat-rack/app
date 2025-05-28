import { createMessageChannelForParent } from "@coat-rack/core/messaging"
import { HOST_ORIGIN } from "@coat-rack/core/rpc"
import { useMemo, useRef } from "react"
import { useIFrameRPC } from "./iframe/rpc"
import { useIFrameSpaces } from "./iframe/spaces"

interface SynchronizedIframeProps {
  appId: string
  appUrl: URL
  space: string
  filteredSpaces: boolean
  className?: string
}

export function SynchronizedIframe({
  appId,
  appUrl,
  space,
  filteredSpaces,
  className,
}: SynchronizedIframeProps) {
  const [fullAppUrl, channel, onIframeLoaded] = useMemo(
    () => {
      const hostOrigin = window.origin
      const appUrlWithHostOrigin = new URL(appUrl)
      appUrlWithHostOrigin.searchParams.set(HOST_ORIGIN, hostOrigin)

      return [appUrlWithHostOrigin.href, ...createMessageChannelForParent(appUrlWithHostOrigin)]
    },
    [appId],
  )

  const ref = useRef<HTMLIFrameElement>(null)

  useIFrameRPC(channel, appId, space, filteredSpaces)
  useIFrameSpaces(channel)

  return (
    <iframe
      ref={ref}
      className={className}
      src={fullAppUrl}
      onLoad={() => {
        onIframeLoaded(ref.current as HTMLIFrameElement)
      }}
      referrerPolicy="strict-origin"
    ></iframe>
  )
}