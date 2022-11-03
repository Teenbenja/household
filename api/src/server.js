const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const cors = require("cors")
const {ServiceError} = require("./shared/utils")
const logger = require("./shared/logger")
const db = require('./config/db')
const bearerToken  = require("express-bearer-token")
require('dotenv').config()
logger.info(process.env.TOKEN_TIME)
const {setJWT_KEYS} = require("./shared/jwt")
const { GetBearerAuthMiddleWare } = require("./shared/authUtils")

const PORT = process.env.PORT || 7666

mongoose.connect(db.url, {
  useNewUrlParser: true,
})
const mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "connection error: "));
mongoDB.once("open", function () {
  console.log("Connected successfully");
});

const app = express()
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
  origin: "*"
}
app.use(bearerToken());
app.use(express.json());
app.use(cors(corsOptions))

setJWT_KEYS()

let bearerAuth = GetBearerAuthMiddleWare()
if (bearerAuth) app.use('/api/*', bearerAuth)

const initRoutes = require("./routes")
app.use(express.urlencoded({ extended: true}))
initRoutes(app)

app.use(function handleServiceError(error, req, res, next) {
  if (error instanceof ServiceError) {
    return res.status(error.status).json({
      type: "ServiceError",
      code: error.message,
      message: error.message,
      stack: error.stack,
    });
  }
  next(error);
});

app.use(function handleGenericError(error, req, res, next) {
  if (error) {
    return res.status(500).json({
      type: "InternalError",
      code: "InternalError",
      message: "InternalError",
      stack: error.stack
    });
  }
});

app.listen(PORT, () => {
  console.log("app listening on port 7666")
})