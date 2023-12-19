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
            return res.status(400).json({ message: 'Account already exists', action: false });
        }

        //password hashing
        bcrypt.hash(password, +process.env.saltRounds, async (err, hash)=>{
            if(err){
                res.status(400).send({ message: 'Error hashing password', action: false });
            }
            
            //new developer
            const newDeveloper = new DeveloperModel({firstName, lastName, phoneNumber, email, password: hash, skills});
            await newDeveloper.save();

            //jwt accessToken
            const accessToken = jwt.sign({userID: newDeveloper._id, email: email}, process.env.JWT_SECRET)

            res.status(200).json({ message: 'Registered successfully', accessToken ,action: true });
        })

    } catch (error) {
        res.status(400).json({ message: `Error registering developer: ${error.message}`, action: false });
    }
}


//Add educational experience
const addEducationalExperience  = async (req, res)=>{
 
    const educationdetails = req.body.educationalExperience || []
    try {
        let developer  = await DeveloperModel.findOne({_id: req.body.userID});

        if(!developer){
            return res.status(400).json({ message: 'Developer not found', action: false });
        }

        // const  educationalExperience = [...developer.educationalExperience, ...educationdetails];
        const  educationalExperience = educationdetails;

        await DeveloperModel.findByIdAndUpdate({_id: req.body.userID}, {educationalExperience})
       

        res.status(200).json({ message: 'Educational experience added successfully', action: true });
        
    } catch (error) {
        res.status(400).json({ message: `Error adding educational experience: ${error.message}`, action: false });
    }
}


// Add professional experience
const addProfessionalExperience = async (req, res)=>{
    const professionalDetails  = req.body.professionalExperience  || []
    try {

        let developer  = await DeveloperModel.findOne({_id: req.body.userID});

        if(!developer){
            return res.status(400).json({ message: 'Developer not found', action: false });
        }

        // const  professionalExperience = [...developer.professionalExperience, ...professionalDetails];
        const  professionalExperience = professionalDetails;
    
        await DeveloperModel.findByIdAndUpdate({_id: req.body.userID}, {professionalExperience})

        res.status(200).json({ message: 'Professional experience added successfully', action: true });
        
    } catch (error) {
        res.status(400).json({ message: `Error adding professional experience: ${error.message}`, action: false });
    }
}

//login developer
const loginDeveloper = async (req, res)=>{
    const { email, password } = req.body;
    try {
        const developer = await DeveloperModel.findOne({ email });

        if (!developer) {
            return res.status(400).json({ message: 'User not found!', action: false });
        }

        bcrypt.compare(password, developer?.password, (err, result)=>{
            if (!result) {
                res.status(400).send({ message: "Wrong Password!", action: false });
              } else {
                const accessToken = jwt.sign({ userID: developer?._id, email: developer?.email }, process.env.JWT_SECRET);
                
                res.status(200).send({
                  message: "Login successful",
                  accessToken: accessToken,
                  role: "developer",
                  action: true
                });
              }
        })


    } catch (error) {
        res.status(400).json({ message: `Error login: ${error.message}`, action: false });
    }
}

//get developer profile details
const getDeveloperProfile = async (req, res)=>{
    const userID = req.body.userID;
    try {

        const developer = await DeveloperModel.findOne({ _id: userID }).populate('skills').populate('professionalExperience.skills')

        if (!developer) {
            return res.status(400).json({ message: 'Developer not found!', action: false });
        }

        const { firstName, lastName, email, phoneNumber, skills, educationalExperience, professionalExperience } = developer;

      

        res.status(200).json({
            message: 'Developer details retrieved successfully',
            developer: {
              firstName,
              lastName,
              email,
              phoneNumber,
              skills,
              professionalExperience,
              educationalExperience
            },
            action: true,
          });
        
    } catch (error) {
        res.status(400).json({ message: `Error fetching profile details: ${error.message}`, action: false });
    }
}

//update developer details
const updateDeveloperDetails = async (req, res)=>{
    const { firstName, lastName, phoneNumber, email, password, skills, userID } = req.body;
    try {
        const developer = await DeveloperModel.findOne({ email });
        if (!developer) {
            return res.status(400).json({ message: 'Account not found', action: false });
        }

        //password hashing
        bcrypt.hash(password, +process.env.saltRounds, async (err, hash)=>{
            if(err){
                res.status(400).send({ message: 'Error hashing password', action: false });
            }
            
            //new developer
            const updatedDeveloper = await DeveloperModel.findByIdAndUpdate({_id: userID},{firstName, lastName, phoneNumber, email, password: hash, skills});

            res.status(200).json({ message: 'Updated successfully' ,action: true });
        })
        
    } catch (error) {
        res.status(400).json({ message: `Error updating developer details: ${error.message}`, action: false });
    }
}

module.exports = {
    registerDeveloper, addEducationalExperience, addProfessionalExperience, loginDeveloper, getDeveloperProfile, updateDeveloperDetails
}