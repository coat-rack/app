# for some reason these aren't working
FROM node:22-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /server

# should ensure that generated app ports are also exposed in this range
EXPOSE 3000 4000 40000-41000

CMD pnpm dlx "@coat-rack/server@$VERSION"
