const mongoose = require('mongoose')

const feedBrandSchema = mongoose.Schema({
    feedBrandUniqueId: { type: String },
    brandName: { type: String },
    grades: { type: String },
    shrimpWeight: { type: Number },
    price: { type: Number },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const FeedBrand = mongoose.model('FeedBrand', feedBrandSchema)
module.exports = FeedBrand;