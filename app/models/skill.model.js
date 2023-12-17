const mongoose = require('mongoose');

const skillSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true}
},{
    versionKey: false
})

const SkillModel = mongoose.model("Skill", skillSchema);

module.exports = {
    SkillModel
}