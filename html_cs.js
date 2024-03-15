const puppeteer = require('puppeteer');

// Replace with the url you wish to test.
// const url = 'http://localhost:1338/';
var url = process.argv[2];

// Replace with the path to the chrome executable in your file system.
// const executablePath = '/usr/bin/google-chrome-stable';

(async () => {
  const browser = await puppeteer.launch({
    // executablePath
  });

  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(msg.text())
  });

  await page.goto(url);

  await page.addScriptTag({
    path: 'node_modules/html_codesniffer/build/HTMLCS.js'
  });

  await page.evaluate(function () {
    HTMLCS_RUNNER.run('WCAG2AA');
  });

  await browser.close();
})();