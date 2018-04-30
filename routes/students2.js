var express = require('express');
var router = express.Router();
//var flash = require('connect-flash');
//var path = require('path');
const moment = require('moment');
const sequelize = require('../sequelize.js');
const Student = require('../models/students');

function gender(studentGender){
  if(studentGender === 'M'){
    return 'Male';
  } else {
    return 'Female';
  }
}

/* GET students page. */
router.get('/', function(req, res, next) {
  console.log('username',req.user.username);
  Student.findAll({
    order: [['studentID', 'DESC']]
  })
    .then( rows => {
      //res.status( 200 ).json( rows )
      res.render("students", { title: "Students List", data: rows});
    })
    .catch( error => {
      res.status(400).send( error )
    })
});

router.get('/insert', function(req,res){
  res.render('insert', {title: 'Add Student'});
});

router.post('/insert',function(req,res){
  Student.create({
    name: req.body.name,
    address: req.body.address,
    gender: req.body.gender,
    date_of_birth: req.body.date_of_birth,
    email: req.body.email
  }).then(function(data) {
      // res.status(200);
      // res.json(data.get({plain: true}));
      res.redirect('/students');
  }).catch(function(error) {
      res.status(500);
      res.json({error:error, stackError:error.stack});
  });
});

router.get('/edit', function(req,res){
  res.render('edit', {title: 'Edit Student'});
});

router.get('/:id', function(req, res) {
  Student.findAll({  
      where: {
        studentID: req.params.id
      }
  }).then( rows => {
    res.render('edit', {
        title: 'Edit Student', 
        studentID: rows[0].studentID,
        name: rows[0].name,
        address: rows[0].address,
        gender: rows[0].gender,
        date_of_birth: moment(rows[0].date_of_birth).format('YYYY-MM-DD'),
        email:rows[0].email
      })
    }
  ).catch( error => {
    console.log(error)
  })
  // req.getConnection(function(err, con) {
  //   if (err) return next(err);
  //   con.query('SELECT * FROM students WHERE studentID = ?', [req.params.id], function(err, rows, fields) {
  //     if(err) throw err
  //     //else console.log(rows);
      
  //     // if user not found
  //     if (rows.length <= 0) {
  //         // req.flash('error', 'Student not found with id = ' + req.params.id)
  //         res.redirect('/students')
  //     }
  //     else { // if user found
  //         // render to views/index.pug template file
  //         res.render('edit', {
  //             title: 'Edit Student', 
  //             studentID: rows[0].studentID,
  //             name: rows[0].name,
  //             address: rows[0].address,
  //             gender: rows[0].gender,
  //             date_of_birth: moment(rows[0].date_of_birth).format('YYYY-MM-DD'),
  //             email:rows[0].email
  //         })
  //     }            
  //   })
  // })
});

router.post('/edit',function(req,res){
  // Student.findAll({  
  //   where: {
  //     studentID: req.params.id
  //   }
  // })
  // .then(Student => {
  //   Student.update({
  //   studentID: req.body.studentID,
  //   name: req.body.name,
  //   address: req.body.address,
  //   gender: req.body.gender,
  //   date_of_birth: req.body.date_of_birth,
  //   email: req.body.email
  //   });
  // }).then(function(data) {
  //     // res.status(200);
  //     // res.json(data.get({plain: true}));
  //     console.log("1 record updated");
  //     res.redirect('/students');
  // }).catch(function(error) {
  //     res.status(500);
  //     res.json({error:error, stackError:error.stack});
  // });
  Student.update(
    {
      name: req.body.name,
      address: req.body.address,
      gender: req.body.gender,
      date_of_birth: req.body.date_of_birth,
      email: req.body.email
    },
    { where: {studentID: req.body.studentID}}
  ).then(() => res.redirect('/students'))
});

router.post('/delete/:id', function(req,res){
  Student.destroy({
    where: {
      studentID: req.params.id
    }
  });
  res.redirect('/students');
});

router.post('/search', function(req,res){
  req.getConnection(function(err, con) {
    if (err) return next(err);
    var studentList = [];
    var keyword = req.body.keyword;
    var opt = req.body.opt;
    var order = req.body.order;
    
    var sql = "SELECT * FROM students WHERE "+opt+" LIKE '%"+keyword+"%' ORDER BY "+opt+" "+order+"";
    //var sql = "SELECT * FROM students WHERE ? LIKE '%"+keyword+"%' ORDER BY "+opt+" "+order+"";
    //var sql = "SELECT * FROM students WHERE ? LIKE CONCAT('%',?,'%') ORDER BY ? ?";
    //var values = [opt, keyword, opt, order];
   
    // Do the query to get data.
    con.query(sql, function(err, rows, fields) {
      if (err) {
        res.status(500).json({"status_code": 500,"status_message": "internal server error"});
        console.log(err);
      } else {
        console.log(sql);

        // Loop check on each row
        for (var i = 0; i < rows.length; i++) {

          // Create an object to save current row's data
          var student = {
            'studentID':rows[i].studentID,
            'name':rows[i].name,
            'address':rows[i].address,
            'gender':gender(rows[i].gender),
            'date_of_birth':moment(rows[i].date_of_birth).format('DD-MMM-YYYY'),
            'email':rows[i].email,
            'date_time':moment(rows[i].date_time).format('DD-MMM-YYYY')
          }
          // Add object into array
          studentList.push(student);
      }
      console.log(studentList);
      // Render index.pug page using array 
      res.render('students', {title: 'Students List', data: studentList});
      }
    })
  })
});

module.exports = router;
