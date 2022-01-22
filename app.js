const express = require('express')
const routes = require('./routes/slughandler');

const app = express();

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/bootstrap-icons'));
app.use(express.static(__dirname + '/node_modules/bootstrap5-tags'));
app.use(express.json());
app.use('/', routes);

const db = require('./models');

db.sequelize.sync().then(() => {
  createServer();
  console.log("Databases loaded.");
});
const listener = app.listen(process.env.PORT || 8080, () => {
  console.log('Server is established and listening on port ' + listener.address().port)
})
async function createServer() {
  const server = await db.MinecraftServerDB.findOne();
  if (server == null || server == undefined) {
    console.log("Creating server!")
    await db.MinecraftServerDB.create({
      versions: "1.17.X, 1.16.X",
      tags: "Prison, Skyblock"
    })
  }
}
app.app = app;
