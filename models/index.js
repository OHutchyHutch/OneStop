const Sequelize = require('sequelize');
require('dotenv').config()
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
          require: true,
          rejectUnauthorized: false //This could expose MITM attacks. Please look into fixing it
      }
    }
  });
  const db = {};
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  db.UserDB = require('./users')(sequelize, Sequelize);
  module.exports = db;