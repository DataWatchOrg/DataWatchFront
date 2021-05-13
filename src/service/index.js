const amqp = require('amqplib/callback_api')
const mongoose = require("mongoose") 
require('../model/MonitoredData');
require('../model/Main');
const MonitoredData = mongoose.model("monitoredData")
const Main = mongoose.model("main")

let camposDadosPessoais = []
const getCamposDadosPessoais = MonitoredData.find().lean().exec((err, result) => {
    camposDadosPessoais = result.map(d => d.dado)
})

const rabbitUri = "amqps://cehwgqgh:bYyZ5ndnh6ZhHl1Gt8U9hQB4HEoCxGtz@owl.rmq.cloudamqp.com/cehwgqgh"

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
            console.log(payload);

            const header = payload.header ? payload.header : {};

            if (header.method === 'POST') {
                const response = payload.response ? payload.response : {};
                if (response.id) {
                    dictToSave['id_usuario'] = response.id;
                }
                dictToSave['data'] = new Date();
                dictToSave['tipo_de_requisicao'] = header.method;
                dictToSave['campos_alterados'] = [];
            }

            if (header.method === 'PUT') {
                const body = payload.body ? payload.body : {};

                dictToSave['data'] = new Date();
                dictToSave['tipo_de_requisicao'] = header.method;
                dictToSave['campos_alterados'] = Object.keys(body).filter((key) => {
                    return camposDadosPessoais.includes(key);
                })
                if (body.id) {
                    dictToSave['id_usuario'] = body.id;
                }
            }

            console.log(dictToSave);

            if (Object.keys(dictToSave)) {
                new Main(dictToSave).save().then((e) => {
                    console.log('Request salvo!');
                })
            }
        }, {
            noAck: true
        });
    })
})

