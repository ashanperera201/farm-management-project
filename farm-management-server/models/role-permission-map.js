const mongoose = require('mongoose')

const rolePermissionMapSchema = mongoose.Schema({
    id: { type: String },
    roles: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    permissions: { type: mongoose.Schema.Types.ObjectId, ref: 'Permission', required: true },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const RolePermission = mongoose.model('RolePermission', rolePermissionMapSchema)
module.exports = RolePermission