const express = require('express');
const bodyParser = require('body-parser')
var cors = require('cors')

const app =  express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())



app.listen(process.env.PORT || 3001);