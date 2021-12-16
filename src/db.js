
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:<habibiana>@cluster0.veaae.mongodb.net/discord_bot?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("discord_bot").collection("animes");
  console.log(collection.count);
  client.close();
});

async function insertElement(collectionName, object) {
    client.connect(err => {
        const collection = client.db("discord_bot").collection(collectionName);
        collection.insertOne(object, function(err, res) {
            if(err) throw err;
            console.log(`One element inserted in ${collectionName} collection.`);
            db.close();
        });
    });
};

async function removeElement(collectionName, query) {
    client.connect(err => {
        collection.deleteOne(query, function(err, res) {
            if(err) throw err;
            console.log(`One element removed from ${collectionName} collection.`);
            db.close();
        })
    });
}

module.exports = {
    insertElement,
    removeElement
}
