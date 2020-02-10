const express = require("express");
const db = require("./data/db");
const port = 8000;

const server = express();
server.use(express.json());

server.get("/", (req, res) => {
  res.send("hello world");
});

server.post("/api/users", async (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user" });
  }
  try {
    const newEntryID = await db.insert(req.body);
    const newEntry = await db.findById(newEntryID.id);
    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database."
    });
  }
});

server.get("/api/users", async (req, res) => {
  try {
    const user = await db.find();
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ errorMessage: "The user information could not be retrieved." });
  }
});

server.get("/api/users/:id", async (req, res) => {
  try {
    const user = await db.findById(req.params.id);

    if (user) {
      res.status(200).json(user);
    } else
      res.status(404).json({
        errorMessage: "The user with the specified ID does not exist"
      });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ errorMessage: "The user information could not be retrieved." });
  }
});

server.delete("/api/users/:id", async (req, res) => {
  try {
    const deleted = await db.remove(req.params.id);
    if (deleted) {
      res.status(200).send("deleted user successfully");
    } else {
      res
        .status(404)
        .json({ message: "the user with the specified ID does not exist." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "The user could not be removed." });
  }
});

server.listen(port, () => console.log(`server listening on port ${port}`));
