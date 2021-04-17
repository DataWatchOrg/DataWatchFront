const amqp = require('amqplib/callback_api')

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
        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    })
})

