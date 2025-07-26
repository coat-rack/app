import { useLoggedInContext } from "@/logged-in-context"
import { useObservable } from "@coat-rack/core/async"
import { useChannelSubscription } from "@coat-rack/core/messaging"
import {
  SpacesRequestMessage,
  SpacesResponseMessage,
} from "@coat-rack/core/messsage"
import { SharedChannel } from "@coat-rack/core/shared-channel"
import { useEffect } from "react"

export const useIFrameSpaces = (channel: SharedChannel) => {
  const { db, filterSpaces, activeSpace } = useLoggedInContext()
  const spaces = useObservable(db.spaces.find({}).$)

  const message: SpacesResponseMessage = {
    type: "meta.spaces-response",
    active: activeSpace,
    filtered: filterSpaces || false,
    all: spaces?.map((space) => space._data) || [],
  }

  useChannelSubscription<SpacesRequestMessage>(
    channel,
    "meta.spaces",
    (_, reply) => reply(message),
  )

  useEffect(() => {
    channel.postMessage(message)
  }, [spaces, activeSpace, filterSpaces])
}
