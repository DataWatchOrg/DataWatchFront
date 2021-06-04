const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const { get } = require('lodash')
const fs = require('fs')
const { Parser } = require('json2csv');
const bcrypt = require('bcryptjs');
require('../model/Main');
require('../model/MonitoredData');
require('../model/Usuario');
const Main = mongoose.model("main")
const MonitoredData = mongoose.model("monitoredData")
const Usuario = mongoose.model("usuario")

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

router.post('/usuario/logar', (req, res) => {

    Usuario.findOne({email: req.body.email}).then((usuario) => {

        if(!!usuario) return res.status(403).send("Usuário ou senha incorreto");

        if(!usuario || !bcrypt.compareSync(get(req, 'body.senha'), get(req, 'senha')))
            return res.status(403).send("Usuário ou senha incorreto");
        else{
            return res.status(200).json(usuario);
        }
    })
})

router.post('/usuario/cadastrar', (req, res) => {

    Usuario.findOne({email: req.body.email}).then((usuario) => {

        if(usuario) return res.status(202).send("Usuário já cadastrado");
        else{
            req.body.senha = bcrypt.hashSync(req.body.senha, 10);
            const novoUsuario = new Usuario( req.body)
            novoUsuario.save().then((e) => {
                res.status(200).json(e)
            }).catch((e) => {
                res.send(e)
            })
        }

    });


})

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
