import { createMessageChannelForParent } from "@coat-rack/core/messaging"
import { HostOriginQueryParam } from "@coat-rack/core/rpc"
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
  const hostOrigin = window.origin
  const url = new URL(appUrl)
  const origin = `${url.protocol}//${url.hostname}:${url.port}`
  const [channel, onIframeLoaded] = useMemo(
    () => createMessageChannelForParent(origin),
    [appId],
  )

  const ref = useRef<HTMLIFrameElement>(null)

  useIFrameRPC(channel, appId, space, filteredSpaces)
  useIFrameSpaces(channel)

  const appUrlWithHostOrigin = `${appUrl}?${HostOriginQueryParam}=${encodeURIComponent(
    hostOrigin,
  )}`

  return (
    <iframe
      ref={ref}
      className={className}
      src={appUrlWithHostOrigin}
      onLoad={() => {
        onIframeLoaded(ref.current as HTMLIFrameElement)
      }}
      referrerPolicy="strict-origin"
    ></iframe>
  )
}
