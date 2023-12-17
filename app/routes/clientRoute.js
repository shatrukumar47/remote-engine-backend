const express = require('express');
const { registerClient } = require('../controllers/client.controller');
const clientRouter = express.Router();

//register client
clientRouter.post("/register", registerClient);


module.exports = {
    clientRouter
}