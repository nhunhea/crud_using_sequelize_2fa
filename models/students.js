const Sequelize = require ('sequelize');
const sequelize = require ('../sequelize.js');

const Student = sequelize.define('students', {
  studentID: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    notEmpty: true
  },
  address: {
    type: Sequelize.STRING,
    notEmpty: true
  },
  gender: {
    type: Sequelize.ENUM('F', 'M'),
    notEmpty: true
  },
  date_of_birth: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  date_time: {
    type: Sequelize.DATE
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  }
});

module.exports = Student;
