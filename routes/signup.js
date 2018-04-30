const express = require("express");
const router = express.Router();
const async = require('async');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const validateJoi = require('../source/joi-register');
const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');
const User = require('../models/model_users');
var twoFactor = require('node-2fa');

router.get('/', function(req,res){
  res.render('signup', {title: 'Register New Account'});
});

router.post('/', function(req, res, next) {
  validateJoi.validate({username: req.body.username, user_email: req.body.user_email}, function(errors, value) {
  if (!errors) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findAll({
          //attributes: ['username'],
          where: {
            username: req.body.username
          }
        })
        .then(function(rows, err) {
          if (rows.length > 0) {
            console.log(rows)
            req.flash('error', "Username already used.");
            res.render('signup', {'error': req.flash('error')})         
          } else {
            User.findAll({
              //attributes: ['email'],
              where: {
                user_email: req.body.email
              }
            })
            .then(function(rows, err) {
              if (rows.length > 0){
                req.flash('error', "Email already used. \n Please input another email ");
                res.render('signup', {'error': req.flash('error')})
                // alert("Duplicate entry email !\nPlease input another email");
              } else {
                var newSecret = twoFactor.generateSecret({name: 'My App', account: req.body.username});
                var psw = "7fa73b47df808d36c5fe328546ddef8b9011b2c6" + req.body.password;
                
                User.create({ 
                  username: req.body.username, 
                  password: Sequelize.fn('sha1', psw),
                  user_email: req.body.user_email,
                  reg_token: token,
                  status: 'disable',
                  secret_key: newSecret.secret,
                  url: newSecret.qr
                })
                .then(function(rows, err) {
                  User.findAll({
                    where: {
                      username: req.body.username
                    }
                  })
                  .then(function(rows, err) {
                    done(err, token, rows);
                  })
                })
              }
            })
          }
        })
      },
      function(token, rows, done) {
        var mailOptions = {
          to: rows[0].user_email,
          from: 'confirm_account@demo.com',
          subject: 'Confirm Registration',
          text: 'Thankyou for registering to http://' + req.headers.host + ' .\n\n' +
          'Please click on the following link, or paste this into your browser to confirm your account:\n\n' +
          'http://' + req.headers.host + '/confirm/' + token + '\n\n' +
          'If you did not request this, please ignore this email.\n'
        };
        console.log(rows[0].email);
        sgMail.send(mailOptions, function(err) {
          console.log(mailOptions);
          req.flash('info', 'Please, check your email to confirm your password.');
          res.render('signup', {'info': req.flash('info')})
          //done(err, 'done');
        });
      }
    ], function(err) {
      res.redirect('/reset/'+req.params.id);
    });   
  } else {
    req.flash('error', errors);
    res.render('signup', {'error': req.flash('error')})
  } 
})
});

// router.post('/', function(req,res){
//   var newSecret = twoFactor.generateSecret({name: 'My Awesome App', account: req.body.username});
//   var psw = "7fa73b47df808d36c5fe328546ddef8b9011b2c6" + req.body.password + ")";
//   //var password = "sha1('7fa73b47df808d36c5fe328546ddef8b9011b2c6"+password+")";
//   User.create({
//     username: req.body.username,
//     password: Sequelize.fn('sha1', psw)
//     user_email: req.body.user_email,
//     secret_key: newSecret.secret,
//     url: newSecret.qr
//   }).then(function(data) {
//       // res.status(200);
//       // res.json(data.get({plain: true}));
//       res.redirect('/users');
//   }).catch(function(error) {
//       res.status(500);
//       res.json({error:error, stackError:error.stack});
//   });
// });



module.exports = router;