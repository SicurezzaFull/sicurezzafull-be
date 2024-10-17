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
        cfepi: { 
            type: Sequelize.STRING,
        },

        rea: {  
            type: Sequelize.STRING,
        },
        posinps: {  
            type: Sequelize.STRING,
        },
        patinail: {  
            type: Sequelize.STRING,
        },
        cassaedile: {  
            type: Sequelize.STRING,
        },
        signature: {  // Firma
            type: Sequelize.JSONB, // Use BLOB for files
        },
        logo: {  // Logo aziendale
            type: Sequelize.JSONB, // Use JSONB for files
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
