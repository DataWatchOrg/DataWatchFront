const amqp = require('amqplib/callback_api')
const mongoose = require("mongoose")
require('../model/Main');
require('../model/MonitoredData');
const Main = mongoose.model("main")
const MonitoredData = mongoose.model("monitoredData")
let campos_dados_pessoais

campos_dados_pessoais = (await MonitoredData.find()).map(d => d.dado)

amqp.connect('amqp://172.17.0.3', function(error0, connection) {
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
        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());

            const json = JSON.parse(msg.content.toString())
            const updated_fields = {
                'id_usuario': json.id,
                'data': new Date(),
                'tipo_de_requisicao': 'pega da header o tipo',
                'campos_alterados': Object.keys(json).filter((key) => {
                    return campos_dados_pessoais.includes(key)
                })
            }

            if (updated_fields.campos_alterados.length > 0) {
                new Main(updated_fields).save().then((e) => {
                    console.log('Infos pimbadíssimas')
                })
            }

        }, {
            noAck: true
        });
    })
})

