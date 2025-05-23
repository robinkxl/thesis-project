// Generates a results report for a given achecker result file
const fs = require("fs");
const readline = require("readline");

// Check if a filename is provided as an argument
if (process.argv.length < 4) {
    console.error("Usage: node generate_report.js <tool> <filename>");
    process.exit(1); // Exit with error code 1
}

// Extract the filename from the command-line arguments
const toolAbbreviation = process.argv[2];
const path = process.argv[3];

// Global variables
const outputFilePath = "results/report.json";
const jsonData = require('./results/report.json');

// Function to append to the content of the current jsonData 
function updateReport(updatedData) {
    const jsonString = JSON.stringify(updatedData);

    fs.writeFileSync(outputFilePath, jsonString, 'utf-8', (err) => {
        if (err) throw err;
      });
}

// Function to create a new violation object with default values
function createViolationObject(toolName, pageUrl) {
    return {
        tool: toolName,
        url: pageUrl,
        error_name: "",
        error_description: "",
        error_position: "",
        error_help: ""
    };
}

// Function to handle summary updates
function updateSummary(webpageName, toolName, errors) {
    if (!jsonData.summary.hasOwnProperty(webpageName)) {
        // If entrie does not yet exist
        jsonData.summary[webpageName] = {};
    }

    jsonData.summary[webpageName] = {
        ...jsonData.summary[webpageName],
        [toolName]: errors
    };
}

function generateAxeReport(filePath) {
    const results = require(filePath);
    const urlPath = results[0].url;
    const webpage = urlPath.split('/').at(-1) || urlPath.split('/').at(-2).replace(':','_');
    const toolFullName = "Axe";
    let fails = 0;

    if (results[0].violations.length > 0) {
        for (key in results[0].violations) {
            results[0].violations[key].nodes.forEach((node) => {
                const violation = createViolationObject(toolFullName, urlPath);

                violation['error_name'] = results[0].violations[key].id;
                violation['error_description'] = results[0].violations[key].description;
                violation['error_position'] = node.html.replaceAll('\n', '');
                violation['error_help'] = results[0].violations[key].helpUrl;

                for (let i = 0; i < node.any.length; i++) {
                    if (node.any[i].relatedNodes.length > 0) {
                        violation['error_position'] = node.any[i].relatedNodes[0].html.replaceAll('\n', '').replace(/\s{2,}/g,'');
                    }
                }

                fails += 1;
                jsonData.report.push(violation);
            });
        }
    }
    
    updateSummary(webpage, toolFullName, fails);
    updateReport(jsonData);
}

function generateAcheckerReport(filePath) {
    const results = require(filePath);
    const toolFullName = "Accessibility-checker";
    const urlPath = results.summary.URL;
    const webpage = urlPath.split('/').at(-1) || urlPath.split('/').at(-2).replace(':','_');
    const fails = results.summary.counts.violation;

    if (fails > 0) {
        // Extract violations
        for (key in results.results) {
            if (results.results[key].level == "violation") {
                const violation = createViolationObject(toolFullName, urlPath);

                violation['error_name'] = results.results[key].ruleId;
                violation['error_description'] = results.results[key].message;
                violation['error_position'] = results.results[key].path.dom;
                violation['error_position'] += results.results[key].snippet;
                violation['error_help'] = results.results[key].help;
                jsonData.report.push(violation);
            }
        }
    }

    // Update summary
    updateSummary(webpage, toolFullName, fails);
    updateReport(jsonData);
}

function generateHTMLCSReport(filePath) {
    // Read txt file and extract results details
    fs.readFile(filePath, (err, data) => {
        // Exit in case of error
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        const lines = data.toString().split('\n');
        const uniqueLines = new Set(lines);
        const urlPath = lines[0];
        const webpage = urlPath.split('/').at(-1).replace(':','_');
        const toolFullName = "HTML_CodeSniffer";
        let fails = 0;
        let itemsArray = [];

        uniqueLines.forEach(line => {
            if (line.includes("[HTMLCS] Error")) {
                const violation = createViolationObject(toolFullName, urlPath);

                itemsArray = line.split('|');
                violation['error_name'] = itemsArray[1];
                violation['error_description'] = itemsArray[4];
                violation['error_position'] = itemsArray[5];
                fails++;
                jsonData.report.push(violation);
            }
        });
        
        // Update summary
        updateSummary(webpage, toolFullName, fails);
        updateReport(jsonData);
    });
}

function generateAsqatasunReport(filePath) {
    // Read csv file and extract results details
    const stream = fs.createReadStream(filePath);
    const reader = readline.createInterface({ input: stream });
    const rgaa = require('./asqatasun-docker/criteres_v4.1.json');
    let data = [];

    reader.on("line", row => {
        data.push(row.split(","));
    });

    reader.on("close", () => {
        //  Reached the end of file
        const toolFullName = "Asqatasun";
        const urlPath = data[0][3].replaceAll('"', '');
        const webpage = urlPath.split('/').at(-1) || urlPath.split('/').at(-2).replace(':','_');
        let fails = 0;
    
        data.forEach(item => {
            if (item.includes('nc')) {
                const violation = createViolationObject(toolFullName,urlPath);
                const themeIndex = parseInt(item[0]) - 1;
                const criteriaIndex = parseInt(item[1]) - 1;
                const testIndex = item[2];

                violation['error_name'] = rgaa.topics[themeIndex].topic;
                violation['error_description'] = rgaa.topics[themeIndex].criteria[criteriaIndex].criterium.tests[testIndex].join(' ');
                violation['error_description'] = violation['error_description'].replaceAll(';',',');
                violation['error_position'] = "";
                fails += 1;
                jsonData.report.push(violation);
            }
        });

        // Update summary
        updateSummary(webpage, toolFullName, fails);
        updateReport(jsonData);
    });
    
}

function generateLighthouseReport(filePath) {
    const results = require(filePath);
    const toolFullName = "Lighthouse";
    const urlPath = results.finalUrl;
    const webpage = urlPath.split('/').at(-1) || urlPath.split('/').at(-2).replace(':','_');
    let fails = 0;

    // Check accessibility audit entries
    const auditEntries = results.audits;
    for (const key in auditEntries) {
        const audit = auditEntries[key];

        if (audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== 'notApplicable') {
            const violation = createViolationObject(toolFullName, urlPath);
            violation.error_name = audit.id;
            violation.error_description = audit.title;
            violation.error_position = audit.description || '';
            violation.error_help = audit.documentation || audit.details.explanation || '';
            fails++;
            jsonData.report.push(violation);
        }
    }

    // Update summary
    updateSummary(webpage, toolFullName, fails);
    updateReport(jsonData);

}

function generateWAVEReport(filePath) {
    const results = require(filePath);
    const toolFullName = "WAVE";
    const urlPath = results?.statistics?.pageurl || "unknown";
    const webpage = urlPath.split('/').at(-1) || urlPath.split('/').at(-2)?.replace(':', '_') || "home";
    const fails = results?.categories?.error?.count || 0;

    if (fails > 0 && results.categories?.error?.items) {
        const items = results.categories.error.items;

        for (const key in items) {
            const entry = items[key];
            const selectors = entry.selectors?.selector || [];

            selectors.forEach((selector) => {
                const violation = createViolationObject(toolFullName, urlPath);
                violation.error_name = key;
                violation.error_description = entry.description || "No description provided";
                violation.error_position = selector.replace(/\s+/g, ' ').trim();
                violation.error_help = `https://wave.webaim.org/help?${key}`;

                jsonData.report.push(violation);
            });
        }
    }

    updateSummary(webpage, toolFullName, fails);
    updateReport(jsonData);
}


if (toolAbbreviation == "achecker") {
    generateAcheckerReport(path);
} else if (toolAbbreviation == "htmlcs") {
    generateHTMLCSReport(path);
} else if (toolAbbreviation === "axe") {
    generateAxeReport(path);
} else if (toolAbbreviation === "asq") {
    generateAsqatasunReport(path);
} else if (toolAbbreviation === "lighthouse") {
    generateLighthouseReport(path);
} else if (toolAbbreviation === "wave") {
    generateWAVEReport(path);
} else {
    process.exit(1);
}

