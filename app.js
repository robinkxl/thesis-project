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

app.get('/perceivable', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/perceivable.html'));
})

app.get('/operable', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/operable.html'));
})

app.get('/understandable', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/understandable.html'));
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
