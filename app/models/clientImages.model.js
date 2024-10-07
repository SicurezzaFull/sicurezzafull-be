const db = require("../models");

module.exports = (sequelize, Sequelize) => {
    const ClientImages = sequelize.define("clientImages", {
        clientId: {
            type: Sequelize.INTEGER,
            references: db.client,
            referencesKey: "id",
        },
        etag: {
            type: Sequelize.STRING,
        },
        location: {
            type: Sequelize.STRING,
        },
        keyFile: {
            type: Sequelize.STRING,
        },
        bucket: {
            type: Sequelize.STRING,
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return ClientImages;
};
