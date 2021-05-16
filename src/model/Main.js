const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Main = new Schema({
    id_usuario: {
        type: Number,
        required: true
    },
    id_operador: {
        type: Number,
        required: true
    },
    tipo_de_requisicao: {
        type: String,
        required: true
    },
    operacao: {
        type: String,
        required: false
    },
    data: {
        type: Date,
        default: Date.now,
        required: true
    },
    campos_alterados: {
        type: Array,
        required: false
    }
})

mainModel = mongoose.model("main", Main);
module.exports = mainModel;
