const mongoose = require('mongoose')

const permissionSchema = mongoose.Schema({
    permissionId: { type: String },
    permissionCode: { type: String },
    permissionName: { type: String },
    permissionDescription: { type: String },
    createdBy: { type: String },
    createdOn: { type: Date },
    modifiedBy: { type: String },
    modifiedOn: { type: Date },
    isActive: { type: Boolean },
    clientTenentId: { type: String },
    countryCode: { type: String }
})

const Permission = mongoose.model('Permission', permissionSchema)
module.exports = Permission;