const mongoose = require('mongoose')

const roleSchema = mongoose.Schema({
    roleId: { type: String },
    roleCode: { type: String },
    roleName: { type: String },
    roleDescription: { type: String },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission', required: true }],
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const Role = mongoose.model('Role', roleSchema)
module.exports = Role;