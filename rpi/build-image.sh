apt-get update
apt-get install -y coreutils quilt parted qemu-user-static debootstrap zerofree zip \
    dosfstools libarchive-tools libcap2-bin grep rsync xz-utils file git curl bc \
    gpg pigz xxd arch-test kmod

mkdir -p /build/rpi
cd /build/rpi
git clone --branch arm64 https://github.com/RPI-Distro/pi-gen.git --depth 1
cp -r /src/rpi-gen-config/* /build/rpi/pi-gen/
cd /build/rpi/pi-gen
./build.sh