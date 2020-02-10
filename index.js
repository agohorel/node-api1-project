const express = require("express");
const db = require("./data/db");
const port = 8000;

const server = express();
server.use(express.json());

server.get("/", (req, res) => {
  res.send("hello world");
});

// POST api/users
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

server.listen(port, () => console.log(`server listening on port ${port}`));
