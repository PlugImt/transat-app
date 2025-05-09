#!/usr/bin/env bash

export SENTRY_RELEASE="transat-app@$(git rev-parse HEAD)"
export SENTRY_DIST=$(date +"%Y-%m-%d_%H-%M-%s")

# check SENTRY_AUTH_TOKEN is set
if [ -z "$SENTRY_AUTH_TOKEN" ]; then
    echo "SENTRY_AUTH_TOKEN is not set"
    exit 1
fi

# check if eas is installed
if ! command -v eas &> /dev/null; then
    echo "eas could not be found"
    exit 1
fi

if [ "$1" = "ios" ]; then
    eas build --platform ios --profile preview --local
elif [ "$1" = "android" ]; then
    eas build --platform android --profile preview --local
else
    echo "Usage: $0 [ios|android]"
    exit 1
fi


