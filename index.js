// Express - Minimal server

const express = require("express");

const app = express();
const port = 3001;

app.get("/", (req, res) => res.send("Hello from server"));

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});

// FireBase Admin SDK configuration

const { initializeApp } = require("firebase-admin/app");

const admin = require("firebase-admin");

const serviceAccount = require("./backendapi-ba770-firebase-adminsdk-ou27w-b8a584b687.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
