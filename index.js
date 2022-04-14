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

// HTTP OPERATIONS
const hamsters = db.collection("data");

app.get("/", (req, res) => {
  res.send("hi");
});

app.get("/hamsters", async (req, res) => {
  // Get ALL documents
  const snapshot = await hamsters.get();
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list);
});

app.get("/hamsters/random", async (req, res) => {
  // Get a RANDOM Hamster
  const snapshot = await hamsters.get();
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list[Math.floor(Math.random() * 41)]);
});
