#!/usr/bin/env bash

__usage="
Usage: $(basename $0) [OPTIONS]

Tools: axe, achecker, htmlcs, asq

Options:
  start                        Starts container for the webapp 
  setup <tool>                 Install the dependencies for the tool
  run <tool> <url>             Audit a webpage with a specific tool
  asq                          Saves last Asqatasun audit as JSON
  cleanup <tool>               Uninstall the dependencies to run the tool
  end                          Closes all running docker containers

Note that Asqatasun works a bit differently from the others.
The setup requires the following folder the root of this repo:
- asqatasun-docker/5.x/5.0.y/5.0.0-rc.2/api-5.0.0-rc.2_ubuntu-18.04
- see https://gitlab.com/asqatasun/asqatasun-docker
"

# Global variables
ASQA_USER="admin%40asqatasun.org"
ASQA_PASSWORD="myAsqaPassword"

function set-up-axe {
    # axe core
    npm i @axe-core/cli
    npm install chromedriver
}

function clean-up-axe {
    # axe core
    npm uninstall @axe-core/cli
    npm uninstall chromedriver
}

function run-axe {
    npx axe "$1" --dir ./results/axe/
    echo "Axe-core audit generated and saved at results/axe."
}

function set-up-achecker {
    # achecker
    npm i accessibility-checker
}

function clean-up-achecker {
    # achecker
    npm uninstall accessibility-checker
}

function run-achecker {
    # see configuration in aceconfig.js
    npx achecker "$1"
    echo "Achecker audit generated and saved at results/achecker."
}

function set-up-htmlcs {
    # HTML_CodeSniffer
    # npm i -g grunt-cli
    npm i grunt-cli
    npm i --save html_codesniffer
    cd node_modules/html_codesniffer
    npm install
    # grunt build
    cd ../..
    npm i puppeteer
}

function clean-up-htmlcs {
    npm uninstall grunt-cli
    npm uninstall --save html_codesniffer
    npm uninstall puppeteer
}

function run-htmlcs {
    # see configuration in html_cs.js
    timestamp=$(date +%F_%T)
    results=$(node html_cs.js "$@" | sed 's/;/,/g')
    # formatted_results=$(echo "$results" | sed 's/|/;/g')
    mkdir -p results/HTML_CodeSniffer
    echo "$@" > "results/HTML_CodeSniffer/htmlcs-results-$timestamp.txt"
    echo "$results" >> "results/HTML_CodeSniffer/htmlcs-results-$timestamp.txt"
    # echo "Message;WCAG;DOM_object;Unknown;Description;HTML_tag" > "results/HTML_CodeSniffer/htmlcs-results-$timestamp.csv"
    # echo -e "$formatted_results" >> "results/HTML_CodeSniffer/htmlcs-results-$timestamp.csv"
    echo "HTML_CodeSniffer audit generated and saved at results/HTML_CodeSniffer."
}

#TODO update the script for Asqatasun!
function set-up-asq {
    # Asqatasun
    # Download the tool https://gitlab.com/asqatasun/asqatasun-docker
    # Save under /asqatasun-docker
    cd asqatasun-docker/5.x/5.0.y/5.0.0-rc.2/api-5.0.0-rc.2_ubuntu-18.04
    docker-compose rm -fsv # reset db
    docker-compose --build
    # docker-compose build --no-cache # rebuild image
    docker-compose up -d
    cd ../../../../..
}

function clean-up-asq {
    docker-compose down
}

function run-asq {
    # Create folder of Asqatasun results
    mkdir -p results/Asqatasun

    # Prepare variables
    API_PREFIX_URL="http://${ASQA_USER}:${ASQA_PASSWORD}@localhost:8081"
    API_URL="${API_PREFIX_URL}/api/v0/audit/page/run"

    PROJECT_ID="1"
    REFERENTIAL="RGAA_4_0"
    LEVEL="AA"
    URL_TO_AUDIT="$@"

    curl -s -X POST \
         "${API_URL}"                                               \
         -H  "accept: */*"                                          \
         -H  "Content-Type: application/json"                       \
         -d "{                                                      \
                \"urls\": [    \"${URL_TO_AUDIT}\"  ],              \
                               \"referential\": \"${REFERENTIAL}\", \
                               \"level\": \"${LEVEL}\",             \
                               \"contractId\": ${PROJECT_ID},       \
                               \"tags\": []                         \
             }" --output "results/Asqatasun/audit.txt"

    echo "Asqatasun audit generated."
}

function save-asq-audit {
    ASQA_USER="admin%40asqatasun.org"
    ASQA_PASSWORD="myAsqaPassword"
    API_PREFIX_URL="http://${ASQA_USER}:${ASQA_PASSWORD}@localhost:8081"
    AUDIT_ID=$(cat "results/Asqatasun/audit.txt")

    API_URL="${API_PREFIX_URL}/api/v0/audit/${AUDIT_ID}"
    curl -s -X GET "${API_URL}" -H  "accept: */*" --output "results/Asqatasun/audit.json"
}

function main {
    case "$1" in
        start)
            echo "Starting server..."
            docker-compose up -d server
        ;;
        setup)
            set-up-$2
        ;;
        run)
            echo "Evaluating webpage: $3"
            run-$2 "$3"
        ;;
        asq)
            # Asqatasun audits take few minutes
            # Save the results from the last audit
            # as JSON with this command
            save-asq-audit
        ;;
        cleanup)
            clean-up-$2
        ;;
        end)
            clean-up-asq
            echo "All containers are down now."
        ;;
        *)
            echo "$__usage"
    esac
   
}

# ./test.bash run axe http://localhost:1338/
main "$@"