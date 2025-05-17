import { useDatabase } from "@/data"
import { useActiveSpace, useFilterSpaces } from "@/db/local"
import { useObservable } from "@coat-rack/core/async"
import { useChannelSubscription } from "@coat-rack/core/messaging"
import {
  SpacesRequestMessage,
  SpacesResponseMessage,
} from "@coat-rack/core/messsage"
import { SharedChannel } from "@coat-rack/core/shared-channel"

export const useIFrameSpaces = (channel: SharedChannel) => {
  const { db } = useDatabase()
  const spaces = useObservable(db.spaces.find({}).$)
  const active = useActiveSpace()
  const filtered = useFilterSpaces()

  useChannelSubscription<SpacesRequestMessage>(
    channel,
    "meta.spaces",
    (_, reply) => {
      const message: SpacesResponseMessage = {
        type: "meta.spaces-response",
        active,
        filtered: filtered || false,
        all: spaces?.map((space) => space._data) || [],
      }

      reply(message)
    },
  )
}
