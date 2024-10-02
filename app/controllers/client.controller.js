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
    })
        .then((clients) => {
            res.status(200).send(clients);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};


exports.createClient = upload.fields([{ name: 'signature', maxCount: 1 }, { name: 'logo', maxCount: 1 }]), (req, res) => {
    const { name, email, phone, address, city, postalCode, country, vat, pec, status } = req.body;

    // Check if files are provided and handle them if necessary
    const signature = req.files['signature'] ? req.files['signature'][0].buffer.toString('base64') : null;
    const logo = req.files['logo'] ? req.files['logo'][0].buffer.toString('base64') : null;

    // Salva il cliente nel database
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
        status: status === 'true' // Convert to boolean
    })
        .then((client) => {
            res.status(201).send({ message: "Cliente creato con successo!" });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
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
