#!/usr/bin/env bash

# Global variables
ASQA_USER="admin%40asqatasun.org"
ASQA_PASSWORD="myAsqaPassword"

API_PREFIX_URL="http://${ASQA_USER}:${ASQA_PASSWORD}@localhost:8081"
API_URL="${API_PREFIX_URL}/api/v0/audit/page/run"

PROJECT_ID="1"
REFERENTIAL="RGAA_4_0"
LEVEL="AA"
URL_TO_AUDIT="$@"

curl -X POST \
        "${API_URL}"                                               \
        -H  "accept: */*"                                          \
        -H  "Content-Type: application/json"                       \
        -d "{                                                      \
            \"urls\": [    \"${URL_TO_AUDIT}\"  ],              \
                            \"referential\": \"${REFERENTIAL}\", \
                            \"level\": \"${LEVEL}\",             \
                            \"contractId\": ${PROJECT_ID},       \
                            \"tags\": []                         \
            }"
