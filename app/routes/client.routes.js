const { authJwt } = require("../middleware");

const controller = require("../controllers/client.controller");
const multer = require('multer');
const path = require('path');
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');

        // Ensure the uploads directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
        }

        cb(null, uploadDir); // Use the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    },
});

const upload = multer({ storage });


module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Ottieni tutti i client
    app.get(
        "/api/client/allClients",
        [authJwt.verifyToken],
        controller.allClients
    );

    // Ottieni un singolo client per ID
    app.get(
        "/api/client/getClient/:id",
        [authJwt.verifyToken],
        controller.getClient
    );

    // Crea un nuovo client
    app.post(
        "/api/client/createClient",
        [authJwt.verifyToken, upload.fields([{ name: 'logo' }, { name: 'signature' }])], // Add upload middleware here
        controller.createClient
    );

    // Aggiorna un client esistente
    app.patch(
        "/api/client/patchClient/:id",
        [authJwt.verifyToken],
        controller.patchClient
    );

    // Elimina un client esistente
    app.delete(
        "/api/client/deleteClient/:id",
        [authJwt.verifyToken],
        controller.deleteClient
    );
};
