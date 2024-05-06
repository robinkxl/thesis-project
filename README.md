A study of Open Source Web Accessibility Testing Tools
================================

This repository contains the source code for the thesis project *Incorporating Web Accessibility into a CI/CD Pipeline: A study of Open Source Evaluation Tools*, which can viewed here: (not available yet)

**Abstract**: This study explores the integration of Web Accessibility testing tools into Continuous Integration and Continuous Deployment environments to improve the accessibility of web content. The research evaluates the effectiveness of these tools in detecting violations of the Web Content Accessibility Guidelines (WCAG). A [test website](https://idasm-unibe-ch.github.io/unibe-web-accessibility/) with a controlled number of WCAG violations was employed to assess the tools performance based on metrics measuring error identification, positioning, and accuracy of descriptions. Our results indicate that the selected Web Accessibility testing tools detect on average approximately 20% of all errors on a web page. While the tools can support developer teams to identify issues on web pages, manual testing is still required to ensure comprehensive web accessibility compliance.

**Authors and collaborators**: The thesis and this repository were collaboratively developed by *Elena Moser* and *Jesper Yli-Hukka Högback*. The study's topic was worked out in partnership with the *Web/Mobile team* at *IT Services Office (ID)* at *Bern University*. It was carried out as the final project within the [*Web programming* program at *Blekinge Tekniska Högskolan*](https://www.bth.se/utbildning/program-och-kurser/pagwg/).  

**Table of contents**
- [Test Website](#test-website)
    - [Running the web app locally with Docker](#running-the-web-app-locally-with-docker)
- [Web Accessibility evaluation tools](#web-accessibility-evaluation-tools)
    - [Testing the tools locally with bash](#testing-the-tools-locally-with-bash)
    - [Integration of tool into CI pipeline](#integration-of-tool-into-ci-pipeline)

## Test Website

For our study, we created a test website that includes WCAG violations. The purpose was to create a controlled environment for the performance assessment of the Web Accessibility testing tools. The website was designed using HTML, CSS, JavaScript and locally hosted via the Express.js framework to facilitate URL-based testing tool requirements. Composed of five pages, three are relevant for testing, namely *Perceivable*, *Operable* and *Understandable*. Violations were deliberately included on these three pages for each implemented criterion, ranging from easily detectable, like missing alternative text on images, to those requiring additional context for identification. The website maintains a consistent structure across its pages, except for the Understandable page, which intentionally deviates to highlight the criterion of consistent navigation. This deviation involves swapping the positions of the header and footer elements. Each page follows a standardized layout: a main heading, followed by a guideline and its corresponding criterion. Typically, the criterion section includes explanatory text followed by examples displayed in two boxes: one green, indicating correct implementation, and one red, depicting incorrect approaches. Additional information, denoted by a yellow box, may accompany certain criteria, showcasing existing implementation, examples from other pages, or relevant details. The examples created are mostly derived directly from those provided by [W3C](https://www.w3.org/TR/WCAG21/). For rules lacking clear examples or any examples at all, we had to formulate our own interpretations based on the information provided by [W3C](https://www.w3.org/TR/WCAG21/).

The published website can accessed via this link: [https://idasm-unibe-ch.github.io/unibe-web-accessibility/](https://idasm-unibe-ch.github.io/unibe-web-accessibility/).

For more details about the test website, please refer to the PDF copy of the thesis.

### Running the web app locally with Docker

The web application can be run locally with docker and viewed in your browser of choice at [http://localhost:1338/](http://localhost:1338/).

```
# to run server in background
docker compose up -d server

# to shut down
docker compose down
```
These commands are also available via the test.bash script (see below).

## Web Accessibility evaluation tools

In this study, we examined [Deque Systems’ Axe-Core CLI](https://www.npmjs.com/package/@axe-core/cli), [Squiz Labs’ HTML_CodeSniffer](https://www.npmjs.com/package/html_codesniffer), [IBM’s Equal Access Accessibility Checker](https://www.npmjs.com/package/accessibility-checker), and [Asqatasun](https://asqatasun.org/).
For more details about the tools examined in this investigation, please refer to the PDF copy of the thesis.

### Testing the tools locally with bash

In order to test the different tools locally, we created a bash-script.

```
# to view intructions
./test.bash
```

In order to obtain the audit results for the webpages of the published test website follow the following steps:

```
# Start by running an audit for each webpage
# with the Accessibility-checker
./test.bash setup achecker
./test.bash run achecker https://idasm-unibe-ch.github.io/unibe-web-accessibility
./test.bash cleanup achecker

# with Axe 
./test.bash setup axe
./test.bash run axe https://idasm-unibe-ch.github.io/unibe-web-accessibility/
./test.bash cleanup axe

# with HTML_CodeSniffer 
./test.bash setup htmlcs
./test.bash run htmlcs https://idasm-unibe-ch.github.io/unibe-web-accessibility
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

Given our project deadlines, we haven't had the chance to fully automate the process of running each tool on every web page of the test website just yet.
It is however possible to download the audit results for each tool as artifacts by going to the respective GitHub Actions workflows, i.e. [*.github/workflows/testing_tools_audits.yml*](https://github.com/idasm-unibe-ch/unibe-web-accessibility/actions/workflows/testing_tools_audits.yml) and [*.github/workflows/asqatasun_audits.yml*](https://github.com/idasm-unibe-ch/unibe-web-accessibility/actions/workflows/asqatasun_audits.yml).

### Integration of tool into CI pipeline 

The GitHub Actions workflow *.github/workflows/example_ci.yml* was created as an [example](https://github.com/idasm-unibe-ch/unibe-web-accessibility/actions/workflows/example_ci.yml) of how to integrate the tools into a CI pipeline.