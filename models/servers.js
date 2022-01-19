module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Server', {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
        },
        owner: {
            type: DataTypes.INTEGER,
            allownull: false,
        },
        version: {
            type: DataTypes.STRING,
            allownull: false,
        },
        servername: {
            type: DataTypes.STRING,
            allownull: false,
        },
        ip: {
            type: DataTypes.STRING,
            allownull: false,
        },
        port: DataTypes.STRING,
        website: DataTypes.STRING,
        discord: DataTypes.STRING,
        tags: DataTypes.STRING,
        banner: DataTypes.STRING,
        description: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        playercount: DataTypes.STRING,
        votes: DataTypes.INTEGER,
        isPremium: {
            type: DataTypes.BOOLEAN,
            default: 0
        },
        sponsoredSlot: DataTypes.BOOLEAN,
        timeAdded: {
            type: DataTypes.STRING,
            allownull: false,
        },
        lastBump: {
            type: DataTypes.STRING,
            allownull: false,
        }
    })
}