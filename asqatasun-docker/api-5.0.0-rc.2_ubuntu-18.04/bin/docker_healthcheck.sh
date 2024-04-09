#!/bin/bash

set -o pipefail

if [[ "${ASQATASUN_TYPE}" == "asqatasun_webapp" ]]; then
    curl -s --fail "${WWW_URL}" || exit 1
    exit 0
elif [[ "${ASQATASUN_TYPE}" == "asqatasun_api" ]]; then
    curl -s "${WWW_URL}" | grep '\"status\":401,\"error\":\"Unauthorized\"' || exit 1
    exit 0
fi
exit 1
