const express = require('express')
const {Sequelize, DataTypes} = require('sequelize')
const routes = require('./routes/slug');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const app = express();


require('dotenv').config()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/bootstrap-icons'));
//app.use(express.static(__dirname + '/node_modules/particles-js'));
app.use(express.json());
app.use('/', routes);
app.use(cookieParser());

const thirtyDays = 1000 * 60 * 60 * 24 * 30;
app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: thirtyDays },
  resave: false
}));



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

const auth = require('./authenticatedb')(sequelize, app)
var UserDB = require('./models/users')(sequelize, DataTypes);




app.sessions = sessions;
app.cookieParser = cookieParser;
app.UserDB = UserDB;
app.app = app;
