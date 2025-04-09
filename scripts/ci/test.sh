#!/bin/bash

set -eu -o pipefail

: ${DOCKER_IMAGE:=onetimesecret:dev}

echo "Starting the server"
docker run -d --name onetimesecret -p 7143:7143 -e OTS_SECRET=verysecret "$DOCKER_IMAGE"
sleep 5

echo "Logs:"
docker logs onetimesecret

echo "Testing /api/v1/status"
curl -i --fail 'http://127.0.0.1:7143/api/v1/status'
echo
