#!/usr/bin/env bash
# Script to run Asqatasun tests for a given url

# Global variables for Asqatasun
ASQA_USER="admin%40asqatasun.org"
ASQA_PASSWORD="myAsqaPassword"
PORT="8081"
API_PREFIX_URL="http://${ASQA_USER}:${ASQA_PASSWORD}@localhost:${PORT}"
# Folder where to find Asqatasun files
FOLDER=$(dirname "$0")
# Public url of test web app
URL_PUBLIC="https://idasm-unibe-ch.github.io/unibe-web-accessibility"
WEBPAGES=("" "perceivable" "operable" "understandable")
# Folder for audit results
CURRENT_DIR=$(pwd)
RESULTS="$FOLDER/results"

__usage="
Usage: $(basename $0) [OPTIONS]

Options:
  setup          Runs the Asqatasun docker containers
  run            Audit all public webpages (i.e. perceivable, operable, etc.)
  audit <id>     Download given audit in $RESULTS
  cleanup        Closes the docker containers

The setup requires the following folder (or similar) in the root of this repo:
- asqatasun-docker/api-5.0.0-rc.2_ubuntu-18.04/
- see https://gitlab.com/asqatasun/asqatasun-docker
To run properly this script requires the following helper tools:
- curl (https://curl.se/)
- jq (https://jqlang.github.io/jq/)
"

function run-asq {
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
    mkdir -p "$FOLDER/results"

    # Get audit results summary
    API_PREFIX_URL="http://${ASQA_USER}:${ASQA_PASSWORD}@localhost:${PORT}"
    API_URL="${API_PREFIX_URL}/api/v0/audit/$@"
    results=$(curl -s -X GET "${API_URL}" -H  "accept: */*")
    # Save results
    echo "$results" > $RESULTS/summary$@.json

    # Get audit results details
    save-asq-audit "$@"

    # Extract number of failed tests
    failed=$(echo "$results" |  jq '.subject.repartitionBySolutionType[1].number')
    echo "Failed tests: $failed"

    if [[ "$failed" =~ ^[0-9]+$ ]]; then
        # variable is an integer
        if [[ $failed -gt 0 ]]; then
            echo "See audit$@.csv for failed tests."
            # exit 1
        elif [ $failed -eq 0 ]; then
            echo "No tests failed."
        else
            echo "Something went wrong."
        fi
    else
        # variable is not an integer
        echo "Audit $@ could not be downloaded; please check status manually."
    fi
}

function save-asq-audit {
    mkdir -p "$FOLDER/results/audits"

    API_PREFIX_URL="http://${ASQA_USER}:${ASQA_PASSWORD}@localhost:${PORT}"
    API_URL="${API_PREFIX_URL}/api/v0/audit/$@/tests"

    curl -s -X GET "${API_URL}" -H  "accept: */*" --output "$RESULTS/audits/audit$@.csv"
}

function main {
    case "$1" in
        run)
            # Run tests for given webpage
            for page in "${WEBPAGES[@]}"
            do
                echo "Audit for webpage: $URL_PUBLIC/$page"
                AUDIT_ID=$(run-asq "$URL_PUBLIC/$page")
                echo "Asqatasun audit ${AUDIT_ID} generated."
                # echo "Waiting for audit..."
                sleep 2
                # view-asq-audit "${AUDIT_ID}"
            done
        ;;
        audit)
            # Download results for given audit
            view-asq-audit $2
        ;;
        setup)
                # Asqatasun
                # Download the tool https://gitlab.com/asqatasun/asqatasun-docker
                # Save under /asqatasun-docker
                cd "$FOLDER/api-5.0.0-rc.2_ubuntu-18.04"
                docker-compose rm -fsv # reset db
                # docker-compose build --no-cache # rebuild image
                docker-compose up -d
                cd "$CURRENT_DIR"
                echo "Aqatasun is ready."
        ;;
        cleanup)
                current_directory=$(pwd)
                cd "$FOLDER/api-5.0.0-rc.2_ubuntu-18.04"
                docker-compose down
                cd "$CURRENT_DIR"
                echo "Asqatasun containers are down."
        ;;
        *)
            echo "$__usage"
    esac
}

main "$@"