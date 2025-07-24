ARG VERSION="latest"

FROM node:22-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /server

# should ensure that generated app ports are also exposed in this range
EXPOSE 3000-6000

CMD pnpx @coat-rack/server@${VERSION}
