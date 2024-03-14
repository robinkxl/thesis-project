module.exports = {
    ruleArchive: "latest",
    policies: ["IBM_Accessibility"],
    failLevels: ["violation"],
    reportLevels: [
        "violation",
        "potentialviolation",
        "recommendation",
        "potentialrecommendation",
        "manual",
        "pass",
    ],
    outputFormat: ["json"],
    outputFilenameTimestamp: false,
    label: [process.env.TRAVIS_BRANCH],
    outputFolder: "results/achecker",
    baselineFolder: "test/baselines",
    cacheFolder: "/tmp/accessibility-checker"
};