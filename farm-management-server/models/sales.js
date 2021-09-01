const mongoose = require('mongoose')

const salesSchema = mongoose.Schema({
    salesUniqueId: { type: String },
    averageBodyWeight: { type: Number },
    salesPrice: { type: Number },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const Sales = mongoose.model('Sales', salesSchema)
module.exports = Sales;