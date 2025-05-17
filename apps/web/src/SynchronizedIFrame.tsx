import { useChannelForParent } from "@coat-rack/core/messaging"
import { useRef, useState } from "react"
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
  const ref = useRef<HTMLIFrameElement>(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const url = `${sandboxHost}/?appUrl=${encodeURIComponent(appUrl.toString())}`

  const port = useChannelForParent(ref, iframeLoaded)

  useIFrameRPC(appId, space, filteredSpaces, port)
  useIFrameSpaces(port)

  return (
    <iframe
      ref={ref}
      className={className}
      src={url}
      onLoad={() => setIframeLoaded(true)}
      referrerPolicy="strict-origin"
    ></iframe>
  )
}
