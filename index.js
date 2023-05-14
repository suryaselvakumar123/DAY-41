const dotenv = require('dotenv');
const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');

dotenv.config({ path: 'key.env' });

const mongoClient = mongodb.MongoClient;
const app = express();
const port = 9000;
const dbURL = process.env.dbURL;

app.use(express.json());
app.use(cors());

// Create a mentor
app.post("/mentors", async (req, res) => {
  try {
    const client = await mongoClient.connect(dbURL);
    const db = client.db("mentor_assign_db");
    const result = await db.collection("mentors").insertOne(req.body);
    res.status(200).json({ message: "Mentor created" });
    client.close();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Create a student
app.post("/students", async (req, res) => {
  try {
    const client = await mongoClient.connect(dbURL);
    const db = client.db("mentor_assign_db");
    const result = await db.collection("students").insertOne(req.body);
    res.status(200).json({ message: "Student created" });
    client.close();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Assign a mentor to a student
app.put("/students/:studentId/mentor", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { mentorId } = req.body;

    const client = await mongoClient.connect(dbURL);
    const db = client.db("mentor_assign_db");

    const result = await db.collection("students").updateOne(
      { _id: mongodb.ObjectID(studentId) },
      { $set: { mentorId } }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Mentor assigned to the student" });
    } else {
      res.status(404).json({ message: "Student not found" });
    }

    client.close();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all students
app.get("/students", async (req, res) => {
  try {
    const client = await mongoClient.connect(dbURL);
    const db = client.db("mentor_assign_db");
    const result = await db.collection("students").find().toArray();
    res.status(200).json(result);
    client.close();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all mentors
app.get("/mentors", async (req, res) => {
  try {
    const client = await mongoClient.connect(dbURL);
    const db = client.db("mentor_assign_db");
    const result = await db.collection("mentors").find().toArray();
    res.status(200).json(result);
    client.close();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log("Server started at port " + port);
});
