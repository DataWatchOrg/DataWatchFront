const express =  require("express")
const router = express.Router()
const mongoose = require("mongoose")
const fs = require('fs')

require('../model/Main');
const Main = mongoose.model("main")

router.get('/saveJSON', (req, res) => {
    /* Realiza a leitura do arquivo teste */
    fs.readFile('./assets/teste.json', 'utf-8', (error, data) => {
        if (error) {
            throw new Error('Falha na leitura do arquivo.')
        }
        
        /* Salva o conteúdo do arquivo transformado em JSON no banco */
        new Main(JSON.parse(data)).save().then((e) => {
            res.status(200).json(e) 
        }) 
    })
});

router.get('/', (req, res) => {

});

router.post('/',  (req, res) => {
    /* Aqui podemos receber algumas coisas :) */
    new Main({'nome': "freddie mercury", "endereco": "Casa da mãe joana"}).save().then((e) => {
        res.status(200).json(e) /* Teste ao salvar no BD */
    })
   
});

router.put('/', (req, res) => {

});

router.delete('/', (req, res) => {

});

module.exports = router;