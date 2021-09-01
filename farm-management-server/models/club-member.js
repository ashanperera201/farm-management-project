const mongoose = require('mongoose')

const clubMemberSchema = mongoose.Schema({
    clubMemberId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    contactNumber: { type: String },
    address: { type: String },
    city: { type: String },
    nic: { type: String },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const ClubMember = mongoose.model('ClubMember', clubMemberSchema)
module.exports = ClubMember;