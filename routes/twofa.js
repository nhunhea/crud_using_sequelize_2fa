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
  res.render('login2', {username: req.flash('username').toString()});
})

router.post('/', function(req,res){
  console.log(req.body.username)
  User.findAll({
    where: {
      username: [req.body.username]
    }
  }).then(function(rows) {
    var verifyToken = twoFactor.verifyToken(rows[0].secret_key, req.body.token);
    console.log(req.body.token)
    var newToken = twoFactor.generateToken(rows[0].secret_key)
    console.log(newToken)
    if (verifyToken !== null) {
      User.findOne({
        where: {
          username: [req.body.username]
        },
        attributes: ['userID', 'username', 'password']
      }).then(user => 
        req.login(user, function (err) {
          if (err) {
            req.flash('error', err.message);
            console.log('user',user)
            return res.redirect('back');
          }
          console.log('Logged user in using Passport req.login()');
          console.log('username',req.user.username);
          req.flash('info', 'Hi '+req.user.username+', you successfully logged in')
          res.redirect('/students')
        })
      ) 
    }
  }).catch(error => {
    req.flash('failed','Sorry, wrong token. Please, Try Again.')
    res.render('login2',{'error': req.flash('failed'),token: req.body.token, username: req.body.username})
  })
})

module.exports = router;