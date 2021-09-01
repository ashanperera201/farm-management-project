const mongoose = require('mongoose')

const weeklySamplingSchema = mongoose.Schema({
    samplingUniqueId: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'ClubMember', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmManagement', required: true },
    pond: { type: mongoose.Schema.Types.ObjectId, ref: 'PondManagement', required: true },
    samplingDate: { type: Date },
    dateOfCulture: { type: String },
    totalWeight: { type: Number },
    totalShrimp: { type: Number },
    averageBodyWeight: { type: Number },
    previousAwb: { type: String },
    previousAwbAfterHarvesting: { type: String },
    gainInWeight: { type: String },
    expectedSurvivalPercentage: { type: Number },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const WeeklySampling = mongoose.model('WeeklySampling', weeklySamplingSchema)
module.exports = WeeklySampling;