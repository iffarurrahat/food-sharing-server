const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9u7odmy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // connect to the "insertDB" database and access its "foodSharing" collection 
        const coffeeCollection = client.db('foodSharing').collection('foods')

        // post
        app.post('/foods', async(req, res) => {
            const newFoods = req.body;
            console.log(newFoods);

            const result = await coffeeCollection.insertOne(newFoods);
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('doctor is running');
})

app.listen(port, () => {
    console.log(`Car Doctor Server is running on port ${port}`);
})