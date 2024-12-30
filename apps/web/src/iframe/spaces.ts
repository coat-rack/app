import { useDatabase } from "@/data"
import { useActiveSpace, useFilterSpaces } from "@/db/local"
import { useObservable } from "@repo/core/async"
import { useWindowEvent } from "@repo/core/event"
import { SpacesMessage } from "@repo/data/messaging"
import { useEffect, useState } from "react"

export const useIFrameSpaces = (sandboxHost: string) => {
  const [source, setSource] = useState<MessageEventSource>()
  const { db } = useDatabase()
  const spaces = useObservable(db.spaces.find({}).$)
  const active = useActiveSpace()
  const filtered = useFilterSpaces()

  const origin = new URL(sandboxHost).origin

  const handler = (ev: MessageEvent<unknown>) => {
    if (ev.origin === origin && ev.source) {
      setSource(ev.source)
    }
  }

  useWindowEvent("message", handler)

  useEffect(() => {
    const message: SpacesMessage = {
      type: "meta.spaces",
      active,
      filtered: filtered || false,
      all: spaces?.map((space) => space._data) || [],
    }

    source?.postMessage(message, { targetOrigin: origin })
  }, [spaces, active, source, filtered])
}
