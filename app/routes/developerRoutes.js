const express = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { addEducationalExperience, addProfessionalExperience, registerDeveloper } = require('../controllers/developer.controller');
const developerRouter = express.Router();

//register developer
developerRouter.post("/register", registerDeveloper);

//Add educational experience
developerRouter.post("/add-education", authMiddleware, addEducationalExperience)

// Add professional experience
developerRouter.post("/add-profession", authMiddleware, addProfessionalExperience)


module.exports = {
    developerRouter
}