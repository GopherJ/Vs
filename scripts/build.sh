#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

echo "Building umd minified version"
export NODE_ENV=production
../node_modules/.bin/webpack \
    --hide-modules \
    --colors \
    --config webpack.config.js \
    --env production \
    --display-error-details
