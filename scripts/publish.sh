#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$( git rev-parse --show-toplevel )"

npm run build \
    && sed -i "/version/c\    \"version\":\"$1\"," "$ROOT/package.json" \
    && git add $ROOT \
    && git commit -m "[dump]: v$1" \
    && git tag v"$1" \
    && git push origin master \
    && git push origin v"$1" \
    && npm publish $ROOT
