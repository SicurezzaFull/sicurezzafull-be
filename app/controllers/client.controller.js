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
                'logo_data',
                'signature_data'
            ]
        }
    })
        .then((clients) => {
            // Transform clients to include base64 images if necessary
            const transformedClients = clients.map(client => {
                // Convert logo and signature to Base64 if they are binary fields
                return {
                    ...client.dataValues,
                    logo_data: client.logo_data ? client.logo_data.toString('base64') : null,
                    signature_data: client.signature_data ? client.signature_data.toString('base64') : null,
                };
            });

            res.status(200).send(transformedClients);
        })
        .catch((err) => {
            console.error('Error retrieving clients:', err.message); // Log the error for debugging
            res.status(500).send({ message: 'Could not retrieve clients. Please try again later.' });
        });
};



exports.createClient = [
    upload.fields([{ name: 'signature', maxCount: 1 }, { name: 'logo', maxCount: 1 }]),
    (req, res) => {
        const { name, email, phone, address, city, postalCode, country, vat, pec, status } = req.body;

        console.log(req.body);

        const signature = req.files['signature'] ? req.files['signature'][0].buffer.toString('base64') : null;
        const logo = req.files['logo'] ? req.files['logo'][0].buffer.toString('base64') : null;

        Client.create({
            name,
            email,
            phone,
            address,
            city,
            postalCode,
            country,
            vat,
            pec,
            signature,
            logo,
            status: status === 'true'
        })
            .then(() => {
                res.status(201).send({ message: "Cliente creato con successo!" });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send({ message: "Errore durante la creazione del cliente." });
            });
    }
];

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
