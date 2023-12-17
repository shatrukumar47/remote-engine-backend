const { SkillModel } = require("../models/skill.model");

//get skills
const getAllSkills = async (req, res)=>{
    try {
        const { name } = req.query;
        let query = {};
    
        
        if (name) {
          query = { name: { $regex: new RegExp(name, 'i') } };
        }


        const skills = await SkillModel.find(query);
        res.status(200).json(skills)
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//add skill
const addSkill = async (req, res)=>{
    try {
        const { name } = req.body;
        const existingSkill = await SkillModel.findOne({ name });
        if (existingSkill) {
            return res.status(200).json({ message: 'Skill already exists' , action: false});
        }

        const newSkill = new SkillModel({ name });
        await newSkill.save();
        res.status(201).json({ message: 'Skill added successfully' , action: true});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//update skill
const updateSkill = async (req, res)=>{
    const skillID = req.params.id;
    try {
        const { name } = req.body;

        //check existing one
        const existingSkill = await SkillModel.findOne({ name });
        if (existingSkill) {
            return res.status(200).json({ message: 'Skill already exists' , action: false});
        }

        const updatedSkill = await SkillModel.findByIdAndUpdate({_id: skillID}, { name });
        if (!updatedSkill) {
            return res.status(200).json({ message: 'Skill not found', action: false });
        }
      
        res.status(200).json({ message: 'Skill updated successfully', action:true });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//delete a skill
const deleteSkill = async (req, res)=>{
    const skillID = req.params.id;
    try {
        const existingSkill = await SkillModel.findOne({_id: skillID});
        if(!existingSkill){
           return res.status(200).json({ message: 'Skill not found', action: false });
        }

        await SkillModel.findByIdAndDelete({_id: skillID});
        res.status(200).json({ message: 'Skill deleted successfully', action: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getAllSkills, addSkill, updateSkill, deleteSkill
}