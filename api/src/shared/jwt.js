const fs = require('fs')
const path = require('path')
const {generateKeyPair} = require('crypto')
const jwt = require("jsonwebtoken")


const folderPath =  path.resolve(`${__dirname}/jwt_keys`);
const JWT_PRIVATE_KEY = fs.readFileSync(`${folderPath}/jwtRS256.key`, 'utf8');
const JWT_PUBLIC_KEY = fs.readFileSync(`${folderPath}/jwtRS256.key.pub`, 'utf8');
const JWT_SECRET = process.env.SECRET_KEY;
const TOKEN_TIME = process.env.TOKEN_TIME;

const setJWT_KEYS = (secret = process.env.SECRET_KEY) => {
    generateKeyPair(
        'rsa',
        {
            modulusLength: 4096,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem',
            },
            privateKeyEncoding: {
              type: 'pkcs8',
              format: 'pem',
              cipher: 'aes-256-cbc',
              passphrase: secret,
            },
        },
        (err, publicKey, privateKey) => {
            fs.writeFileSync(`${folderPath}/jwtRS256.key`, privateKey, error => {
                if (error) throw error
            })
            fs.writeFileSync(`${folderPath}/jwtRS256.key.pub`, publicKey, error => {
                if (error) throw error
            })
        }
    )
}

 const encodeToken = (object = {}) => {
    const options = {
      issuer: 'Household',
      algorithm: 'RS256',
      expiresIn: TOKEN_TIME,
    };
    const token = jwt.sign(
      object,
      { key: JWT_PRIVATE_KEY.replace(/\\n/gm, '\n'), passphrase: JWT_SECRET },
      options,
    );
    return token;
}

 const verifyToken = (sentToken) => {
    const options = {
      issuer: 'Household',
      algorithms: ['RS256'],
      maxAge: TOKEN_TIME,
    };
    const userToken = jwt.verify(
      sentToken,
      JWT_PUBLIC_KEY.replace(/\\n/gm, '\n'),
      options,
      (err, decode) => {
        if (err) {
          return { tokenExp: true, error: err };
        }
        return { tokenExp: false, decode };
      },
    );
    return userToken;
}

module.exports = {
    setJWT_KEYS,
    encodeToken,
    verifyToken
}