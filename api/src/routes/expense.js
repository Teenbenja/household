const { RouterBuilder } = require("../shared/utils.js");
const expenseController = require("../controllers/expenseController")

const routers = new RouterBuilder();
routers.get("/expense/expenses", expenseController.getExpenses)
routers.post("/expense/expense", expenseController.createExpense)
routers.put("/expense/:expenseId", expenseController.updateExpense)

module.exports = routers;