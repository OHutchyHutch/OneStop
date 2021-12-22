module.exports = async function authenticatedb(sequelize, app){
    try {
        await sequelize.authenticate();
        console.log('Connection to database has been established successfully.');
        await sequelize.sync({ force: true }); //Remove {force: true} when production
        console.log("All of the models have been loaded and synchronized correctly.");
        console.log("\n\nServer passed all checks. Starting now...")
        const listener = app.listen(process.env.PORT || 8080, () => {
            console.log('Server is established and listening on port ' + listener.address().port)
          })
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }

}