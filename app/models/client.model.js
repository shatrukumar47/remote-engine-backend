const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
    companyName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true}
})

const ClientModel = mongoose.model("Client", clientSchema);

module.exports = {
    ClientModel
}