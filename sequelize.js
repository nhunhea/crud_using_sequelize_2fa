// Let's require our module
var Sequelize = require('sequelize');
// Let's create a new sequelize instance
// And connect tou our database
var sequelize = new Sequelize('mydb', 'root', 'Wonderlabs_1', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {
    timestamps: false,
    freezeTableName: true
  }
});

module.exports = sequelize;