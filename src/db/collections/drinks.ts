import client from '../client.js';
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_DRINKS;

//Will fetch all the drinks that includes the query string
async function search(query: String) {
    return new Promise((resolve, reject) => {
        client.connect((err: any) => {
            const collection = client.db(dbName).collection(collectionName);
            collection.find({ name: { $regex: `.*${query}.*` } }).toArray((err: any, res: any) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    })
};

module.exports = {
    search
}
