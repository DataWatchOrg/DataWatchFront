const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Main = new Schema({
    id_usuario: {
        type: Number,
        required: true
    },
    campos_alterados: {
        type: Array,
        required: true
    },
    tipo_de_requisicao: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        required: true
    }
})

mongoose.model("main", Main);