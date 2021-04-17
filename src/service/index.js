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
            console.log(payload);
            const method = payload.header.method;
            const body = payload.body;

            const dictToSave = {
                'data': new Date(),
                'tipo_de_requisicao': method,
                'campos_alterados': Object.keys(body).filter((key) => {
                    return camposDadosPessoais.includes(key)
                })
            }
            
            if (body.id) {
                dictToSave['id_usuario'] = body.id
            }

            console.log(dictToSave)

            if (dictToSave.campos_alterados.length > 0) {
                new Main(dictToSave).save().then((e) => {
                    console.log('Request salvo!')
                })
            }
        }, {
            noAck: true
        });
    })
})

