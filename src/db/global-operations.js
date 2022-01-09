const { client } = require('./client.js');

async function insertMany(collectionName, list) {
    client.connect(err => {
        const collection = client.db("discord_bot").collection(collectionName);
        collection.insertMany(list, function (err, res) {
            if (err) throw err;
            console.log(`One element inserted in ${collectionName} collection.`);
        });
        client.db.close();
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
        });
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


module.exports = {
    insertElement,
    insertMany,
    removeElement,
    createCollection,
    dropCollection
}
