require('dotenv').config();
const db = require('./src/db.js');
const drinks = require('./src/scripts/drinks.js');
//require('./src/bot_general.js');
//require('./src/bot_music.js');

const express = require('express');
const app = express();


app.use(function(req, res, next) {
    console.log(req.method, req.path);
    next();
});

app.get('/', function(req, res) {
    //db.dropCollection('drinks');
    //db.createCollection('drinks');
    drinks.loadDataIntoDb();
    res.send("<h1>Hi</h1>");
});

app.post('/animes/add', function(req, res) {
    const object = req.params;
    console.log(object)
    //db.insertElement('animes', object);
});

app.listen(3000, function () {
    console.log("Listening on port 3000. Go to http://localhost:3000");
});