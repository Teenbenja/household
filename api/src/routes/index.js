const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const logger = require('../shared/logger')
const { wrapAsync } = require('../shared/utils')

const routes= [
    require("./user")
]

module.exports = (app) => {
    routes.forEach(route => {
        route.build().forEach(r => {
            const {
                method,
                path,
                handler
            } = r
            let apiPath = `/api${path}`
            app[method.toLowerCase()](apiPath, wrapAsync(handler))
            logger.info(`${method} ${apiPath} handler registered`)
        })
        return 
    })
}