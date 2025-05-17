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
  const url = `${sandboxHost}/?appUrl=${encodeURIComponent(appUrl.toString())}`

  useIFrameRPC(appId, sandboxHost, space, filteredSpaces)
  useIFrameSpaces(sandboxHost)

  return (
    <iframe
      className={className}
      src={url}
      referrerPolicy="strict-origin"
    ></iframe>
  )
}
