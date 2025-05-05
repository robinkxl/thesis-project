#!/usr/bin/env bash

# Public url of test web app
WEBPAGES=("" "perceivable" "operable" "understandable")

__usage="
Usage: $(basename $0) [OPTIONS]

Tools: axe, achecker, htmlcs

Options:
  start                        Starts container for the webapp 
  setup <tool>                 Installs the dependencies for the tool
  test <tool> <url>            Audits a web page with a specific tool
  run <tool> <host>            Audits all web pages from test website with a specific tool
  cleanup <tool>               Uninstalls the dependencies to run the tool
  end                          Closes all running docker containers

Note that Asqatasun is not included here, since it works differently fromthe other tools.
To learn more and/or test Asqatasun run the following command in the terminal:
./asqatasun-docker/asqatasun_audit.bash
"
function set-up-lighthouse {
    npm install -g @lhci/cli@0.14.x
}

function run-lighthouse {
    mkdir -p results/lighthouse
   # echo "Webpages: ${WEBPAGES[@]}"
    echo "--url="$1""

    # this is giving a set of reports but its going to the wrong dir. atm. needs to be fixed
    lhci collect --url="$1" --dir ./results/lighthouse/

   # echo "on: $1/"
   # it runs 3 times on each page which can be a little time consuming
}

function clean-up-lighthouse {
    npm uninstall -g @lhci/cli
}

function set-up-pa11y {
    npm install -g pa11y
    npm install pa11y-reporter-html --save
}

function run-pa11y {
    mkdir -p "results/pa11y"
# it works fine again but dir needs to be adjusted so we can get html for each diff page
# TODO: its also not in the yml yet!
    pa11y --reporter html "$1" > report.html
    echo "Pa11y audit generated and saved at report.html."
}

function clean-up-pa11y {
    npm uninstall -g pa11y
}

# another option: https://www.totalvalidator.com/products/ci.html but it has a small fee

# not fully implemented qualWeb is just 2.1
function set-up-qualweb {
    npm i -g @qualweb/cli
}

# not fully implemented since qualWeb is just 2.1
function run-qualweb {
    qw -u https://act-rules.github.io/pages/about/ -r earl
}

# not implemented fully
function set-up-skynet {
    python -m ensurepip --upgrade
    pip install selenium
    pip install webdriver-manager
}
# not implemented fully
function run-skynet {
    #https://freeaccessibilitychecker.skynettechnologies.com/
    #https://freeaccessibilitychecker.skynettechnologies.com/?website=https://idasm-unibe-ch.github.io/unibe-web-accessibility/
    #https://freeaccessibilitychecker.skynettechnologies.com/?website=https://idasm-unibe-ch.github.io/unibe-web-accessibility/perceivable
    CHECKER_URL="https://www.skynettechnologies.com/accessibility-checker"

    # will change this but want to keep simple for testing purposs
    TARGET_URL="https://idasm-unibe-ch.github.io/unibe-web-accessibility/perceivable"

    echo " "$CHECKER_URL" + "$TARGET_URL""

    # Send the request using curl --- info about user agent helps curl req. to get through as automated interaction
    response=$(curl -s -X POST "$CHECKER_URL" \
    -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" \
    -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8" \
    -H "Accept-Encoding: gzip, deflate, br" \
    -H "Connection: keep-alive" \
    -d "url=$TARGET_URL")

   #  python download_report.py "$TARGET_URL" using python to try and click thru the elements of the page and download it
   # couldnt get it to work fully, downloads require email and everything.. it was just something i wanted to try

    #curl -o response.html "https://freeaccessibilitychecker.skynettechnologies.com/?website=https://idasm-unibe-ch.github.io/unibe-web-accessibility/perceivable"
}
# not implemented
# function clear-skynet {}

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
    mkdir -p "results/axe"
    npx axe "$1" --dir ./results/axe/
    echo "Axe-core audit generated and saved at results/axe."
}

function set-up-achecker {
    # achecker
    npm install -g accessibility-checker
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
    timestamp=$(date +%F_%H-%M-%S)
    results=$(node html_cs.js "$@" | sed 's/;/,/g')
    mkdir -p results/HTML_CodeSniffer
    echo "$@" > "results/HTML_CodeSniffer/htmlcs-results-$timestamp.txt"
    echo "$results" >> "results/HTML_CodeSniffer/htmlcs-results-$timestamp.txt"
    echo "HTML_CodeSniffer audit generated and saved at results/HTML_CodeSniffer."
}

function main {
    case "$1" in
        start)
            echo "Starting server..."
            docker-compose up -d server
            echo "View web app at http://localhost:1338/"
        ;;
        setup)
            set-up-$2
            echo "Ready to use $2"
        ;;
        test)
            echo "Evaluating webpage: $3"
            run-$2 "$3"
        ;;
        run)
            for page in "${WEBPAGES[@]}"
            do
                echo "Audit for webpage: $3/$page"
                run-$2 "$3/$page"
            done
        ;;
        cleanup)
            clean-up-$2
            echo "Clean up is done."
        ;;
        end)
            docker-compose down
            echo "All containers for the server are down now."
        ;;
        *)
            echo "$__usage"
    esac
   
}

# ./test.bash run axe http://localhost:1338/
# ./test.bash run axe https://idasm-unibe-ch.github.io/unibe-web-accessibility/
main "$@"