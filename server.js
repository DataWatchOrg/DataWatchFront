const express = require('express');
const bodyParser = require('body-parser')
var cors = require('cors')
require('./src/database')
require('./src/service')
const app =  express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

//Require Controllers
const ctrMain = require('./src/controller/ControllerMain');

app.use('/main', ctrMain);

app.listen(process.env.PORT || 3001);