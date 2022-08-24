const NodeRSA = require('node-rsa');
const path = require("path");
const fs = require("fs");
const aesjs = require("aes-js");

const decryptMessage = (payload) => {
    //Descriptografia da chave AES com a chave privada RSA
    let chaveAESCript = payload.chaveAESCriptografadaRSA
    let relativeOrAbsolutePathtoPrivateKey = 'assets/key.pem'
    var absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey)
    var privateKey = fs.readFileSync(absolutePath, "utf8")
    let key = new NodeRSA({b: 1024})
    key.importKey(privateKey, 'pkcs1')
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
    var cleanMessage = message.replace(/[\u0000-\u0019]+/g,"").trim()
    var jsonMessage = JSON.parse(cleanMessage)

    return jsonMessage
}

exports.decryptMessage = decryptMessage;