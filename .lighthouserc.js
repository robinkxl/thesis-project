module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:1338/perceivable',
        'http://localhost:1338/operable',
        'http://localhost:1338/understandable',
      ],
      startServerReadyPattern: 'listening on port 1338', // cohesive with app.js now
      numberOfRuns: 1,  // this will be 1 for each url.
      settings: {
        preset: "desktop", // if we take this away it will evaluate the website as mobile view, so we could also do multiple tests for some particular criteria.
        chromeFlags: ['--no-sandbox'], // bypass the sandbox error
      },
      output: ['html'], // Tell Lighthouse to generate HTML reports
      outputPath: './.lighthouseci', // Where to put them
    },
    upload: {
      target: 'temporary-public-storage', // instead of making a server 
    },
  },
};