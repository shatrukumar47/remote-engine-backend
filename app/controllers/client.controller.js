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
          return res.status(400).json({ message: 'Client already exists', action: false });
        }
    
        //password hashing
        bcrypt.hash(password, +process.env.saltRounds, async (err, hash)=>{
          if(err){
              res.status(400).send({ message: 'Error hashing password', action: false });
          }
          
          //new client
          const newClient  = new ClientModel({companyName, email, password: hash});
          await newClient.save();

          res.status(200).json({ message: 'Registered successfully', action: true });
      })
      } catch (error) {
        res.status(400).json({ message: `Error registering developer: ${error.message}`, action: false });
      }
}

//login client
const loginClient = async (req, res)=>{
  const { email, password } = req.body;
  try {
      const client = await ClientModel.findOne({ email });

      if (!client) {
          return res.status(400).json({ message: 'client not found!', action: false });
      }

      bcrypt.compare(password, client?.password, (err, result)=>{
          if (!result) {
              res.status(400).send({ message: "Wrong Password!", action: false });
            } else {
              const accessToken = jwt.sign({ userID: client?._id, email: client?.email }, process.env.JWT_SECRET);
              
              res.status(200).send({
                message: "Login successful",
                accessToken: accessToken,
                role: "client",
                action: true
              });
            }
      })


  } catch (error) {
      res.status(400).json({ message: `Error login: ${error.message}`, action: false });
  }
}

//get client profile details
const getClientProfileDetails = async (req, res)=>{
  const userID = req.body.userID;
  try {

      const client = await ClientModel.findOne({ _id: userID });

      if (!client) {
          return res.status(400).json({ message: 'client not found!', action: false });
      }

      const { companyName, email} = client;

      res.status(200).json({
          message: 'Client details retrieved successfully',
          client: { companyName, email },
          action: true
      });
      
  } catch (error) {
      res.status(400).json({ message: `Error fetching profile details: ${error.message}`, action: false });
  }
}

//update client details
const updateClientDetails = async (req, res)=>{
  const {companyName, password, userID} = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, +process.env.saltRounds);

    const updatedClient = await ClientModel.findByIdAndUpdate({_id: userID}, {companyName, password: hashedPassword})

    if (!updatedClient) {
      return res.status(400).json({ message: 'client not found!', action: false });
    }

    res.status(200).json({ message: 'Client details updated successfully', updatedClient , action: true});
    
  } catch (error) {
    res.status(400).json({ message: `Error updating profile details: ${error.message}`, action: false });
  }
}


module.exports = {
    registerClient, loginClient, getClientProfileDetails, updateClientDetails
}