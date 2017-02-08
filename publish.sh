#!/bin/sh

if [ -z "$GH_TOKEN" ]; then
    echo "You must set the GH_TOKEN environment variable."
    echo "See README.md for more details."
    exit 1
fi

# This will build, package and upload the app to GitHub.
CSC_LINK="$(pwd)/certs/ia.p12" \
CSC_IDENTITY_AUTO_DISCOVERY=false \
    node_modules/.bin/build --win --mac -p always
