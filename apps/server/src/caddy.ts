import { CADDY_ADMIN_HOST, COAT_RACK_DOMAIN } from "./config"

function createServerConfig(domain: string, port: number) {
  return {
    listen: [`:${port}`],
    routes: [
      {
        match: [{ host: [domain] }],
        handle: [
          {
            handler: "subroute",
            routes: [
              {
                handle: [
                  {
                    handler: "reverse_proxy",
                    upstreams: [{ dial: `:${port}` }],
                  },
                  { ca: "coatrack", handler: "acme_server" },
                ],
              },
            ],
          },
        ],
        terminal: true,
      },
    ],
  }
}

export async function registerCaddyServer(
  id: string,
  port: number,
): Promise<unknown> {
  if (!CADDY_ADMIN_HOST) {
    console.log("CADDY_ADMIN_HOST is not defined")
    return
  }

  const config = createServerConfig(COAT_RACK_DOMAIN, port)
  const result = await fetch(
    `http://${CADDY_ADMIN_HOST}/config/apps/http/servers/${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    },
  )

  return result
}
