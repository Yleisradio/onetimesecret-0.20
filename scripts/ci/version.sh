#!/bin/bash

set -eu -o pipefail

BRANCH=$(echo "${GITHUB_REF//\//-}" | sed s/refs-heads-//)

if [ "$BRANCH" = "master" ] || [ "$BRANCH" = "main" ]; then
    echo "1.2.$GITHUB_RUN_NUMBER"
else
    echo "0.2.$GITHUB_RUN_NUMBER-$BRANCH"
fi
