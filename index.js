const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;



app.use(express.json())
app.use(cors())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.ouuvt7g.mongodb.net/?retryWrites=true&w=majority`;

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

        const categoryCollection = client.db('publicLibrary').collection('categories')
        const booksCollection = client.db('publicLibrary').collection('allBooks')


        app.get('/categories', async(req, res)=>{
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/books/:category', async(req, res)=>{
            const category = req.params.category;
            const query = { category: category };
            const result = await booksCollection.find(query).toArray();
            res.send(result)
        })


        app.get('/allbooks', async(req, res)=>{
            const cursor = booksCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })



        app.post('/addBooks', async(req, res)=>{
            const book = req.body
            const result = await booksCollection.insertOne(book)
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



app.get('/', (req, res) => {
    res.send('the library server is running')
})

app.listen(port, () => {
    console.log(`the server is running on port: ${port}`)
})