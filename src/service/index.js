const amqp = require('amqplib/callback_api')
const mongoose = require("mongoose") 
require('../model/MonitoredData');
require('../model/Main');
const MonitoredData = mongoose.model("monitoredData")
const Main = mongoose.model("main")
const crypto = require('../crypto/decrypt');

let camposDadosPessoais = []
const getCamposDadosPessoais = MonitoredData.find().lean().exec((err, result) => {
    camposDadosPessoais = result.map(d => d.dado)
})

const rabbitUri = "amqps://leshjeua:z0mNOy_aGSTEkAR-fLPcUUyc6pwAeTlP@jackal.rmq.cloudamqp.com/leshjeua"
var AESCrypt = {};

amqp.connect(rabbitUri, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        const queue = 'spring-boot';

        channel.assertQueue(queue, {
            durable: false
        })

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue)

        channel.consume(queue, function (msg) {
            const payload = JSON.parse(msg.content.toString());
            let dictToSave ={};

            const jsonMessage = crypto.decryptMessage(payload);

            const header = jsonMessage.header ? jsonMessage.header : {};

            if (header.method === 'POST') {
                const response = jsonMessage.response ? jsonMessage.response : {};
                const systemData = jsonMessage.system_data ? jsonMessage.system_data : {}

                if (response.id) {
                    dictToSave['id_usuario'] = response.id;
                }
                dictToSave['tipo_de_requisicao'] = header.method;
                dictToSave['operacao'] = 'Create';
                dictToSave['campos_alterados'] = [];
                dictToSave['id_operador'] = systemData.id_usuario_logado;
            }

            if (header.method === 'PUT') {
                const body = jsonMessage.body ? jsonMessage.body : {};
                const systemData = jsonMessage.system_data ? jsonMessage.system_data : {}

                if (body.id) {
                    dictToSave['id_usuario'] = body.id;
                }
                dictToSave['tipo_de_requisicao'] = header.method;
                dictToSave['operacao'] = 'Update';
                dictToSave['campos_alterados'] = Object.keys(body).filter((key) => {
                    return camposDadosPessoais.includes(key);
                });
                dictToSave['id_operador'] = systemData.id_usuario_logado;
            }

            console.log(dictToSave);

            if (Object.keys(dictToSave).length > 0) {
                new Main(dictToSave).save().then((e) => {
                    console.log('Request salvo!');
                })
            }
        }, {
            noAck: true
        });
    })
})

