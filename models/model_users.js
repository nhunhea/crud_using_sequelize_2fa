const Sequelize = require ('sequelize');
const sequelize = require ('../sequelize.js');

const User = sequelize.define('users', {
  userID: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  username: {
    type: Sequelize.STRING,
    notEmpty: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  user_email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  token: {
    type: Sequelize.STRING
  },
  expired: {
    type: Sequelize.DATE
  },
  status: {
    type: Sequelize.ENUM('enable', 'disable')
  },
  secret_key: Sequelize.STRING,
  url: Sequelize.TEXT,
  reg_token: Sequelize.STRING
});
// User.findAll().then(rows => {
//   console.log(rows)
// })

module.exports = User;
