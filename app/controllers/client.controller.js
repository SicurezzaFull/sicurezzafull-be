const db = require("../models");
const Client = db.client;
const ClientImages = db.clientImage;
const Op = db.Sequelize.Op;
const multer = require('multer');
const AWS = require("aws-sdk");

const spacesEndpoint = new AWS.Endpoint("fra1.digitaloceanspaces.com");
const s3Client = new AWS.S3({
    endpoint: spacesEndpoint,
    region: "fra1",
    credentials: {
        accessKeyId: "DO00F2T7TPAG6EEP4PMX",
        secretAccessKey: "/Rq4PT7V0ad7RSYRFTOxxSOymwfacOyHrHJY2mj+s9w",
    },
});
const storage = multer.memoryStorage(); // or diskStorage() if you want to save files to disk
const upload = multer({ storage: storage });



// Function to retrieve all clients
exports.allClients = (req, res) => {
    Client.findAll({
        include: [
            {
                model: db.clientImage,
                as: "clientImages",
            },
        ],
    })
        .then(clients => {
            res.status(200).json(clients);
        })
        .catch(err => {
            console.error("Error fetching clients:", err);
            res.status(500).send({ message: "Error retrieving clients." });
        });
};
exports.createClient = async (req, res) => {
    try {
        // If using multer for file uploads, ensure to have it set up to use memory storage
        const logoFile = req.files['logo'] ? req.files['logo'][0] : null;
        const signatureFile = req.files['signature'] ? req.files['signature'][0] : null;

        // Create client data without logo and signature
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
            cfepi: req.body.cfepi,
            rea: req.body.rea,
            posinps: req.body.posinps,
            patinail: req.body.patinail,
            cassaedile: req.body.cassaedile,
            status: req.body.status,
        };

        // Save the client data to the database
        const newClient = await Client.create(clientData); // Use your ORM to save the client

        let logoImage = null;
        let signatureImage = null;

        // Upload logo if it exists
        if (logoFile) {
            const logoUploadParams = {
                Bucket: 'sicurezzafull', // Replace with your bucket name
                Key: `clients/${newClient.id}/logos/${logoFile.originalname}`, // Set the desired path for the logo
                Body: logoFile.buffer,
            };

            const logoUploadResult = await s3Client.upload(logoUploadParams).promise();
            logoImage = {
                etag: logoUploadResult.ETag,
                type: "logo",
                location: logoUploadResult.Location,
                keyFile: logoUploadResult.Key,
                bucket: logoUploadResult.Bucket,
                clientId: newClient.id, // Associate with the client
            };
        }

        // Upload signature if it exists
        if (signatureFile) {
            const signatureUploadParams = {
                Bucket: 'sicurezzafull', // Replace with your bucket name
                Key: `clients/${newClient.id}/signatures/${signatureFile.originalname}`, // Set the desired path for the signature
                Body: signatureFile.buffer,
            };

            const signatureUploadResult = await s3Client.upload(signatureUploadParams).promise();
            signatureImage = {
                etag: signatureUploadResult.ETag,
                type: "signature",
                location: signatureUploadResult.Location,
                keyFile: signatureUploadResult.Key,
                bucket: signatureUploadResult.Bucket,
                clientId: newClient.id, // Associate with the client
            };
        }

        // Save logo and signature metadata to ClientImages table
        if (logoImage) {
            console.log("logoImage", logoImage)
            await ClientImages.create(logoImage); // Use your ORM to save the image metadata
        }

        if (signatureImage) {
            console.log("signatureImage", signatureImage)
            await ClientImages.create(signatureImage); // Use your ORM to save the image metadata
        }

        res.status(201).json({ message: 'Client created successfully', client: newClient });
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ message: 'Error creating client', error: error.message });
    }
};

exports.deleteClient = (req, res) => {
    // Elimina prima le immagini associate
    ClientImages.destroy({
        where: { clientId: req.params.id },
    })
        .then(() => {
            // Poi elimina il cliente
            Client.destroy({
                where: { id: req.params.id },
            })
                .then(() => {
                    res.status(200).send({ message: "Cliente e immagini eliminati con successo!" });
                })
                .catch((err) => {
                    res.status(500).send({ message: err.message });
                });
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
            cfepi: req.body.cfepi,
            rea: req.body.rea,
            posinps: req.body.posinps,
            patinail: req.body.patinail,
            cassaedile: req.body.cassaedile,
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
