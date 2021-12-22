const express = require('express')
const {Sequelize} = require('sequelize')
const app = express()
require('dotenv').config()


const sequelize = new Sequelize(process.env.DATABASE_URL)
//require('./models/users')(sequelize)

require('./handlers/slug')(app, express)

console.log("Listening on port: " + process.env.PORT + " || 8080")
app.listen(process.env.PORT || 8080)

authenticatedb();
async function authenticatedb(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}