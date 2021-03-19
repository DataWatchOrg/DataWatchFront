const mongoose = require('mongoose');

mongoose.Promise = global.Promise

mongoose.connect("mongodb://localhost/servercrud").then(() => {
    console.log("Conectado ao mongo")
}).catch((err) => {
    console.log("Erro ao se conectar" + err)
})