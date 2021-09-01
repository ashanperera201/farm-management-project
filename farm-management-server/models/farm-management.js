const mongoose = require('mongoose')

const farmManagementSchema = mongoose.Schema({
    farmUniqueId: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'ClubMember', required: true },
    farmName: { type: String },
    contactNo: { type: String },
    address: { type: String },
    pondCount: { type: Number },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const FarmManagement = mongoose.model('FarmManagement', farmManagementSchema)
module.exports = FarmManagement;