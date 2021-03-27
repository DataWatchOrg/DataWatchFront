const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const MonitoredData = new Schema({
    dado: {
        type: String,
        required: true
    }
})

monitoredDataModel = mongoose.model("monitoredData", MonitoredData, "monitoredData");
module.exports = monitoredDataModel;
