const express = require('express');
const { registerClient, loginClient, getClientProfileDetails, updateClientDetails } = require('../controllers/client.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const clientRouter = express.Router();

//register client
clientRouter.post("/register", registerClient);

//login client
clientRouter.post("/login", loginClient);

//get client profile details
clientRouter.get("/profile-details", authMiddleware, getClientProfileDetails)

//update client details
clientRouter.patch("/update-details", authMiddleware, updateClientDetails)


module.exports = {
    clientRouter
}