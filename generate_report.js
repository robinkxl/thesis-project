// Generates a results report for a given achecker result file
const fs = require("fs");
const readline = require("readline");

// Check if a filename is provided as an argument
if (process.argv.length < 4) {
    console.error("Usage: node generate_report.js <tool> <filename>");
    process.exit(1); // Exit with error code 1
}

// Extract the filename from the command-line arguments
const tool = process.argv[2];
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
function createViolationObject(toolName,pageUrl) {
    return {
        tool: toolName,
        url: pageUrl,
        error_name: "",
        error_description: "",
        error_position: ""
    };
}

function generateAxeReport(filePath) {
    const results = require(filePath);
    const urlPath = results[0].url;
    let summary = {
        tool: tool,
        url: urlPath,
        fails: 0
    }

    if (results[0].violations.length > 0) {
        for (key in results[0].violations) {
            results[0].violations[key].nodes.forEach((node) => {
                node.any.forEach((error) => {
                    const violation = createViolationObject(tool, urlPath);

                    violation['error_name'] = error.id;
                    violation['error_description'] = error.message;
                    violation['error_position'] = node.html;
                    summary.fails += 1;
                    jsonData.report.push(violation);
                });
            });
        }
    } 
    // else {
    //     const violation = createViolationObject();
    //     jsonData.report.push(violation);
    // }
    
    jsonData.summary.push(summary);
    // console.log(jsonData);
    updateReport(jsonData);
}

function generateAcheckerReport(filePath) {
    const results = require(filePath);
    const toolName = "accessibility-checker";
    const urlPath = results.summary.URL;
    const summary = {
        tool: toolName,
        url: urlPath,
        fails: results.summary.counts.violation
    };

    if (summary.fails > 0) {
        // Extract violations
        for (key in results.results) {
            if (results.results[key].level == "violation") {
                const violation = createViolationObject(toolName, urlPath);

                violation['error_name'] = results.results[key].ruleId;
                violation['error_description'] = results.results[key].message;
                violation['error_position'] = results.results[key].snippet;
                jsonData.report.push(violation);
            }
        }
    }
    // else {
    //     const violation = createViolationObject(urlPath);
    //     jsonData.report.push(violation);
    // }

    // Update summary
    jsonData.summary.push(summary);
    // console.log(jsonData);
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
        const toolName = "HTML_CodeSniffer";
        let summary = {
            tool: toolName,
            url: urlPath,
            fails: 0
        };
        let itemsArray = [];

        uniqueLines.forEach(line => {
            if (line.includes("Error")) {
                const violation = createViolationObject(toolName,urlPath);

                itemsArray = line.split('|');
                violation['error_name'] = itemsArray[1];
                violation['error_description'] = itemsArray[4];
                violation['error_position'] = itemsArray[5];
                summary.fails++;
                jsonData.report.push(violation);
            }
        });

        // if (violationCount === 0) {
        //     // Save results
        //     jsonData.report.push(violation);
        // }
        
        // Update summary
        jsonData.summary.push(summary);
        // console.log(jsonData);
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
        const toolName = "Asqatasun";
        let urlPath = data[0][3].replaceAll('"', '');
        let summary = {
            tool: toolName,
            url: urlPath,
            fails: 0
        };
        
        // name
        // rgaa.topics[0].topic
        // description
        // rgaa.topics[0].criteria[0].criterium.tests['1'] (array)

        // console.log(data);
        data.forEach(item => {
            if (item.includes('nc')) {
                const violation = createViolationObject(toolName,urlPath);
                const themeIndex = parseInt(item[0]) - 1;
                const criteriaIndex = parseInt(item[1]) - 1;
                const testIndex = item[2];

                violation['error_name'] = rgaa.topics[themeIndex].topic;
                violation['error_description'] = rgaa.topics[themeIndex].criteria[criteriaIndex].criterium.tests[testIndex].join(' ');
                violation['error_position'] = "";
                summary.fails += 1;
                jsonData.report.push(violation);
            }
        });

        // Update summary
        jsonData.summary.push(summary);
        // console.log(jsonData);
        updateReport(jsonData);
    });
    
}

if (tool == "achecker") {
    generateAcheckerReport(path);
} else if (tool == "htmlcs") {
    generateHTMLCSReport(path);
} else if (tool === "axe") {
    generateAxeReport(path);
} else if (tool === "asq") {
    generateAsqatasunReport(path);
} else {
    process.exit(1);
}

