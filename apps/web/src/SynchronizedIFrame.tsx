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
  const appUrlWithHostOrigin = new URL(appUrl)
  appUrlWithHostOrigin.searchParams.set(HostOriginQueryParam, hostOrigin)

  const [channel, onIframeLoaded] = useMemo(
    () => createMessageChannelForParent(appUrlWithHostOrigin),
    [appId, appUrlWithHostOrigin],
  )

  const ref = useRef<HTMLIFrameElement>(null)

  useIFrameRPC(channel, appId, space, filteredSpaces)
  useIFrameSpaces(channel)

  return (
    <iframe
      ref={ref}
      className={className}
      src={appUrlWithHostOrigin.href}
      onLoad={() => {
        onIframeLoaded(ref.current as HTMLIFrameElement)
      }}
      referrerPolicy="strict-origin"
    ></iframe>
  )
}
