const roleRepository = require('../../repository/role-repository')

exports.saveRoles = async (roles) => {
    try {
        const savedRoles = await roleRepository.saveRoles(roles)
        return {
            validity: true,
            result: savedRoles
        }
    } catch (error) {
        throw error
    }
}

exports.saveRole = async (role) => {
    try {
        const isExistsRole = await roleRepository.isExistsRole(role)
        if (isExistsRole) {
            return {
                validity: false,
                result: 'Role is already exists.'
            }
        } else {
            const savedResult = await roleRepository.saveRole(role)
            if (savedResult) {
                return {
                    validity: true,
                    result: savedResult
                }
            } else {
                return {
                    validity: false,
                    result: 'Failed to save role.'
                }
            }
        }
    } catch (error) {
        throw error
    }
}

exports.getRoleDetails = async () => {
    try {
        const roleDetails = await roleRepository.getRoleDetails(true)
        return {
            validity: true,
            result: roleDetails
        }
    } catch (error) {
        throw error
    }
}

exports.filterRole = async (filterParams) => {
    try {
        const filteredRoles = await roleRepository.filterRole({ ...filterParams }, true)
        return {
            validity: true,
            result: filteredRoles
        }
    } catch (error) {
        throw error
    }
}

exports.getRole = async (roleId) => {
    try {
        const role = await roleRepository.getRole(roleId, true)
        return {
            validity: true,
            result: role
        }
    } catch (error) {
        throw error
    }
}

exports.updateRole = async (role) => {
    try {
        const existingRole = await roleRepository.filterRole({ roleCode: role.roleCode }, true);
        const isRoleAvailabe = existingRole.some(x => x.roleId !== role.roleId && x.roleCode === role.roleCode);

        if (isRoleAvailabe) {
            return {
                validity: false,
                result: null,
                error: 'Role is already exists.'
            }
        } else {
            const updatedRole = await roleRepository.updateRole(role)
            return {
                validity: true,
                result: updatedRole
            }
        }
    } catch (error) {
        throw error
    }
}

exports.deleteRoles = async (roleIds) => {
    try {
        const deleted = await roleRepository.deleteRoles(roleIds);
        return {
            validity: true,
            result: deleted
        }
    } catch (error) {
        throw error
    }
}