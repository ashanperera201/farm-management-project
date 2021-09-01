const rolePermissionModel = require('../models/role-permission-map')


exports.mapUserRolePremission = async (userRole) => {
    const userPermissionSavedResult = await rolePermissionModel.create(userRole)
    return userPermissionSavedResult
}

exports.getAllMappedUserPermission = async () => {
    const mappedUserPermissionDetails = await rolePermissionModel.find().populate('user').populate('roles')
    return mappedUserPermissionDetails
}