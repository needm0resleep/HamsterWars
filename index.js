// Express - Minimal server
const express = require("express");
const app = express();
const port = process.env.PORT || 1337;
const cors = require("cors");
app.use(cors());

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});

// FireBase Admin SDK configuration
const { initializeApp } = require("firebase-admin/app");

const admin = require("firebase-admin");

const serviceAccount = require("./script/json_to_firestore/backendapi-ba770-firebase-adminsdk-ou27w-b8a584b687.json");
const { firestore } = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// API Methods

const hamsters = db.collection("data");
const matches = db.collection("matches");

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
  res.send(list[Math.floor(Math.random() * list.length)]);
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
app.post("/hamsters", async (req, res) => {
  const docRef = await hamsters.add({
    games: 0,
    wins: 0,
    favFood: "Pizza",
    imgName: 0,
    age: 2,
    defeats: 1,
    name: "rebecca",
    loves: "Fighting",
  });
  res.status(200).send({ id: docRef.id });
});

// EDIT a specific hamster
app.put("/hamsters/:id", (req, res) => {
  try {
    db.collection("data").doc(req.params.id).set({
      games: 0,
      wins: 0,
      favFood: "Pizza",
      imgName: 0,
      age: 2,
      defeats: 0,
      name: "Altair",
      loves: "Fighting",
    });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("ERROR: " + err);
  }
});

// DELETE a specific hamster
app.delete("/hamsters/:id", (req, res) => {
  try {
    db.collection("data").doc(req.params.id).delete();
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("ERROR: " + err);
  }
});

// Get ALL the matches
app.get("/matches", async (req, res) => {
  try {
    const snapshot = await matches.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
  } catch (err) {
    res.status(500);
  }
});

// GET a SPECIFIC match
app.get("/matches/:id", async (req, res) => {
  try {
    const docRef = db.collection("matches").doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      res.sendStatus(404);
    } else {
      res.send(doc.data());
    }
  } catch (err) {
    res.status(500).send("ERROR: " + err);
  }
});

// Add(POST) a new match
app.post("/matches", async (req, res) => {
  const docRef = await matches.add({
    winnerId: "Z472QJsViABky4H2DfoV",
    loserId: "8f0A2yORPPvGCFH1y9RN",
  });
  res.status(200).send({ id: docRef.id });
});

// DELETE a specific match
app.delete("/matches/:id", (req, res) => {
  try {
    db.collection("matches").doc(req.params.id).delete();
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("ERROR: " + err);
  }
});

// GET matches who has a specific hamster as winner
app.get("/matchWinners/:id", async (req, res) => {
  db.collection("matches")
    .where("winnerId", "==", req.params.id)
    .get()
    .then((matchDocs) => {
      const list = matchDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (list.length === 0) {
        res.sendStatus(404);
      } else {
        res.send(list);
      }
    });
});

// GET hamsters with highest wins
app.get("/winners", async (req, res) => {
  db.collection("data")
    .where("wins", ">", 0)
    .orderBy("wins")
    .limit(5)
    .get()
    .then((matchDocs) => {
      const list = matchDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.send(list);
    });
});

// GET hamsters with highest defeats
app.get("/losers", async (req, res) => {
  db.collection("data")
    .where("defeats", ">", 0)
    .orderBy("defeats")
    .limit(5)
    .get()
    .then((matchDocs) => {
      const list = matchDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.send(list);
    });
});

// Cutest Hamster WIP
/*app.get("/hamsters/cutest", async (req, res) => {
  try {
    const snapshot = await hamsters.get();
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      thing: doc.data().age,
    }));
    res.send(list.orderBy("result").limit(5));
  } catch (err) {
    res.status(500);
  }
});*/

/*app.get("/hamsters/cutest", async (req, res) => {
  db.collection("data")
    .where("wins", ">", 0)
    .orderBy("wins")
    .limit(5)
    .get()
    .then((matchDocs) => {
      const list = matchDocs.docs.map((doc) => ({
        id: doc.id,
        result: doc.wins - doc.defeats,
        ...doc.data(),
      }));
      list.where("result", ">", 0).orderBy("result");
      const cutest = list.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.send(cutest);
    });
});*/
