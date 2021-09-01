const mongoose = require('mongoose')

const feedingPercentageSchema = mongoose.Schema({
    feedingPercentageUniqueId: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'ClubMember', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmManagement', required: true },
    pond: { type: mongoose.Schema.Types.ObjectId, ref: 'PondManagement', required: true },
    averageBodyWeight: { type: Number },
    feedPercentage: { type: Number },
    feedingPercentageDate: { type: Date, default: (new Date()) },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const FeedingPercentage = mongoose.model('FeedingPercentage', feedingPercentageSchema)
module.exports = FeedingPercentage;