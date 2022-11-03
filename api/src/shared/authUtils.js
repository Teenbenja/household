const _ = require('lodash');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { wrapAsync, ServiceError, serviceAssert } = require('./utils');
const logger = require('./logger');
// Load publicKey from configured file - jwtRS256.key for example
let publicKey = fs.readFileSync(`${__dirname}/jwt_keys/jwtRS256.key.pub`, 'utf8');
let privateKey = fs.readFileSync(`${__dirname}/jwt_keys/jwtRS256.key`, 'utf8');
const JWT_SECRET = process.env.SECRET_KEY;
const TOKEN_TIME = process.env.TOKEN_TIME;


const white_list_urls = [
    '/sign-in',
    '/sign-up',
]

function generateJWT(data) {
    return jwt.sign(data, { key: privateKey.replace(/\\n/gm, '\n'), passphrase: JWT_SECRET }, { algorithm: 'RS256' });
}

function generateExpireJWT(data) {
    const options = {
        issuer: 'Household',
        algorithm: 'RS256',
        expiresIn: TOKEN_TIME,
      };
    return jwt.sign(data, { key: privateKey.replace(/\\n/gm, '\n'), passphrase: JWT_SECRET }, options);
}

function parseJWT(token) {
    const options = {
        issuer: 'Household',
        algorithms: ['RS256'],
        maxAge: TOKEN_TIME,
      };
    const userToken = jwt.verify(token, publicKey.replace(/\\n/gm, '\n'), options, (err, decode) => {
        if (err) {
            return { tokenExp: true, error: err };
        }
        return { tokenExp: false, decode };
        },);
    return userToken
}

function assertAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        next(new ServiceError(401, "AuthFailed"));
    }
}

function GetBearerAuthMiddleWare() {
    return wrapAsync(async function(req, res, next) {
        if (_.every(white_list_urls, url => req.originalUrl.indexOf(url) === -1)) {
            try {
                serviceAssert(req.token, 401, "Missed bearer token");
                let account = parseJWT(req.token);
                logger.info('jwt parse result: ', account)
                serviceAssert(account, 401, "Invalid bearer token");
                // serviceAssert(account.decode.household, 401, "Not from us");
                next();
            } catch (error) {
                if (error.name === "TokenExpiredError") {
                    next(new ServiceError(400, "expired", error));
                    return;
                }
                next(new ServiceError(401, error.message, error));
            }
        }
        else {
            try {
                if (req.token) {
                    req.account = parseJWT(req.token);
                }
            } catch (err) {
                //ignore
            }
            next();
        }
    });
}

module.exports = {
    generateJWT,
    parseJWT,
    assertAdmin,
    GetBearerAuthMiddleWare,
    generateExpireJWT
}