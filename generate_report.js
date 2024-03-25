// Generates a results report for a given achecker result file
const fs = require("fs");

// Check if a filename is provided as an argument
if (process.argv.length < 3) {
    console.error("Usage: node achecker_generate_report.js <filename>");
    process.exit(1); // Exit with error code 1
}

// Extract the filename from the command-line arguments
const path = process.argv[2];

// Global variables
const tool = path.split('/')[2];
const outputFilePath = "results/report.json";
const jsonData = require('./results/report.json');

function updateReport(updatedData) {
    const jsonString = JSON.stringify(updatedData);

    fs.writeFileSync(outputFilePath, jsonString, 'utf-8', (err) => {
        if (err) throw err;
      });
}


function generateAcheckerReport(filePath) {
    const results = require(filePath);
    const urlPath = results.summary.URL;
    const violationCount = results.summary.counts.violation;
    // let summary = {};
    let violation = {};

    violation['tool'] = tool;
    violation['url'] = urlPath;
    violation['error_name'] = "";
    violation['error_description'] = "";
    violation['error_position'] = "";

    // Check if violations found
    // console.log(violationCount);

    if (violationCount > 0) {
        // Extract violations
        for (key in results.results) {
            if (results.results[key].level == "violation") {
                violation['error_name'] = results.results[key].ruleId;
                violation['error_description'] = results.results[key].message;
                violation['error_position'] = results.results[key].snippet;
                jsonData.report.push(violation);
            }
        }
    } else {
        jsonData.report.push(violation);
    }

    // console.log(jsonData.report);
    updateReport(jsonData)
}

function generateHTMLCSReport(filePath) {
    // Read txt file and extract results details
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        const urlPath = data.toString().split('\n')[0];
        let violationCount = 0;
        let violation = {};
        let itemsArray = [];

        violation['tool'] = tool;
        violation['url'] = urlPath;
        violation['error_name'] = "";
        violation['error_description'] = "";
        violation['error_position'] = "";

        data.toString().split('\n').forEach(line => {
            if (line.includes("Error")) {
                violationCount++;
                itemsArray = line.split('|');
                violation['error_name'] = itemsArray[1];
                violation['error_description'] = itemsArray[4];
                violation['error_position'] = itemsArray[5];
                // Save results
                jsonData.report.push(violation);
            }
        });

        if (violationCount === 0) {
            // Save results
            jsonData.report.push(violation);
        }

        updateReport(jsonData)
    });
}

// console.log(path);

if (tool == "achecker") {
    generateAcheckerReport(path);
} else if (tool == "HTML_CodeSniffer") {
    generateHTMLCSReport(path)
}

