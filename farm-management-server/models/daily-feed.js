const mongoose = require('mongoose')

const dailyFeedSchema = mongoose.Schema({
    dailyFeedUniqueId: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'ClubMember', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmManagement', required: true },
    pond: { type: mongoose.Schema.Types.ObjectId, ref: 'PondManagement', required: true },
    dailyFeedDate: { type: Date, required: true },
    calculatedDailyFeed: { type: Number, required: true },
    actualNumberOfKilos: { type: Number, required: true },
    remark: { type: String },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const DailyFeed = mongoose.model('DailyFeed', dailyFeedSchema)
module.exports = DailyFeed;