const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const fs = require('fs')
const { Parser } = require('json2csv');
require('../model/Main');
require('../model/MonitoredData');
const Main = mongoose.model("main")
const MonitoredData = mongoose.model("monitoredData")
let campos_dados_pessoais

router.get('/saveJSON', async (req, res) => {

    campos_dados_pessoais = (await MonitoredData.find()).map(d => d.dado)

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

router.get('/relatorio', (req, res) => {
   
   Main.find().then((itens) => {
        const relatorio = []
            itens.forEach(obj => {
                    var campos = '';
                    obj.campos_alterados.forEach(campo => {
                        campos += campo+'\t - '
                    });
                relatorio.push({ campos_alterados: campos, id_usuario: obj.id_usuario, data: obj.data, requisicao: obj.tipo_de_requisicao });
            });

        const json2csvParser = new Parser({ delimiter: ';'});
        const tsv = json2csvParser.parse(relatorio);

        res.setHeader("charset", "utf-8");
        res.header("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=tutorials.csv");
        res.status(200).end(tsv);
   })
  

});
router.get('/listardocumentos', (req, res) => {
    let find = {};

    find.id_usuario = parseInt(req.query.id_usuario) ??  null;
    find.operacao = req.query.operacao ??  null;
    find.id_operador = parseInt(req.query.id_operador) ??  null;
    find.tipo_de_requisicao = parseInt(req.query.tipo_de_requisicao) ??  null;
    Main.find(find).then((itens) => {
        res.json(itens)
    })
    
});


router.get('/listar', (req, res) => {
 

     res.send("ok");
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