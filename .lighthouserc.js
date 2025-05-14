module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start', // Adjust to your app's dev/start command
      startServerReadyPattern: 'listening on port 1338', // cohesive with app.js now
      url: ['http://localhost:1338'], // URL that is being tests 
      numberOfRuns: 1  // or 3?
    },
    upload: {
      target: 'temporary-public-storage', // instead of making a server 
    },
  },
};