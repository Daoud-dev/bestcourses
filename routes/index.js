//jshint esversion:8
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require("../models/User");
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.sendfile('index.html'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

router.get("/edit", (req, res) => res.render("edit", { user: req.user }));
router.get("/setting", (req, res) => res.render("setting", { user: req.user }));

router.post("/edit", (req, res) => {
  const { name, email } = req.body;
  const id = { _id: req.body.id };
  const updateItem = { $set: { name: name, email: email } };
  User.updateOne(id, updateItem, (err) => {
    if (err) {
      console.log(err);

    } else {
      res.redirect("/setting");
      console.log("Settings updated");
    }
  });
});

router.post("/delete", (req, res) => {
  const deleteItem = req.body.id;
  User.findByIdAndDelete(deleteItem, (err) => {
    if (!err) {
      console.log("Successfully deleted");
      console.log(deleteItem);

      res.redirect("/users/login");
    } else {
      console.log(err);
    }
  });
});
module.exports = router;
