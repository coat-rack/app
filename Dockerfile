FROM debian:12 AS rpibuild

# install deps
RUN apt-get update
RUN apt-get install -y coreutils quilt parted qemu-user-static debootstrap zerofree zip \
    dosfstools libarchive-tools libcap2-bin grep rsync xz-utils file git curl bc \
    gpg pigz xxd arch-test

# install node
# see https://serverfault.com/a/1145098
RUN mkdir -p /etc/apt/keyrings;
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg;
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list; 
RUN apt-get update && apt-get install -y nodejs;

# install pnpm
RUN npm install -g pnpm

# build coatrack
WORKDIR /build/src
COPY . .
RUN pnpm install
RUN pnpm build
