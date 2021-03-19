const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Main = new Schema({
    nome:{
        type: String,
        required: true
    },endereco:{
        type: String,
        required: true
    }
})

mongoose.model("main", Main);