#!/usr/bin/env bash

# Global variables
ASQA_USER="admin%40asqatasun.org"
ASQA_PASSWORD="myAsqaPassword"
FOLDER="asqatasun-docker"

function run-asq {
    API_PREFIX_URL="http://${ASQA_USER}:${ASQA_PASSWORD}@localhost:8081"
    API_URL="${API_PREFIX_URL}/api/v0/audit/page/run"

    PROJECT_ID="1"
    REFERENTIAL="RGAA_4_0"
    LEVEL="AA"
    URL_TO_AUDIT="$@"

    AUDIT_ID=$(curl -s -X POST \
         "${API_URL}"                                               \
         -H  "accept: */*"                                          \
         -H  "Content-Type: application/json"                       \
         -d "{                                                      \
                \"urls\": [    \"${URL_TO_AUDIT}\"  ],              \
                               \"referential\": \"${REFERENTIAL}\", \
                               \"level\": \"${LEVEL}\",             \
                               \"contractId\": ${PROJECT_ID},       \
                               \"tags\": []                         \
             }")

    echo "$AUDIT_ID"
}

function view-asq-audit {
    API_PREFIX_URL="http://${ASQA_USER}:${ASQA_PASSWORD}@localhost:8081"

    API_URL="${API_PREFIX_URL}/api/v0/audit/$@"
    results=$(curl -s -X GET "${API_URL}" -H  "accept: */*")
    echo "$results" > ${FOLDER}/audit.json
    failed=$(echo "$results" |  jq '.subject.repartitionBySolutionType[1].number')
    echo "Failed tests: $failed"
    if [[ $failed -gt 0 ]]
    then
        exit 1
    fi
}

function save-asq-audit {
    API_PREFIX_URL="http://${ASQA_USER}:${ASQA_PASSWORD}@localhost:8081"

    API_URL="${API_PREFIX_URL}/api/v0/audit/$@/tests"
    curl -s -X GET "${API_URL}" -H  "accept: */*" --output "${FOLDER}/audit.csv"
}

function main {
    AUDIT_ID=$(run-asq "$@")
    # AUDIT_ID=$(cat "${FOLDER}/audit.txt")
    echo "Asqatasun audit ${AUDIT_ID} generated."
    echo "Waiting for audit..."
    sleep 10
    view-asq-audit "${AUDIT_ID}"
    save-asq-audit "${AUDIT_ID}"
}

# http://localhost:1338/
main "$@"