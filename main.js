require('dotenv').config();
require("chromedriver")
require('./src/bot.js');

const express = require('express');
const { dropCollection, createCollection } = require('./src/db/global-operations.js');
const { loadDataIntoDb, detail } = require('./src/scripts/drinks.js');
const app = express();

app.use(function (req, res) {
});

app.patch('/reset-db', function (req, res) {
    // dropCollection('drinks');
    // createCollection('drinks');
    // loadDataIntoDb();
});

app.get('/', function (req, res) {
});

app.post('/animes/add', function (req, res) {
});

app.listen(3000, function () {
    console.log("Listening on port 3000. Go to http://localhost:3000");
});