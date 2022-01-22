module.exports = function (sequelize, DataTypes) {
    return sequelize.define('MCServers', {
        versions: DataTypes.STRING,
        tags: DataTypes.STRING
    })
}