// This script generates files for our analysis.
const fs = require("fs");

const report = require('./results/report.json');
const webdoc = require('./website-data.json');

// Generates an overview with the errors picked up by each tool
// for each webpage of the testing website
function generateTotalErrorsOverview() {
    let overview = [];
    
    for (let key in report.summary) {
        // Filter errors for test webpages
        if (Object.keys(webdoc).includes(key)) {
            report.summary[key]["Webpage"] = key;
            report.summary[key]["Violated_Criterions"] = webdoc[key][key+"PageErrors"];
            overview.push(report.summary[key]);  
        }
    }

    // List of objects to csv
    const csvData = objectToCsv(overview);
    // console.log(csvData);
    fs.writeFile('results/error_summary_overview.csv', csvData, (err) => {
 
        // In case of a error throw err.
        if (err) throw err;
    });
}

// Formats the errors overview into a LaTeX table content
function generateTotalErrorsOverviewLaTeX() {
    const separator = " & ";
    const endOfRow = "\\\\\n";
    let tableTitle = [];
    let tableContent = "";
    
    for (let key in report.summary) {
        // Filter errors for test webpages
        if (Object.keys(webdoc).includes(key)) {
            tableTitle = Object.keys(report.summary[key]);
            tableContent += key + separator;
            tableContent += Object.values(report.summary[key]).join(separator);
            tableContent += separator; 
            tableContent += webdoc[key][key+"PageErrors"]; 
            tableContent += endOfRow;    
        }
    }
    
    tableTitle.unshift("Webpage");
    tableTitle.push("Violated_Criterions");

    let table = tableTitle.join(separator) + endOfRow;

    table += tableContent;
    // console.log(tableTitle.join(separator) + endOfRow);
    // console.log(tableContent);

    fs.writeFile('results/Latex.txt', table, (err) => {
 
        // In case of a error throw err.
        if (err) throw err;
    });
}

// Generates an overview with all the errors 
// picked up by the tools with information about
// potentially related criterions
function generateErrorOverview() {
    let updatedErrors = [];

    for (let key in report.summary) {
        // Filter errors for test webpages
        if (Object.keys(webdoc).includes(key)) {
            let reportErrors = report.report.filter((item) => item.url.includes(key));
            let criterions = webdoc[key].implementedCriterions;
    
            // Loop through errors found
            reportErrors.forEach((error) => {
                // let errorPositionTag = error.error_position.split(' ')[0];
                // Regular expression to match content within < > tags
                const tagRegex = /<([^>]*)>/g;
                let errorPositionTag = error.error_position.match(tagRegex) || [];
                let errorDescriptionTag = error.error_description.match(tagRegex) || [];
                // console.log(errorPositionTag)

                
                error["related_criterion"] = [];
                error["criterion_example"] = [];
                
                // Loop through criterions for each category
                for (let id of Object.keys(criterions)) {
                    /// Loop through examples for each criterion
                    for (let name of Object.keys(criterions[id].examples)){
                        // Check if tag in error_description is included
                        // in the element of the criterion example
                        if (errorDescriptionTag.length > 0) {
                            errorDescriptionTag.forEach(tagItem => {
                                if (criterions[id].examples[name].element.includes(tagItem.split(' ')[0].replace('>', ''))) {
                                    error["related_criterion"].push(id);
                                    error["criterion_example"].push(name);
                                }
                            });
                        }

                        // Check if tag in error_position is included
                        // in the element of the criterion example
                        if (errorPositionTag.length > 0) {
                            errorPositionTag.forEach(tagItem => {
                                if (criterions[id].examples[name].element.includes(tagItem.split(' ')[0].replace('>', ''))) {
                                    error["related_criterion"].push(id);
                                    error["criterion_example"].push(name);
                                }
                            });
                        }
                    }
                }
                
                error["related_criterion"] = error["related_criterion"].join(', ');
                error["criterion_example"] = error["criterion_example"].join(', ');

                // Save updatedError
                updatedErrors.push(error);
            });
        }
    }

    // List of objects to csv 
    const csvData = objectToCsv(updatedErrors);
    // console.log(csvData); 
    fs.writeFile('results/error_overview.csv', csvData, (err) => {
 
        // In case of a error throw err.
        if (err) throw err;
    })
}


// Helper object that transforms a JSON object to a CSV object 
// Solution from geeksforgeeks.org
const objectToCsv = function (data) {
    const sep = ';';
    const csvRows = [];
 
    // Get headers 
    const headers = Object.keys(data[0]);
 
    // Push fetched headers into csvRows
    csvRows.push(headers.join(sep));
 
    // Loop to get value of each objects key
    for (const row of data) {
        const values = headers.map(header => {
            const val = row[header]
            return `${val}`;
        });
 
        // To add, separator between each value
        csvRows.push(values.join(sep));
    }
 
    /* To add new line for each objects values
       and this return statement array csvRows
       to this function.*/
    return csvRows.join('\n');
};

generateTotalErrorsOverview()
// generateTotalErrorsOverviewLaTeX()
generateErrorOverview()