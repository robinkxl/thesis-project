#!/usr/bin/env bash

OUTPUT_FILE="results/report.json"
JS_FILE="generate_report.js"

# Axe provides the categories: inapplicable, passes, incomplete, violation
# Axe fail condition: violation (non customizable)
# Axe reports: inapplicable, passes, incomplete, violation (non customizable)

# Achecker provides the categories: "violation", "potentialviolation","recommendation","potentialrecommendation",
# "manual","pass","ignored","elements","elementsViolation","elementsViolationReview"
# Achecker fail condition: violation (customizable)
# Achecker reports: violation, potentialviolation, recommendation, potentialrecommendation, manual (customizable)

# HTML_CodeSniffer provide the categories: Notice, Warning, Error
# HTMLCS fail condition: Error (customizable)
# HTMLCS reports: Error, Warning

function axe-results-summary {
    # Define the target directory
    axe_directory="results/axe"

    # Check if the target is not a directory
    if [ ! -d "$axe_directory" ]; then
    echo "The '$axe_directory' directory does not exist."
    exit 1
    fi

    # Loop through files in the target directory
    for file in "$axe_directory"/*; do
    if [ -f "$file" ]; then
        node "$JS_FILE" "axe" "./$file"
    fi
    done    
    
    echo "Axe results report is done."
}

function achecker-results-summary {
    # Define the target directory
    achecker_directory="results/achecker/localhost_1338"

    # Check if the target is not a directory
    if [ ! -d "$achecker_directory" ]; then
    echo "The '$achecker_directory' directory does not exist."
    exit 1
    fi

    # Rename home page file
    # Needed for being read in the loop below! 
    if [ -e "$achecker_directory/.json" ]; then
        mv "$achecker_directory/.json" "$achecker_directory/home.json"
    fi
    

    # Loop through files in the target directory
    for file in "$achecker_directory"/*; do
    if [ -f "$file" ]; then
        node "$JS_FILE" "achecker" "./$file"
    fi
    done

    echo "Accessibility-checker results report is done."
}

function htmlcs-results-summary {
    # Define the target directory
    htmlcs_directory="results/HTML_CodeSniffer/"

    # Check if the target is not a directory
    if [ ! -d "$htmlcs_directory" ]; then
    echo "The '$htmlcs_directory' directory does not exist."
    exit 1
    fi

    # Loop through files in the target directory
    for file in "$htmlcs_directory"/*; do
    if [ -f "$file" ]; then
        node "$JS_FILE" "htmlcs" "./$file"
    fi
    done

    echo "HTML_CodeSniffer results report is done."

}

function asq-results-summary {
    # Define the target directory
    asq_directory="asqatasun-docker/results/audits"

    # Check if the target is not a directory
    if [ ! -d "$asq_directory" ]; then
    echo "The '$asq_directory' directory does not exist."
    exit 1
    fi

    # Loop through files in the target directory
    for file in "$asq_directory"/*; do
    if [ -f "$file" ]; then
        node "$JS_FILE" "asq" "./$file"
    fi
    done

    echo "Asqatasun results report is done."

}

function main {
    # Create output file to write to
    echo '{"summary": [], "report": []}' > $OUTPUT_FILE
    achecker-results-summary
    axe-results-summary
    htmlcs-results-summary
    asq-results-summary
}

main
