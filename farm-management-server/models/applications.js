const mongoose = require('mongoose')

const applicationsSchema = mongoose.Schema({
    applicationUniqueId: { type: String },
    applicationType: { type: String },
    applicantName: { type: String },
    unit: { type: String },
    costPerUnit: { type: Number },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const Applications = mongoose.model('Applications', applicationsSchema)
module.exports = Applications;