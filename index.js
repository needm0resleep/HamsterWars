// Express - Minimal server
const express = require("express");
const app = express();
const port = 3001;

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});

// FireBase Admin SDK configuration
const { initializeApp } = require("firebase-admin/app");

const admin = require("firebase-admin");

const serviceAccount = require("./script/json_to_firestore/backendapi-ba770-firebase-adminsdk-ou27w-b8a584b687.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// API Methods

const hamsters = db.collection("data");

app.get("/", (req, res) => {
  res.send("hi");
});

// Get ALL Hamsters
app.get("/hamsters", async (req, res) => {
  try {
    const snapshot = await hamsters.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
  } catch (err) {
    res.status(500);
  }
});

// GET a RANDOM Hamster
app.get("/hamsters/random", async (req, res) => {
  const snapshot = await hamsters.get();
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list[Math.floor(Math.random() * 41)]);
});

// GET a SPECIFIC Hamster
app.get("/hamsters/:id", async (req, res) => {
  try {
    const docRef = db.collection("data").doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      res.status(404).send("ERROR: Hamster does not exist :'(");
    } else {
      res.send(doc.data());
    }
  } catch (err) {
    res.status(500).send("ERROR: " + err);
  }
});

// Add(POST) a new hamster
app.post("/hamsters", (req, res) => {
  try {
    const res = hamsters.add({
      games: 0,
      wins: 0,
      favFood: "Pizza",
      imgName: 0,
      age: 2,
      defeats: 0,
      name: "Alex",
      loves: "Fighting",
    });
    res.send("New hamster added");
  } catch (err) {
    res.status(500).send("ERROR: " + err);
  }
});

// DELETE a specific hamster
app.delete("/hamsters/:id", (req, res) => {
  try {
    db.collection("data").doc(req.params.id).delete();
    res.send("Hamster is removed");
  } catch (err) {
    res.status(500).send("ERROR: " + err);
  }
});