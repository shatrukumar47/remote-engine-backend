const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DeveloperModel } = require("../models/developer.model");
require("dotenv").config();


//initial registeration
const registerDeveloper = async (req, res)=>{
    const { firstName, lastName, phoneNumber, email, password, skills } = req.body;
    try {
        const existingDeveloper = await DeveloperModel.findOne({ email });
        if (existingDeveloper) {
            return res.status(200).json({ message: 'Account already exists', action: false });
        }

        //password hashing
        bcrypt.hash(password, +process.env.saltRounds, async (err, hash)=>{
            if(err){
                res.status(400).send({error: err});
            }
            
            //new developer
            const newDeveloper = new DeveloperModel({firstName, lastName, phoneNumber, email, password: hash, skills});
            await newDeveloper.save();

            //jwt accessToken
            const accessToken = jwt.sign({userID: newDeveloper._id, email: email}, process.env.JWT_SECRET)

            res.status(200).json({ message: 'Registered successfully', accessToken ,action: true });
        })

    } catch (error) {
        res.status(400).json({ error: error.message});
    }
}


//Add educational experience
const addEducationalExperience  = async (req, res)=>{
 
    const educationdetails = req.body.educationalExperience || []
    try {
        let developer  = await DeveloperModel.findOne({_id: req.body.userID});

        if(!developer){
            return res.status(200).json({ message: 'Developer not found', action: false });
        }

        const  educationalExperience = [...developer.educationalExperience, ...educationdetails];

        await DeveloperModel.findByIdAndUpdate({_id: req.body.userID}, {educationalExperience})
       

        res.status(200).json({ message: 'Educational experience added successfully', action: true });
        
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
}


// Add professional experience
const addProfessionalExperience = async (req, res)=>{
    const professionalDetails  = req.body.professionalExperience  || []
    try {

        let developer  = await DeveloperModel.findOne({_id: req.body.userID});

        if(!developer){
            return res.status(200).json({ message: 'Developer not found', action: false });
        }

        const  professionalExperience = [...developer.professionalExperience, ...professionalDetails];
    
        console.log(professionalExperience)
        await DeveloperModel.findByIdAndUpdate({_id: req.body.userID}, {professionalExperience})

        res.status(200).json({ message: 'Professional experience added successfully', action: true });
        
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
}

module.exports = {
    registerDeveloper, addEducationalExperience, addProfessionalExperience
}