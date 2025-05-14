module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start', // Adjust to your app's dev/start command
      startServerReadyPattern: 'Compiled successfully, port 1338', // Waits until the app is ready
      url: ['http://localhost:1338'], // URL that is being tests 
    },
    upload: {
      target: 'temporary-public-storage', // instead of making a server 
    },
  },
};