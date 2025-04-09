#!/bin/bash

set -eu -o pipefail

: ${DOCKER_IMAGE:=onetimesecret:dev}

set -x

docker build -t "$DOCKER_IMAGE" .
