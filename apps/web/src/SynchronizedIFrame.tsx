import { createMessageChannelForParent } from "@coat-rack/core/messaging"
import { useMemo, useRef } from "react"
import { useIFrameRPC } from "./iframe/rpc"
import { useIFrameSpaces } from "./iframe/spaces"

interface SynchronizedIframeProps {
  appId: string
  appUrl: URL
  sandboxHost: string
  space: string
  filteredSpaces: boolean
  className?: string
}

export function SynchronizedIframe({
  appId,
  appUrl,
  sandboxHost,
  space,
  filteredSpaces,
  className,
}: SynchronizedIframeProps) {
  const [channel, onIframeLoaded] = useMemo(
    () => createMessageChannelForParent(),
    [appId],
  )

  const ref = useRef<HTMLIFrameElement>(null)
  const url = `${sandboxHost}/?appUrl=${encodeURIComponent(appUrl.toString())}`

  useIFrameRPC(channel, appId, space, filteredSpaces)
  useIFrameSpaces(channel)

  return (
    <iframe
      ref={ref}
      className={className}
      src={url}
      onLoad={() => {
        onIframeLoaded(ref.current as HTMLIFrameElement)
      }}
      referrerPolicy="strict-origin"
    ></iframe>
  )
}
