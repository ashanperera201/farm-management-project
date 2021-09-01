const { v4: uuidv4 } = require('uuid');
const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const roleManager = require('../business/role/role-manager')

exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}

exports.validate = (method) => {
    switch (method) {
        case 'saveRole': {
            return [
                body('roleCode', 'role code is required.').exists().notEmpty(),
                body('roleName', 'role name is required.').exists().notEmpty()
            ]
        }
        case 'updateRole':
            return [
                body('roleCode', 'role code is required.').exists().notEmpty(),
                body('roleName', 'role name is required.').exists().notEmpty()
            ]
    }
}

exports.saveRoles = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (errors && errors.isEmpty()) {
            const roleCollection = req.body
            if (roleCollection && roleCollection.length > 0) {
                const savedResult = await roleManager.saveRoles(roleCollection)
                if (savedResult) {
                    res.status(201).json(savedResult)
                } else {
                    res.status(500).json({ error: 'Failed to save role', success: false })
                }
            } else {
                res.status(400).json({ error: 'Invalid model', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.saveRole = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const payload = req.body
            if (payload) {
                const role = {
                    roleId: uuidv4(),
                    roleCode: payload.roleCode,
                    roleName: payload.roleName,
                    roleDescription: payload.roleDescription,
                    permissions: payload.permissions,
                    isActive: true
                }
                const savedResult = await roleManager.saveRole(role)
                if (savedResult) {
                    res.status(201).json(savedResult)
                } else {
                    res.status(500).json({ error: 'Failed to save role', success: false })
                }
            } else {
                res.status(400).json({ error: 'Invalid model', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.geRoleDetails = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (errors && errors.isEmpty()) {
            const roleDetails = await roleManager.getRoleDetails()
            if (roleDetails.validity && roleDetails.result && roleDetails.result.length > 0) {
                res.status(200).json(roleDetails)
            } else {
                res.status(204).json()
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.getRoleDetail = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (errors && errors.isEmpty()) {
            const roleId = req.params.roleId
            if (roleId) {
                const role = await roleManager.getRole(roleId)
                if (role.validity && role.result) {
                    res.status(200).json(role)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: 'Role id required.', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.getFilteredRole = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const filteredParams = req.body.filterParams
            if (filteredParams) {
                const roleDetails = await roleManager.filterRole(filteredParams)
                if (roleDetails) {
                    res.status(200).json(roleDetails)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: 'Filter params are required.', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.updateRole = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const payload = req.body
            if (payload) {
                const role = {
                    _id: payload._id,
                    roleId: payload.roleId,
                    roleCode: payload.roleCode,
                    roleName: payload.roleName,
                    roleDescription: payload.roleDescription,
                    permissions: payload.permissions,
                    isActive: payload.isActive,
                    createdBy: payload.createdBy,
                    createdOn: payload.createdOn,
                    modifiedBy: payload.modifiedBy,
                    modifiedOn: payload.modifiedOn,
                    isActive: payload.isActive,
                    clientTenentId: payload.clientTenentId,
                    countryCode: payload.countryCode
                }

                const updatedResult = await roleManager.updateRole(role)
                if (updatedResult && updatedResult.validity) {
                    res.status(201).json(updatedResult)
                } else {
                    res.status(500).json({ error: updatedResult.error, success: false })
                }
            } else {
                res.status(400).json({ error: 'Invalid model', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}


exports.deleteRoles = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const roleIds = JSON.parse(req.body.roleIds);
            if (roleIds) {
                const deleted = await roleManager.deleteRoles(roleIds);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "role id is required.", success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}