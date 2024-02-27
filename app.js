const express = require('express');
const path = require('path');
const app = express();
const port = 1338;

app.set("view engine", false);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/about.html'));
})

app.get('/tests', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/tests.html'));
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
