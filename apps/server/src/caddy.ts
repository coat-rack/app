import {
  CADDY_ADMIN_HOST,
  CADDY_EXTERNAL_DOMAIN,
  COAT_RACK_DOMAIN,
} from "./config"

function createServerConfig(
  externalDomain: string,
  internalDomain: string,
  port: number,
) {
  return {
    listen: [`:${port}`],
    routes: [
      {
        match: [{ host: [externalDomain] }],
        handle: [
          {
            handler: "subroute",
            routes: [
              {
                handle: [
                  {
                    handler: "reverse_proxy",
                    upstreams: [{ dial: `${internalDomain}:${port}` }],
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
  if (!(CADDY_ADMIN_HOST && CADDY_EXTERNAL_DOMAIN && COAT_RACK_DOMAIN)) {
    console.log("CADDY_ADMIN_HOST is not defined")
    return
  }

  const config = createServerConfig(
    CADDY_EXTERNAL_DOMAIN,
    COAT_RACK_DOMAIN,
    port,
  )
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
