const express = require("express");
const router = express.Router();
const sequelize = require('../sequelize.js');
const User = require('../models/model_users');

//router.use(isAuthenticated);

/* GET users listing. */
router.get("/", function(req, res, next) {
  console.log(typeof User);
  User.findAll({
    order: [['userID', 'DESC']]
  })
    .then( userResponse => {
      //res.status( 200 ).json( userResponse )
      res.render("users", { title: "User List", data: userResponse });
    })
    .catch( error => {
      res.status( 400 ).send( error )
    })
});

router.get("/insert", function(req, res) {
  res.render("insert-user", { title: "Insert User" });
});

router.post("/insert", function(req, res) {
  //var password = "sha1('7fa73b47df808d36c5fe328546ddef8b9011b2c6"+password+")";
  User.create({
    username: req.body.username,
    password: req.body.password,
    user_email: req.body.user_email
  }).then(function(data) {
      // res.status(200);
      // res.json(data.get({plain: true}));
      res.redirect('/users');
  }).catch(function(error) {
      res.status(500);
      res.json({error:error, stackError:error.stack});
  });
});

router.post("/search", function(req, res) {
  req.getConnection(function(err, con) {
    if (err) return next(err);
    var userList = [];
    var keyword = req.body.keyword;
    var opt = req.body.opt;
    var order = req.body.order;

    //var sql = "SELECT * FROM users WHERE "+opt+" LIKE '%"+keyword+"%' ORDER BY userID "+order+"";
    var sql = "SELECT * FROM students WHERE ?? LIKE CONCAT('%',?,'%') ORDER BY ?? ??";
    var values = [opt, keyword, opt, order];

    // Do the query to get data.
    con.query(sql, function(err, rows, fields) {
      if (err) {
        res.status(500).json({ status_code: 500, status_message: "internal server error" });
      } else {
        //console.log(rows);

        // Loop check on each row
        for (var i = 0; i < rows.length; i++) {
          // Create an object to save current row's data
          var user = {
            userID: rows[i].userID,
            username: rows[i].username,
            password: rows[i].password,
            user_email: rows[i].user_email
          };
          // Add object into array
          userList.push(user);
        }

        // Render index.pug page using array
        res.render("users", { title: "User List", data: userList });
      }
    });
  });
});

router.get("/edit", function(req, res) {
  res.render("edit-user", { title: "Edit Users" });
});

router.get("/:id", function(req, res) {
  req.getConnection(function(err, con) {
    if (err) return next(err);
    con.query("SELECT * FROM users WHERE userID = ?", [req.params.id], function(err, rows, fields) {
      if (err) throw err;
      else console.log(rows);

      // if user not found
      if (rows.length <= 0) {
        // req.flash('error', 'Student not found with id = ' + req.params.id)
        res.redirect("/users");
      } else {
        // if user found
        // render to views/index.pug template file
        res.render("edit-user", {
          title: "Edit User",
          userID: rows[0].userID,
          username: rows[0].username,
          password: rows[0].password,
          user_email: rows[0].user_email,
          status: rows[0].status,
          secret_key: rows[0].secret_key,
          url: rows[0].url
        });
      }
    });
  });
});

router.post("/edit/:id", function(req, res, rows) {
  //var studentID = req.params.id;
  // req.getConnection(function(err, con) {
  //   if (err) return next(err);
  //   var userID = req.body.userID;
  //   var username = req.body.username;
  //   var user_email = req.body.user_email;
  //   var status = req.body.status;

  //   var sql = "UPDATE users SET user_email=? status=? WHERE userID=?";
  //   var values = [user_email, status, userID];
  //   console.log(userID);
  //   con.query(sql, values, function(err, result) {
  //     if (err) throw err;
  //     console.log("1 record updated");
  //     console.log(user_email);
  //     console.log(userID);
  //     res.redirect("/users");
  //   });
  // });
  User.update(
    {
      //userID: req.body.userID,
      username: req.body.username,
      user_email: req.body.email,
      status: req.body.status,
    },
    { where: {userID: req.body.userID}}
  ).then( rows => res.redirect('/users'))
  //console.log(User.update());
});





module.exports = router;
