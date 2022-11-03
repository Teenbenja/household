// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
const bcrypt = require('bcrypt')
const User = require('../models')
const { serviceAssert } = require('../shared/utils')
const { generateExpireJWT } = require("../shared/authUtils")
const logger = require('../shared/logger')

// see above for explanation of "salting", 10 rounds is recommended
const bcryptSaltRounds = 10

// user util functions

const getUserByName = async (name) => {
    let user = await User.findOne({name})
    
    if (!user) {
        return user;
    }
    return user;
}

// user controller functions
const signin = async (req, res) => {
    let {
        name,
        password
    } = req.body
    name = name.toLowerCase().trim()
    serviceAssert(password, 400, 'password shall be specified')
    let user = await getUserByName(name)
    serviceAssert(user, 400, 'user not found')
    serviceAssert(bcrypt.compare(password, user.hashedPassword), 400, 'AuthFailure, password is incorrect')

    const jwt = generateExpireJWT({
        id: user._id,
        name,
        household: true,
      });
      delete user.password;
    
      res.send({
        name,
        id: user._id,
        token: jwt
      });
}

const createUser = async (req, res) => {
    let {
        name,
        password
    } = req.body
    name = name.toLowerCase().trim()
    serviceAssert(name, 400, 'Name required')
    serviceAssert(password && password.length >= 8, 400, 'Invalid password')
    password = await bcrypt.hash(req.body.password, bcryptSaltRounds)
    let user = await getUserByName(name)
    if (user) serviceAssert(false, 400, 'name has been registered')
    user = await User.create({
        name,
        hashedPassword: password
    })
    res.send(user.toObject())
}

module.exports = {
    signin,
    createUser
}