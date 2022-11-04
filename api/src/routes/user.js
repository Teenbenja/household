const { RouterBuilder } = require("../shared/utils.js");
const userController = require("../controllers/userController")

const routers = new RouterBuilder();
routers.post("/auth/sign-in", userController.signin)
routers.post("/auth/sign-up", userController.createUser)

module.exports = routers;