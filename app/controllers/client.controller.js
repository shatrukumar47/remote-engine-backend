const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ClientModel } = require("../models/client.model");
require("dotenv").config();


//Initial Registration of Client
const registerClient = async (req, res)=>{
    try {
        const { companyName, email, password } = req.body;
    
        const existingClient = await ClientModel.findOne({ email });
        if (existingClient) {
          return res.status(200).json({ message: 'Client already exists', action: false });
        }
    
        //password hashing
        bcrypt.hash(password, +process.env.saltRounds, async (err, hash)=>{
          if(err){
              res.status(400).send({error: err});
          }
          
          //new client
          const newClient  = new ClientModel({companyName, email, password: hash});
          await newClient.save();

          //jwt accessToken
          const accessToken = jwt.sign({userID: newClient._id, email: email}, process.env.JWT_SECRET)

          res.status(200).json({ message: 'Registered successfully', accessToken ,action: true });
      })
      } catch (error) {
        res.status(400).json({ error: error.message});
      }
}



module.exports = {
    registerClient
}