const puppeteer = require('puppeteer');

// Replace with the url you wish to test.
// const url = 'http://localhost:1338/';
var url = process.argv[2];

// Replace with the path to the chrome executable in your file system.
// const executablePath = '/usr/bin/google-chrome-stable';

let fail = false;

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
    // executablePath
  });

  const page = await browser.newPage();

  page.on('console', msg => {
    const output = msg.text();
    
    // Warnings pass but are printed
    // Errors result in exit 1 and are printed
    if (output.includes('Error')) {
        console.log(output);
        fail = true;
    } else if (output.includes('Warning')) {
      console.log(output);
    } else if (output.includes('done') && fail) {
      process.exit(1);
    }
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