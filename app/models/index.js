const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

// Create a new Sequelize instance
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

// Initialize db object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.company = require("../models/company.model.js")(sequelize, Sequelize);
db.client = require("../models/client.model.js")(sequelize, Sequelize);
db.place = require("../models/place.model.js")(sequelize, Sequelize);
db.vehicle = require("../models/vehicle.model.js")(sequelize, Sequelize);
db.attendance = require("../models/attendance.model.js")(sequelize, Sequelize);
db.deadlines = require("../models/deadlines.model.js")(sequelize, Sequelize);
db.entity = require("../models/entity.model.js")(sequelize, Sequelize);
db.permission = require("../models/permission.model.js")(sequelize, Sequelize);
db.clientImage = require("../models/clientImages.model.js")(sequelize, Sequelize);
db.attendanceImage = require("../models/attendanceImages.model.js")(sequelize, Sequelize);
db.userDocument = require("../models/userDocuments.model.js")(sequelize, Sequelize);
db.userCompanies = require("../models/userCompanies.model.js")(sequelize, Sequelize);
db.userRoles = require("../models/userRoles.model.js")(sequelize, Sequelize);

// Define through tables for many-to-many relationships
const UserRoles = sequelize.define("user_roles", {
  userId: Sequelize.STRING,
  roleId: Sequelize.STRING,
});

const UserCompanies = sequelize.define("user_companies", {
  userId: Sequelize.STRING,
  companyId: Sequelize.STRING,
});

// UserRoles associations
db.role.belongsToMany(db.user, {
  foreignKey: "roleId",
  otherKey: "userId",
  through: UserRoles,
  as: "users",
});

db.user.belongsToMany(db.role, {
  foreignKey: "userId",
  otherKey: "roleId",
  through: UserRoles,
  as: "roles",
});

// UserCompanies associations
db.company.belongsToMany(db.user, {
  foreignKey: "companyId",
  otherKey: "userId",
  through: UserCompanies,
  as: "users",
});

db.user.belongsToMany(db.company, {
  foreignKey: "userId",
  otherKey: "companyId",
  through: UserCompanies,
  as: "companies",
});

// Places - Company associations
db.place.belongsTo(db.company, { foreignKey: "companyId", as: "company" });
db.company.hasMany(db.place, { foreignKey: "companyId", as: "places" });

// Vehicles - User associations
db.vehicle.belongsTo(db.user, { foreignKey: "userId", as: "user" });
db.user.hasMany(db.vehicle, { foreignKey: "userId", as: "vehicles" });

// Vehicles - Company associations
db.vehicle.belongsTo(db.company, { foreignKey: "companyId", as: "company" });
db.company.hasMany(db.vehicle, { foreignKey: "companyId", as: "vehicles" });

// Attendances - User associations
db.attendance.belongsTo(db.user, { foreignKey: "userId", as: "user" });
db.user.hasMany(db.attendance, { foreignKey: "userId", as: "attendances" });

// AttendanceImages - Attendance associations
db.attendanceImage.belongsTo(db.attendance, { foreignKey: "attendanceId", as: "attendance" });
db.attendance.hasMany(db.attendanceImage, { foreignKey: "attendanceId", as: "attendanceImages" });

// ClientImages associations
db.clientImage.belongsTo(db.client, { foreignKey: "clientId", as: "client" });
db.client.hasMany(db.clientImage, { foreignKey: "clientId", as: "clientImages" });

// Entities associations
db.entity.belongsTo(db.company, { foreignKey: "companyId", as: "company" });
db.company.hasMany(db.entity, { foreignKey: "companyId", as: "entities" });

db.deadlines.belongsTo(db.entity, { foreignKey: "entityId", as: "entity" });
db.entity.hasMany(db.deadlines, { foreignKey: "entityId", as: "deadlines" });

// Permissions associations
db.permission.belongsTo(db.user, { foreignKey: "userId", as: "user" });
db.user.hasMany(db.permission, { foreignKey: "userId", as: "permissions" });

// UserDocuments associations
db.userDocument.belongsTo(db.user, { foreignKey: "userId", as: "user" });
db.user.hasMany(db.userDocument, { foreignKey: "userId", as: "userDocuments" });

// Define roles
db.ROLES = ["worker", "admin", "moderator", "ceo"];

// Export the db object
module.exports = db;
