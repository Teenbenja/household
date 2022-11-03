const { RouterBuilder } = require("../shared/utils.js");
const userController = require("../controllers/userController")

const routers = new RouterBuilder();
routers.post("/sign-in", userController.signin)
routers.post("/sign-up", userController.createUser)

module.exports = routers;