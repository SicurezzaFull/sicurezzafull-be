const db = require("../models");
const Client = db.client;
const Op = db.Sequelize.Op;
const multer = require('multer');


const spacesEndpoint = new AWS.Endpoint("fra1.digitaloceanspaces.com");
const s3Client = new AWS.S3({
    endpoint: spacesEndpoint,
    region: "fra1",
    credentials: {
        accessKeyId: "DO003RNZ7LBYBUFYZN3Z",
        secretAccessKey: "G9lWYNPj24SgTQjxvAf51TkAItFdUuRrVdtYDHT4vm0",
    },
});
const storage = multer.memoryStorage(); // or diskStorage() if you want to save files to disk
const upload = multer({ storage: storage });



// Function to retrieve all clients
exports.allClients = (req, res) => {
    Client.findAll()
        .then(clients => {
            const clientData = clients.map(client => {
                return {
                    ...client.dataValues,
                    logo: client.logo ? client.logo.toString('base64') : null, // Convert logo buffer to base64
                    signature: client.signature ? client.signature.toString('base64') : null, // Convert signature buffer to base64
                };
            });
            res.status(200).json(clientData);
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

        // Upload logo and signature to Digital Ocean Spaces and get their metadata
        const logoUploadParams = logoFile ? {
            Bucket: 'sicurezzafull', // Replace with your bucket name
            Key: `clients/logos/${logoFile.originalname}`, // Set the desired path for the logo
            Body: logoFile.buffer,
        } : null;

        const signatureUploadParams = signatureFile ? {
            Bucket: 'sicurezzafull', // Replace with your bucket name
            Key: `clients/signatures/${signatureFile.originalname}`, // Set the desired path for the signature
            Body: signatureFile.buffer,
        } : null;

        const logoUploadResult = logoUploadParams ? await s3Client.upload(logoUploadParams).promise() : null;
        const signatureUploadResult = signatureUploadParams ? await s3Client.upload(signatureUploadParams).promise() : null;

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
            logo: logoUploadResult ? {
                etag: logoUploadResult.ETag,
                location: logoUploadResult.Location,
                keyFile: logoUploadResult.Key,
                bucket: logoUploadResult.Bucket,
            } : null, // Store logo metadata
            signature: signatureUploadResult ? {
                etag: signatureUploadResult.ETag,
                location: signatureUploadResult.Location,
                keyFile: signatureUploadResult.Key,
                bucket: signatureUploadResult.Bucket,
            } : null, // Store signature metadata
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
