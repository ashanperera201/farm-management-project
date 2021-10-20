const mongoose = require('mongoose')

const stockingSchema = mongoose.Schema({
    stockingUniqueId: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'ClubMember', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmManagement', required: true },
    pond: { type: mongoose.Schema.Types.ObjectId, ref: 'PondManagement', required: true },
    plCount: { type: Number, required: true },
    plAge: { type: Number, required: true },
    dateOfStocking: { type: Date, required: true },
    fullStocked: { type: Boolean, required: true },
    plPrice: { type: Number, required: true },
    actualPlRemains: { type: Number, required: true },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String },
    cycle: { type: String }
})

const Stocking = mongoose.model('Stocking', stockingSchema)
module.exports = Stocking;