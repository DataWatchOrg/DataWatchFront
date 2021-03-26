const express =  require("express")
const router = express.Router()
const mongoose = require("mongoose")
const fs = require('fs')

require('../model/Main');
const Main = mongoose.model("main")
const campos_dados_pessoais = ['nome', 'email', 'telefone', 'raça']

router.get('/saveJSON', (req, res) => {
    fs.readFile('./assets/teste.json', 'utf-8', (error, data) => {
        if (error) {
            throw new Error('Falha na leitura do arquivo.')
        }
        
        const json = JSON.parse(data)
        const updated_fields = {
            'id_usuario': json.id,
            'data': new Date(),
            'tipo_de_requisicao': json.tipo_de_requisicao,
            'campos_alterados': Object.keys(json).filter((key) => {
                return campos_dados_pessoais.includes(key)
            })
        }

        if (updated_fields.campos_alterados.length > 0) {
            new Main(updated_fields).save().then((e) => {
                res.status(200).json(e) 
            })
        } else {
            res.status(200).json()
        }
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