require('dotenv').config();
require("chromedriver")
require('./src/bot.js');

const express = require('express');
const { dropCollection, createCollection } = require('./src/db/global-operations.js');
const { loadDataIntoDb, detail } = require('./src/scripts/drinks.js');
const app = express();

console.log(process.env.MONGO_URI,process.env.DB_NAME,process.env.COLLECTION_DRINKS,process.env.COLLECTION_ANIMES)

app.use(function (req, res, next) {
    next();
});

app.patch('/reset-db', function (req, res, next) {
    dropCollection('drinks');
    createCollection('drinks');
    loadDataIntoDb();
});

app.get('/', function (req, res) {
    // search('Lemon').then(response => { 
    //     const template = `
    //     <h1>Search result</h1>
    //         ${
    //             response.map(element => {
    //                 const obj = {
    //                     name: element.name,
    //                     saqCode: element.saqCode
    //                 }
    //                 return (`<p>${JSON.stringify(obj)}</p>`)
    //             })
    //         }
    //     `;
    //     res.send(template);
    // });
    detail(14393386).then(list => {
        const template = `
        <h1>Search result</h1>
        ${list.map(e => {
            return `<p>${e.storeName} : ${e.available} available</p>`
        })}
    `
        res.send(template);
    });
});

app.post('/animes/add', function (req, res) {
    const object = req.params;
});

app.listen(3000, function () {
    console.log("Listening on port 3000. Go to http://localhost:3000");
});