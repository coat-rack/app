import { useDatabase } from "@/data"
import { useActiveSpace, useFilterSpaces } from "@/db/local"
import { useObservable } from "@coat-rack/core/async"
import { useChannelSubscription } from "@coat-rack/core/messaging"
import { SpacesMessage, SpacesRequestMessage } from "@coat-rack/core/messsage"
import { SharedChannel } from "@coat-rack/core/shared-channel"

export const useIFrameSpaces = (port?: SharedChannel) => {
  const { db } = useDatabase()
  const spaces = useObservable(db.spaces.find({}).$)
  const active = useActiveSpace()
  const filtered = useFilterSpaces()

  useChannelSubscription<SpacesRequestMessage>(
    "meta.spaces-request",
    (_, reply) => {
      const message: SpacesMessage = {
        type: "meta.spaces",
        active,
        filtered: filtered || false,
        all: spaces?.map((space) => space._data) || [],
      }

      reply(message)
    },
    port,
  )
}
