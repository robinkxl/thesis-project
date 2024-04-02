A study of Open Source Web Accessibility Testing tools
================================

This repository contains the code for the thesis project *Incorporating Web Accessibility into a CI/CD Pipeline: A study of Open Source Evaluation tools*, which can viewed here: (not available yet)

TODO: Describe our work.

The published website can accessed via the link: [https://ylih.github.io/Evaluation-site-for-Web-Accessibility-testing-tools/](https://ylih.github.io/Evaluation-site-for-Web-Accessibility-testing-tools/). Note that this repo is private, this link therefore only works for anyone with access to the repo.

TODO: Description of how the website works and how to set it up (alternatively link to the documentation).

**Table of contents**
- [A study of Open Source Web Accessibility Testing tools](#a-study-of-open-source-web-accessibility-testing-tools)
    - [Running the web app locally with docker](#running-the-web-app-locally-with-docker)
    - [Testing the tools locally with bash](#testing-the-tools-locally-with-bash)
    - [Testing the tools in github actions](#testing-the-tools-in-github-actions)

## Running the web app locally with docker

The web application can be run locally with docker and viewed in your browser of choice at [http://localhost:1338/](http://localhost:1338/).

```
# to run server in background
docker compose up -d server

# to shut down
docker compose down
```
These commands are also available via the test.bash script (see below).

## Testing the tools locally with bash

In order to test the different tools locally, we created a bash-script (work in progress).

```
# to view intructions
./test.bash
```

## Testing the tools in github actions 

In order to test the different tools in github actions:
* go to *.github/workflows/example_ci.yml* and see an [example](https://github.com/idasm-unibe-ch/unibe-web-accessibility/actions/workflows/example_ci.yml) of how to integrate them in a CI pipeline.
* go to *.github/workflows/test_ci.yml* and view the [results](https://github.com/idasm-unibe-ch/unibe-web-accessibility/actions/workflows/test_ci.yml) from the Web Accessibility testing tools by downloading them from github artifacts.

## From tests to result report and analysis

In order to obtain the audit results for the webpages of the published test website follow the following steps:

```
# Start by running an audit for each webpage
# with the Accessibility-checker
./test.bash setup achecker
./test.bash run achecker
./test.bash cleanup achecker

# with Axe 
./test.bash setup axe
./test.bash run axe
./test.bash cleanup axe

# with HTML_CodeSniffer 
./test.bash setup htmlcs
./test.bash run htmlcs
./test.bash cleanup htmlcs

# with Asqatasun
asqatasun-docker/asqatasun_audit.bash setup
asqatasun-docker/asqatasun_audit.bash run
# NOTE: The results need to be downloaded separately.
# Substitute the id below with the audit id to download.
asqatasun-docker/asqatasun_audit.bash audit <id>
asqatasun-docker/asqatasun_audit.bash cleanup

# Now all results have been saved 
# and you can generate (see results/): 
# report.json
# error_overview.csv
# error_summary_overview.csv
./generate_report.bash
```
