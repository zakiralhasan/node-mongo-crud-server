const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectID } = require("bson");
const prot = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

//user: userdb1; password: CwuDZTNED3ECyUfG

//mongodb's given function. only have to change name and pass
const uri =
  "mongodb+srv://userdb1:CwuDZTNED3ECyUfG@cluster0.krkb3gw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//this function is working to send data on mongodb server
async function run() {
  try {
    const userCollection = client.db("nodeCrud").collection("users");

    //get data from mongodb server (Read).
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    // const user = { name: "test", email: "test@mail.com" };
    // const result = await userCollection.insertOne(user);
    // console.log(result);

    // setting data to mongodb through POST methode (Create).
    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(user);
      console.log(result);
    });

    //this function is working to delet data on mongodb server (Delete).
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const result = await userCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    //this function is working to find data on mongodb server.
    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const result = await userCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    //this function is working to update data on mongodb server (Update).
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const filtered = { _id: ObjectID(id) };
      const option = { upsert: true };
      const user = req.body;
      const updatedUser = {
        $set: { name: user.name, email: user.email },
      };
      const result = await userCollection.updateOne(
        filtered,
        updatedUser,
        option
      );
      res.send(result);
    });
  } finally {
  }
}

//called run function
run().catch((error) => console.log(error));

app.listen(prot, () => {
  console.log("server is running on port:", prot);
});
