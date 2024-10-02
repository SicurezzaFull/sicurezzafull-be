const { authJwt } = require("../middleware");

const controller = require("../controllers/client.controller");
const multer = require('multer');

const storage = multer.memoryStorage(); // or diskStorage() if you want to save files to disk
const upload = multer({ storage: storage })

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
    app.post("/api/client/createClient", [authJwt.verifyToken, upload.fields([{ name: 'signature', maxCount: 1 }, { name: 'logo', maxCount: 1 }])], exports.createClient);


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
