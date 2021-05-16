const amqp = require('amqplib/callback_api')
const NodeRSA = require('node-rsa');
var CryptoJS = require("crypto-js");
var crypto = require('crypto');
var path = require("path");
var fs = require("fs")
var aesjs = require("aes-js")
const mongoose = require("mongoose") 
require('../model/MonitoredData');
require('../model/Main');
const MonitoredData = mongoose.model("monitoredData")
const Main = mongoose.model("main")
var keySize = 256;
var iterations = 100;

let camposDadosPessoais = []
// const getCamposDadosPessoais = MonitoredData.find().lean().exec((err, result) => {
//     camposDadosPessoais = result.map(d => d.dado)
// })

const rabbitUri = "amqps://cehwgqgh:bYyZ5ndnh6ZhHl1Gt8U9hQB4HEoCxGtz@owl.rmq.cloudamqp.com/cehwgqgh"
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
            console.log('\n\njson: \n' , payload);
    
            //Descriptografia da chave AES com a chave privada RSA
            let chaveAESCript = payload.chaveAESCriptografadaRSA
            let relativeOrAbsolutePathtoPrivateKey = 'assets/key.pem'
            var absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey);
            var privateKey = fs.readFileSync(absolutePath, "utf8");
            let key = new NodeRSA({b: 1024})
            key.importKey(privateKey, 'pkcs8')
            var decryptKeyAES = key.decrypt(chaveAESCript)

            //Converte a chave AES de hexadecimal para byte
            var encriptedBytesAES = aesjs.utils.hex.toBytes(decryptKeyAES.toString())

            //Converte o IV de hexadecimal para byte
            let iv = payload.iv
            var encriptedBytesIV = aesjs.utils.hex.toBytes(iv.toString())

            //Converte a mensagem criptografa com AES de hexadecimal para bytes
            let mensagemCriptografadaAES = payload.mensagemCriptografadaAES
            var encriptedBytesMessage = aesjs.utils.hex.toBytes(mensagemCriptografadaAES.toString())

            //Decripta a mensagem em bytes criptografada com AES para texto comum (utf8)
            var aescbc = new aesjs.ModeOfOperation.cbc(encriptedBytesAES, encriptedBytesIV)
            var decriptedBytes = aescbc.decrypt(encriptedBytesMessage)
            var message = aesjs.utils.utf8.fromBytes(decriptedBytes)

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

