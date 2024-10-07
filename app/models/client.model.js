module.exports = (sequelize, Sequelize) => {
    const Client = sequelize.define("clients", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        phone: {
            type: Sequelize.STRING,
        },
        address: {
            type: Sequelize.STRING,
        },
        city: {
            type: Sequelize.STRING,
        },
        postalCode: {
            type: Sequelize.STRING,
        },
        country: {
            type: Sequelize.STRING,
        },
        vat: {  // Partita IVA
            type: Sequelize.STRING,
        },
        pec: {  // Posta Elettronica Certificata
            type: Sequelize.STRING,
        },
        signature: {  // Firma
            type: DataTypes.BLOB, // Use BLOB for files
        },
        logo: {  // Logo aziendale
            type: DataTypes.BLOB, // Use BLOB for files
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return Client;
};
