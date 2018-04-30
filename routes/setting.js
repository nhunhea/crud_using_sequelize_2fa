var express = require('express');
var router = express.Router();
const sequelize = require('../sequelize.js');
const User = require('../models/model_users');
var twoFactor = require('node-2fa');


router.get('/', function(req,res){
  //var newSecret = twoFactor.generateSecret({name: 'My Awesome App', account: req.user.username});
  User.findAll({
    where: {
      username: [req.user.username]
    }
  }).then(function(rows) {
    console.log(rows);
    res.render('setting', {title: 'Two-Factor Authentication Setup', status: rows[0].status, secret_key: rows[0].secret_key, url: rows[0].url})
  })
})


router.post('/', function(req,res){
  User.findAll({
    where: {
      username: [req.user.username]
    }
  }).then(function(rows) {
    console.log(rows);
    var verifyToken = twoFactor.verifyToken(req.body.secret_key, req.body.token);
    console.log(req.body.token)
    if (verifyToken !== null) {
      User.update({
        status: 'enable',
      }, { where: {
        username: req.user.username
      }}
      ).then(function(update) {
        console.log(update);
        res.redirect('/setting');
      })
    }
   // console.log(twoFactor.verifyToken(rows[0].secret_key, req.body.token));
  })
})

router.post('/set/enable', function(req,res){
  User.findAll({
    where: {
      username: req.user.username
    }
  })
  .then(function (rows) {
    console.log(rows[0].secret_key);
    //if (rows[0].status === 'disable'|| rows[0].status === null) {
    if (req.body.status === 'enable'){
      var newSecret = twoFactor.generateSecret({name: 'Mydb', account: req.user.username});
      var atr = {
        secret_key: newSecret.secret,
        url: newSecret.qr
      }
      User.update(
        atr,
        {
        where: {
          username: req.user.username
        }
      })
      .then(update => {
        req.flash('enable', newSecret);
        res.render('setting', {title: 'Two-Factor Authentication Setup', nameTag: rows[0].username, status: 'enable', url: newSecret.qr, secret_key: newSecret.secret,'enable': req.flash('enable')});
      })
    } else if (req.body.status === 'disable'){
      var atr = {
        secret_key: null,
        url: null,
        status: 'disable'
      }
      User.update(
        atr,
        {
        where: {
          username: req.user.username
        }
      })
      .then(update => {
        res.render('setting', {title: 'Two-Factor Authentication Setup', nameTag: rows[0].username, status: rows[0].status, 'disable': req.flash('disable')});
        //res.redirect('/setting');
      })
    }
  })
});
module.exports = router;