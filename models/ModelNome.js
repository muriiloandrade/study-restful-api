var mongoose = require('mongoose')
var Schema = mongoose.Schema

var NomeSchema = new Schema({
    name: String
})

module.exports = mongoose.model('Nome', NomeSchema)