const { client } = require('../client.js');
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_DRINKS;

//Will fetch all the drinks that includes the query string
async function search(query) {
    return new Promise((resolve, reject) => {
        client.connect(err => {
            const collection = client.db(dbName).collection(collectionName);
            collection.find({ name: { $regex: `.*${query}.*` } }).toArray((err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    })
};

module.exports = {
    search
}
