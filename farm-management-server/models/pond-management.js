const mongoose = require('mongoose')

const pondManagementSchema = mongoose.Schema({
    pondUniqueId: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'ClubMember', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmManagement', required: true },
    pondNo: { type: Number },
    areaOfPond: { type: Number },
    gradeOfPond: { type: String },
    fixedCost: { type: Number },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const PondManagement = mongoose.model('PondManagement', pondManagementSchema)
module.exports = PondManagement;