import { createMessageChannelForParent } from "@coat-rack/core/messaging"
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
  const [iframeUrl, channel, onIframeLoaded] = useMemo(
    () => createMessageChannelForParent(window.location, appUrl),
    [appId],
  )

  const ref = useRef<HTMLIFrameElement>(null)

  useIFrameRPC(channel, appId, space, filteredSpaces)
  useIFrameSpaces(channel)

  return (
    <iframe
      ref={ref}
      className={className}
      src={iframeUrl.toString()}
      onLoad={() => {
        onIframeLoaded(ref.current as HTMLIFrameElement)
      }}
      referrerPolicy="strict-origin"
    ></iframe>
  )
}
