# Raspberry Pi Image

This directory contains the files required to build a coatrack raspberry pi image.

The `rpi-gen-config` directory contains the configuration that can be merged with the pi-gen directory structure to build the raspberry pi image.

The `build.sh` script does the following:

- start an arm64 debian image
- install dependencies for [pi-gen](https://github.com/RPI-Distro/pi-gen.git)
- use the build configuration to produce an image in the `build` directory
