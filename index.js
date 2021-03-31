const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
require("dotenv").config();
app.use(express.json());

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q83cw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Server is ready");
});

client.connect((err) => {
  const BookCollection = client.db("bookshelves").collection("booklist");
  const BookOrder = client.db("bookshelves").collection("orders");

  //Adding Data to the Database
  app.post("/addBook", (req, res) => {
    const newBook = req.body;
    console.log("adding new book: ", newBook);
    BookCollection.insertOne(newBook)
      .then((result) => {
        console.log("inserted count", result.insertedCount);
        res.send(result.insertedCount > 0);
      })
      .catch((err) => console.log(err));
  });
  //Adding Order to the Database
  app.post("/placeOrder", (req, res) => {
    const newOrder = req.body;
    console.log("Order Info: ", newOrder);
    BookOrder.insertOne(newOrder)
      .then((result) => {
        console.log("inserted count", result.insertedCount);
        res.send(result.insertedCount > 0);
      })
      .catch((err) => console.log(err));
  });

  //Getting All books from database
  app.get("/allBooks", (req, res) => {
    BookCollection.find().toArray((err, doc) => {
      res.send(doc);
    });
  });

  //getting specific Book items from DB
  app.get("/book/:id", (req, res) => {
    BookCollection.find({ _id: ObjectId(req.params.id) }).toArray(
      (err, documents) => {
        console.log(documents[0]);
        res.send(documents[0]);
      }
    );
  });

  //getting ordered list from DB
  app.get("/order/:email", (req, res) => {
    BookOrder.find({ email: req.params.email }).toArray((err, doc) => {
      res.send(doc);
    });
  });

  //deleting data from the database
  //   app.delete("/deleteEvent/:id", (req, res) => {
  //     console.log(req.params.id);
  //     collection
  //       .deleteOne({ _id: ObjectId(req.params.id) })
  //       .then((result) => res.send(result.deletedCount>0))
  //       .catch((err) =>console.log(err))
  //   });

  console.log("==SERVER READY==");
});

app.listen(port);
