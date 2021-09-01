const mongoose = require('mongoose')

const weeklyPerformanceSchema = mongoose.Schema({
    weeklyPerformanceUniqueId: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'ClubMember', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmManagement', required: true },
    pond: { type: mongoose.Schema.Types.ObjectId, ref: 'PondManagement', required: true },
    weekNumber: { type: Number, required: true },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const WeeklyPerformance = mongoose.model('WeeklyPerformance', weeklyPerformanceSchema)
module.exports = WeeklyPerformance;