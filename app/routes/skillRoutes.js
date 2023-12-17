const express = require("express");
const { getAllSkills, addSkill, updateSkill, deleteSkill } = require("../controllers/skill.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const skillRouter = express.Router();

//Get all skills
skillRouter.get("/", getAllSkills)

//Add new skill
skillRouter.post("/add", authMiddleware, addSkill)

//update a new skill
skillRouter.patch("/update/:id", authMiddleware, updateSkill)

//Delete a skill
skillRouter.delete("/delete/:id", authMiddleware, deleteSkill)

module.exports = {
    skillRouter
}