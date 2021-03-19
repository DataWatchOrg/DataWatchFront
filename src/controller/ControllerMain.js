const express =  require("express")
const router = express.Router()
const mongoose = require("mongoose")

require('../model/Main');
const Main = mongoose.model("main")

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