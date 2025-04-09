#!/bin/bash

set -eux -o pipefail

aws --region eu-west-1 ecr get-login-password \
| docker login --password-stdin --username AWS 352476883983.dkr.ecr.eu-west-1.amazonaws.com
docker tag "${DOCKER_IMAGE}" "${ECR_REPOSITORY}:${VERSION_NUMBER}"
docker tag "${DOCKER_IMAGE}" "${ECR_REPOSITORY}:${GITHUB_REF_NAME//\//-}"
docker push --all-tags "${ECR_REPOSITORY}"
