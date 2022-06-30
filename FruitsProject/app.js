const {MongoClient} = require('mongodb');
const assert = require('assert');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
// const url = "mongodb+srv://localhost:27017/?maxPoolSize=20&w=majority";

// Database Name
const dbName = 'fruitsDB';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Establish and verify connection
    // await client.db(dbName).command({ ping: 1 });

    const db = await client.db(dbName);

    console.log("Connected successfully to server");

    const fruits = await db.collection("fruits");

    // await insertDocuments(fruits);
    await findDocument(fruits);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const insertDocuments = async function(collection) {
  try {
    const fruits = [
      {
        name: "Apple",
        score: 8,
        review: "Great Fruit"
      },
      {
        name: "Orange",
        score: 6,
        review: "Kinda sour"
      },
      {
        name: "Banana",
        score: 9,
        review: "Great stuff!!"
      },
    ];
    const insertResult = await collection.insertMany(fruits);
    let ids = insertResult.insertedIds;

    console.log(`${insertResult.insertedCount} documents were inserted.`);
    for (let id of Object.values(ids)) {
      console.log(`Inserted a document with id ${id}`);
    }
  }
  catch(e) {
    console.log(`A MongoBulkWriteException occurred, but there are successfully processed documents.`);
    let ids = e.result.result.insertedIds;
    for (let id of Object.values(ids)) {
      console.log(`Processed a document with id ${id._id}`);
    }
    console.log(`Number of documents inserted: ${e.result.result.nInserted}`);
  }
}

const findDocument = async function(collection, query={}) {
  try {
    const cursor = collection.find(query);
    // for await (const Fruit of cursor) {
    //   console.log(doc);
    // }

    const allFruits = await cursor.toArray();
    for (let fruit of allFruits) {
      console.log(fruit);
    }

  }
  catch(e) {
    console.log(e);
  }
}

// client.connect(function(err) {
//   try {
//     assert.equal(null, err);
//     console.log("Connected successfully to the server");
//
//     const db = client.db(dbName);
//   }
//   finally {
//     client.close();
//   }
// });
