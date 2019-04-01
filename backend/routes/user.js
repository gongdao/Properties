const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require("../middleware/check-auth");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: 'User created!',
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
       // console.log(user);
       // console.log('router user.js');
      if (!user) {
        return res.status(401).json({
          message: "Auth failed!"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, fetchedUser.password);
    })
    .then(result => {
       // console.log('user.log' + result);
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},
        'secret_this_should_be_longer',
        { expiresIn: "1h"}
      );
       // console.log("token = " + token);
       // console.log("router user.js");
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        userRole: fetchedUser.role,
        password: fetchedUser.password,
        email: fetchedUser.email
      });
    })
    .catch(err => {
     // console.log(err);
      return res.status(401).json({
        message: "Auth failed"
    });
  });
});

router.put(
  "/:id",
  checkAuth,
  (req, res, next) => {
      const user = new User({
      _id: req.body.id,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
  });
  console.log(user);
  User.updateOne({ _id: req.params.id}, user).then(result => {
    console.log(result);
    res.status(200).json({message: 'Update successfully!'});
  });
});

router.get("/:id", (req, res, next) =>  {
  User.findById({id: req.params.id}).then(user => {
    console.log('router.get id');
    if(user) {
      console.log(user);
      res.status(200).json(user);
    } else {
      res.status(404).json({message: 'User not found!'});
    }
  });
});

router.get("", (req, res, next) => {
  // console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userQuery = User.find({'email': {$ne: 'zhanzhao@c.c'}});
  let fetchedUsers;
  if (pageSize && currentPage){
    userQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  userQuery
    .then(documents => {
      fetchedUsers = documents;
      return User.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Users fetched successfully!",
        users: fetchedUsers,
        maxUsers: count
      });
    });
});
router.delete("/:id", (req, res, next) => {
  User.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({ message: 'User deleted!'});
  });
});
module.exports = router;
