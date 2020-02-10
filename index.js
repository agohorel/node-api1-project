const express = require("express");
const cors = require("cors");
const db = require("./data/db");
const port = 8000;

const server = express();
server.use(express.json());
server.use(cors());

server.listen(port, () => console.log(`server listening on port ${port}`));

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////GET ROUTES//////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// @route  - GET /api/users
// @desc   - returns all users
// @access - public
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

// @route  - GET /api/users/:id
// @desc   - returns a specified user
// @access - public
server.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.findById(id);

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

///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////POST ROUTES////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// @route  - POST /api/users
// @desc   - add a new user
// @access - public
server.post("/api/users", async (req, res) => {
  const { body } = req;

  if (!body.name || !body.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user" });
  }
  try {
    const newEntryID = await db.insert(body);
    const newEntry = await db.findById(newEntryID.id);
    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database."
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////DELETE ROUTES//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// @route  - DELETE /api/users/:id
// @desc   - delete a specified user
// @access - public
server.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db.remove(id);
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

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////PUT ROUTES//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// @route  - PUT /api/users/:id
// @desc   - update a specified user
// @access - public
server.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    if (!body.name || !body.bio) {
      res.status(400).json({
        errorMessage: "Please provide both the name and bio for the user."
      });
    }

    const updated = await db.update(id, body);

    if (updated) {
      const updatedUser = await db.findById(id);
      res.status(200).json(updatedUser);
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ errorMessage: "The user information could not be modified." });
  }
});
