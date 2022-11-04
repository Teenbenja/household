// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
const bcrypt = require('bcrypt')
const { Expense } = require('../models')
const { serviceAssert } = require('../shared/utils')
const logger = require('../shared/logger')
const { parseJWT } = require("../shared/authUtils")
const { isEmpty } = require('lodash')

// expense util functions


// expense controller functions
const getExpenses = async (req, res) => {
    let expenses = await Expense.find()
    logger.info(expenses)
    expenses = expenses.map(expense => expense.toObject())
    
    res.send(expenses);
}

const createExpense = async (req, res) => {
    let {
        name,
        amount,
        category
    } = req.body

    name = name.trim()
    serviceAssert(name, 400, 'Name required')
    serviceAssert(amount && !isNaN(amount), 400, 'Invalid amount value')

    category = category.trim()
    serviceAssert(category, 400, "Category required")

    serviceAssert(req.token, 401, "Missed bearer token");
    let account = parseJWT(req.token);
    serviceAssert(!account.error, 401, "Invalid bearer token");
    let expense
    try {
        expense = await Expense.create({
            name,
            amount,
            category,
            createdBy: account.decode.name
        })
    } catch (error) {
        serviceAssert(error.type === 'InternalError', 401, "Invalid expense values")
    }

    res.send(expense.toObject())
}

const updateExpense = async (req, res) => {
    const expenseId = req.params.expenseId;
    serviceAssert(expenseId, 400, 'The expense identifier shall be specified');

    let {
        name,
        amount,
        category
    } = req.body
    name = name.trim()
    serviceAssert(name, 400, 'Name required')
    serviceAssert(amount && !isNaN(amount), 400, 'Invalid amount value')

    category = category.trim()
    serviceAssert(category, 400, "Category required")

    let expense
    try {
        expense = await Expense.findOneAndUpdate({_id: expenseId}, {
            name,
            amount,
            category,
        }, {new: true, runValidators: true})
    } catch (error) {
        serviceAssert(error.type === 'InternalError', 401, "Invalid expense values")
    }

    res.send(expense.toObject())
}

module.exports = {
    getExpenses,
    createExpense,
    updateExpense
}