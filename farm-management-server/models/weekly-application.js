const mongoose = require('mongoose')

const weeklyApplicationSchema = mongoose.Schema({
    weeklyApplicationUniqueId: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'ClubMember', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmManagement', required: true },
    pond: { type: mongoose.Schema.Types.ObjectId, ref: 'PondManagement', required: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Applications', required: true },
    weekNumber: { type: Number, required: true },
    unit: { type: Number, required: true },
    numberOfUnit: { type: Number, required: true },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const WeeklyApplication = mongoose.model('WeeklyApplication', weeklyApplicationSchema)
module.exports = WeeklyApplication;