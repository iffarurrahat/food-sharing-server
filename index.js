const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


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
        const foodsCollection = client.db('foodSharing').collection('foods');
        const requestCollection = client.db('foodSharing').collection('requests');

        // get --> read
        app.get('/foods', async (req, res) => {
            const cursor = foodsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // get --> single data
        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            // some data red
            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { userPhoto: 1, userName: 1, foodName: 1, photo: 1, location: 1, notes: 1, userName: 1, quantity: 1, date: 1, email: 1 },
            };

            const result = await foodsCollection.findOne(query, options)
            res.send(result)
        });

        // updated
        app.put('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const food = req.body;
            // console.log(id,  user);
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedFood = {
                $set: {
                    foodName: food.foodName,
                    quantity: food.quantity,
                    photo: food.photo,
                    location: food.location,
                    date: food.date,
                    notes: food.notes,
                }
            }
            const result = await foodsCollection.updateOne(filter, updatedFood, option)
            res.send(result)
        })

        // post
        app.post('/foods', async (req, res) => {
            const newFoods = req.body;
            const result = await foodsCollection.insertOne(newFoods);
            res.send(result)
        });

        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodsCollection.deleteOne(query);
            res.send(result)
        })



        // <-!----requests------->        
        app.get('/requests', async (req, res) => {
            // console.log(req.query.email);
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await requestCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/requests', async (req, res) => {
            const request = req.body;
            // console.log(request);
            const result = await requestCollection.insertOne(request);
            res.send(result)
        });

        app.delete('/requests/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await requestCollection.deleteOne(query);
            res.send(result)
        });


        // <-!-----manage single food------->
        app.get('/manage/:id', async (req, res) => {
            console.log(req.params.id);
            const result = await requestCollection.find({ foodDonarId: req.params.id}).toArray();
            console.log(result);
            res.send(result);
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

app.get('/', (req, res) => {
    res.send('FoodSa Sharing is running');
})

app.listen(port, () => {
    console.log(`FoodSa Sharing  Server is running on port ${port}`);
})