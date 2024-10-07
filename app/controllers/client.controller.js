const db = require("../models");
const Client = db.client;
const Op = db.Sequelize.Op;
const multer = require('multer');

const storage = multer.memoryStorage(); // or diskStorage() if you want to save files to disk
const upload = multer({ storage: storage });

exports.allClients = (req, res) => {
    Client.findAll({
        order: [
            ["updatedAt", "DESC"],
            ["id", "ASC"],
        ],
        // Optionally include any required fields, like logo and signature
        attributes: {
            include: [
                // Include the logo and signature fields as binary data
                'logo',
                'signature'
            ]
        }
    })
        .then((clients) => {
            // Transform clients to include base64 images if necessary
            const transformedClients = clients.map(client => {
                // Convert logo and signature to Base64 if they are binary fields
                return {
                    ...client.dataValues,
                    logo: client.logo ? client.logo.toString('base64') : null,
                    signature: client.signature ? client.signature.toString('base64') : null,
                };
            });

            res.status(200).send(transformedClients);
        })
        .catch((err) => {
            console.error('Error retrieving clients:', err.message); // Log the error for debugging
            res.status(500).send({ message: 'Could not retrieve clients. Please try again later.' });
        });
};




// Function to create a client
exports.createClient = async (req, res) => {
    try {
        const clientData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            postalCode: req.body.postalCode,
            country: req.body.country,
            vat: req.body.vat,
            pec: req.body.pec,
            status: req.body.status,
            logo: req.files['logo'] ? req.files['logo'][0].path : null,
            signature: req.files['signature'] ? req.files['signature'][0].path : null,
        };

        // Save the client data to the database
        const newClient = await Client.create(clientData); // Use your ORM to save the client

        res.status(201).json({ message: 'Client created successfully', client: newClient });
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ message: 'Error creating client', error: error.message });
    }
};
exports.deleteClient = (req, res) => {
    // Elimina il cliente
    Client.destroy({
        where: { id: req.params.id },
    })
        .then((client) => {
            res.status(200).send({ message: "Cliente eliminato con successo!" });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

exports.getClient = (req, res) => {
    // Ottieni un cliente per ID
    Client.findOne({
        where: { id: req.params.id },
    })
        .then((client) => {
            if (client) {
                res.status(200).send(client);
            } else {
                res.status(404).send({ message: "Cliente non trovato" });
            }
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

exports.patchClient = (req, res) => {
    // Aggiorna il cliente
    Client.update(
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            postalCode: req.body.postalCode,
            country: req.body.country,
            vat: req.body.vat,
            pec: req.body.pec,
            signature: req.body.signature,
            logo: req.body.logo,
            status: req.body.status,
        },
        { where: { id: req.params.id } }
    )
        .then(() => {
            res.status(200).send({ message: "Cliente aggiornato con successo!" });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};
