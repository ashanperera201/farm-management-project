const mongoose = require('mongoose')

const harvestManagementSchema = mongoose.Schema({
    harvestManagementUniqueId: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'ClubMember', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmManagement', required: true },
    pond: { type: mongoose.Schema.Types.ObjectId, ref: 'PondManagement', required: true },
    harvestDate: { type: String },
    harvestType: { type: String },
    harvestQuantity: { type: Number },
    harvestAWB: { type: Number },
    harvestSalePrice: { type: Number },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const HarvestManagementSchema = mongoose.model('harvestManagementSchema', harvestManagementSchema)
module.exports = HarvestManagementSchema;