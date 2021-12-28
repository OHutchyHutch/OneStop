module.exports = function (sequelize, DataTypes) {
    return sequelize.define('mcservers', {
        versions: DataTypes.STRING,
        tags: DataTypes.STRING
    })
}