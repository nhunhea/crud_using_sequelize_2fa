var express = require('express');
var router = express.Router();
var passport = require('passport');
const User = require('../models/model_users');

// router.post('/', passport.authenticate('local', { successRedirect: '/students', failureRedirect: '/login', failureFlash: true }), function(req, res, info){
//   res.render('login', {'message' :req.flash('message')});
// });

// router.post('/', passport.authenticate('local', { successRedirect: '/login/auth', failureRedirect: '/login', failureFlash: true }), function(req, res, info){
//   res.render('login', {'message' :req.flash('message')});
// });

router.get('/',function(req,res) {
  if (req.isAuthenticated ()){
    res.render('students');
  } else res.render('login', {'message' :req.flash('message')});
});

router.get('/signin/', function(req,res,next){
  passport.authenticate('local', function (err, user, info){
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    User.findAll({
      where: {
        username: req.query.username
      }
    }).then( function(rows) {
      console.log(rows[0].status);
      if (rows[0].status === 'disable' || rows[0].status === null) {
        req.login(user, function(err) {
          if (err) { return next(err); }
          req.flash('info', 'Login Success');
          return res.redirect('/students' );
        });
      } 
      else {
        req.flash('username',req.query.username);
        res.redirect('/twofa/');
      }
    })
  })(req, res, next);
});

// router.get('/auth', function(req,res){
//  res.render('login2')
// })
module.exports = router;
