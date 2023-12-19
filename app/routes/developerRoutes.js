const express = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { addEducationalExperience, addProfessionalExperience, registerDeveloper, loginDeveloper, getDeveloperProfile, updateDeveloperDetails } = require('../controllers/developer.controller');
const developerRouter = express.Router();

//register developer
developerRouter.post("/register", registerDeveloper);

//login developer
developerRouter.post("/login", loginDeveloper);

//get developer profile details
developerRouter.get("/profile-details", authMiddleware, getDeveloperProfile)

//Add educational experience
developerRouter.post("/add-education", authMiddleware, addEducationalExperience)

// Add professional experience
developerRouter.post("/add-profession", authMiddleware, addProfessionalExperience)

//update developer details
developerRouter.patch("/update-developer-details", authMiddleware, updateDeveloperDetails)


module.exports = {
    developerRouter
}