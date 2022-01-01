
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:habibiana@cluster0.veaae.mongodb.net/discord_bot?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// client.connect(err => {
//   const collection = client.db("discord_bot").collection("animes");
//   console.log(collection.count);
//   client.close();
// });


async function insertMany(collectionName, list) {
    client.connect(err => {
        const collection = client.db("discord_bot").collection(collectionName);
        collection.insertMany(list, function (err, res) {
            if (err) throw err;
            console.log(`One element inserted in ${collectionName} collection.`);
        });
    });
};

async function insertElement(collectionName, object) {
    client.connect(err => {
        const collection = client.db("discord_bot").collection(collectionName);
        collection.insertOne(object, function (err, res) {
            if (err) throw err;
            console.log(`One element inserted in ${collectionName} collection.`);
        });
    });
};

async function removeElement(collectionName, query) {
    client.connect(err => {
        const collection = client.db("discord_bot").collection(collectionName);
        collection.deleteOne(query, function (err, res) {
            if (err) throw err;
            console.log(`One element removed from ${collectionName} collection.`);
        })
    });
}

async function createCollection(collectionName) {
    client.connect(err => {
        client.db("discord_bot").createCollection(collectionName, function (err, res) {
            if (err) throw err;
            console.log(`Created ${collectionName} collection.`);
        });
    });
}

async function dropCollection(collectionName) {
    client.connect(err => {
        client.db("discord_bot").dropCollection(collectionName, function (err, res) {
            if (err) throw err;
            console.log(`Dropped ${collectionName} collection.`);
        });
    });
}

async function close() {
    client.close();
}

module.exports = {
    insertElement,
    insertMany,
    removeElement,
    createCollection,
    dropCollection,
    close
}
