const permissionRepository = require('../../repository/permission-repository')


exports.saveBulkPermission = async (permissionList) => {
    try {
        const savedPermissions = await permissionRepository.saveBulkPermission(permissionList)
        return {
            validity: true,
            result: savedPermissions
        }

    } catch (error) {
        throw error
    }
}

exports.savePermission = async (permission) => {
    try {
        const isExistsPermission = await permissionRepository.isExistsPermission(permission)
        if (isExistsPermission) {
            return {
                validity: false,
                error: 'Permission already exists'
            }
        } else {
            const savedPermission = await permissionRepository.savePermission(permission)
            return {
                validity: true,
                result: savedPermission
            }
        }
    } catch (error) {
        throw error
    }
}

exports.getPermissionDetails = async () => {
    try {
        const permissionDetails = await permissionRepository.getPermissionDetails(true)
        return {
            validity: true,
            result: permissionDetails
        }
    } catch (error) {
        throw error
    }
}

exports.filterPermission = async (filterParams) => {
    try {
        const filteredPermissions = await permissionRepository.filterPermission({ ...filterParams }, true)
        return {
            validity: true,
            result: filteredPermissions
        }
    } catch (error) {
        throw error
    }
}

exports.getPermission = async (permissionId) => {
    try {
        const permission = await permissionRepository.getPermission(permissionId, true)
        return {
            validity: true,
            result: permission
        }
    } catch (error) {
        throw error
    }
}

exports.updatePermission = async (permission) => {
    const existPermission = await permissionRepository.filterByParam({ permissionCode: permission.permissionCode });
    if (existPermission) {
        const availablePermission = existPermission.some(x => x.permissionId !== permission.permissionId && x.permissionCode === permission.permissionCode);
        if (availablePermission) {
            return {
                validity: false,
                error: 'Permission already exists'
            }
        } else {
            const updatedPermission = await permissionRepository.updatePermission(permission);
            return {
                validity: true,
                result: updatedPermission
            }
        }
    }
}

exports.deletePermission = async (permissionIds) => {
    const deleted = await permissionRepository.deletePermission(permissionIds)
    return {
        validity: true,
        result: deleted
    }
}