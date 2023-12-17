const mongoose = require("mongoose");

const developerSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    skills: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
        },
    ],
    professionalExperience: {
        type:[
            {
                companyName:{type:String},
                techStack: {type: String},
                skills: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Skill',
                    },
                ],
                duration:{type: String}
            }
        ],
        default: []
    },
    educationalExperience:{
        type:[
            {
                degreeName:{type:String},
                schoolName: {type: String},
                duration:{type: String}
            }
        ],
        default: []
    }
})

const DeveloperModel = mongoose.model("Developer", developerSchema);

module.exports = {
    DeveloperModel
}