import { writeFileSync } from "fs";

// Read Istanbul JSON coverage report
const coverageData = require('./coverage/coverage-final.json');

// Function to convert coverage data to Markdown
function generateCoverageMarkdown(coverageData) {
    let markdown = '# Istanbul Coverage Report\n\n';

    // Loop through each file in the coverage data
    Object.keys(coverageData).forEach(filePath => {
        const fileCoverage = coverageData[filePath];
        markdown += `## ${filePath}\n\n`;

        // Loop through each line in the file
        fileCoverage.forEach((lineCoverage, lineNumber) => {
            const line = lineNumber + 1;
            const coveragePercentage = lineCoverage === 0 ? '0%' : '100%';
            const status = lineCoverage === 0 ? 'Not covered' : 'Covered';

            markdown += `| Line ${line} | ${status} | ${coveragePercentage} |\n`;
        });

        markdown += '\n';
    });

    return markdown;
}

// Generate Markdown content
const markdownContent = generateCoverageMarkdown(coverageData);

// Write Markdown content to file
writeFileSync('coverage-report.md', markdownContent);

console.log('Coverage report generated successfully.');
