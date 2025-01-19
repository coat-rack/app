ARG ARCH=
FROM ${ARCH}node:20 AS build
WORKDIR /build
RUN npm install -g pnpm
COPY . ./
RUN pnpm install
RUN pnpm build

FROM ${ARCH}node:20 AS runtime
ENV COATRACK_DATA_DIR=/data
ENV COATRACK_APP_HOST_PORT_LOW=40000
ENV COATRACK_APP_HOST_PORT_HIGH=41000
RUN npm install -g pm2
WORKDIR /usr/src/app/web
COPY --from=build /build/apps/web/dist/ .
WORKDIR /usr/src/app/sandbox
COPY --from=build /build/apps/sandbox/dist/ .
WORKDIR /usr/src/app/server
COPY --from=build /build/apps/server/dist/ .
WORKDIR /usr/src/app
COPY ./docker/coatrack.config.js .
USER node
EXPOSE 3000/tcp
EXPOSE 4000/tcp
EXPOSE 5001/tcp
EXPOSE ${COATRACK_APP_HOST_PORT_LOW}-${COATRACK_APP_HOST_PORT_HIGH}
CMD [ "pm2-runtime", "start", "coatrack.config.js" ]
