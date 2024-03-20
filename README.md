A study of Open Source Web Accessibility Testing tools
================================

This repository contains the code for the thesis project *Incorporating Web Accessibility into a CI/CD Pipeline: A study of Open Source Evaluation tools*, which can viewed here: (not available yet)

TODO: Describe our work.

The published website can accessed via the link: [https://effective-carnival-o4gzzj4.pages.github.io/](https://effective-carnival-o4gzzj4.pages.github.io/). Note that this repo is private, this link therefore only works for anyone with access to the repo.

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
* go to *.github/workflows/example_ci.yml* and see an example of how to integrate them in a CI pipeline.
* go to *.github/workflows/test_ci.yml* and view the results from the Web Accessibility testing tools by downloading them from github artifacts.