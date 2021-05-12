const express = require("express");

const db = require("../../data/db-config.js");

const router = express.Router();

function getUsersWithPosts() {
  const rows = db("posts p")
    .join("users u", "p.user_id", "=", "u.id")
    .select("u.id user_id", "p.id post_id", "p.contents", "u.username");
  return rows;
}

router.get("/", (req, res) => {
  try {
    const rows = await getUsersWithPosts();
    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db("users")
    .where({ id })
    .then((users) => {
      const user = users[0];

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "Could not find user with given id." });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to get user" });
    });
});

router.post("/", (req, res) => {
  const userData = req.body;

  db("users")
    .insert(userData, "id")
    .then((ids) => {
      res.status(201).json({ created: ids[0] });
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to create new user" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db("users")
    .where({ id })
    .update(changes)
    .then((count) => {
      if (count) {
        res.json({ update: count });
      } else {
        res.status(404).json({ message: "Could not find user with given id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to update user" });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db("users")
    .where({ id })
    .del()
    .then((count) => {
      if (count) {
        res.json({ removed: count });
      } else {
        res.status(404).json({ message: "Could not find user with given id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to delete user" });
    });
});

module.exports = router;
