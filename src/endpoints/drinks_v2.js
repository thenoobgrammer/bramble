const axios = require('axios');
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:habibiana@cluster0.veaae.mongodb.net/discord_bot?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const collectionName = 'drinks';

async function getDrink(name, id) {
    client.connect(err => {
        const drinkCollection = client.db("discord_bot").collection(collectionName);
        drinkCollection.
    })
}
