const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 4000;
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
require('dotenv').config();
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q83cw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send("Server is ready")
})

client.connect(err => {
    const BookCollection = client.db("bookshelves").collection("booklist");
  
//Adding Data to the Database
    app.post('/addBook', (req, res) => {
      const newBook = req.body;
  console.log('adding new book: ', newBook)
  BookCollection.insertOne(newBook)
      .then(result => {
          console.log('inserted count', result.insertedCount);
          res.send(result.insertedCount > 0)
      })
      .catch(err => console.log(err))
  })


  //Getting All books from database
  app.get('/allBooks',(req,res)=>{
    BookCollection.find()
    .toArray((err, doc)=>{
      res.send(doc)
    })
  })

      //deleting data from the database
    //   app.delete("/deleteEvent/:id", (req, res) => {
    //     console.log(req.params.id);
    //     collection
    //       .deleteOne({ _id: ObjectId(req.params.id) })
    //       .then((result) => res.send(result.deletedCount>0))
    //       .catch((err) =>console.log(err))
    //   });

  console.log("==SERVER READY==")
});


app.listen(port);