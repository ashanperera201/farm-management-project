const { v4: uuidv4 } = require('uuid');
const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const permissionManager = require('../business/permission/permission-manager')

exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}

exports.validate = (method) => {
    switch (method) {
        case 'savePermission': {
            return [
                body('permissionCode', 'permission code is required.').exists().notEmpty(),
                body('permissionName', 'permission name is required.').exists().notEmpty(),
            ]
        }
        case 'updatePermission':
            return [
                body('permissionCode', 'permission code is required.').exists().notEmpty(),
                body('permissionName', 'permission name is required.').exists().notEmpty(),
            ]
    }
}

exports.savePermissionCollection = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (errors && errors.isEmpty()) {
            const permissionCollection = req.body
            if (permissionCollection && permissionCollection.length > 0) {
                const savedResult = await permissionManager.saveBulkPermission(permissionCollection)
                if (savedResult.validity) {
                    res.status(201).json(savedResult)
                } else {
                    res.status(500).json({ error: savedResult.error, success: false })
                }
            } else {
                res.status(400).json({ error: "Invalid model", success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.savePermission = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            const payload = req.body
            if (payload) {
                const permission = {
                    permissionId: uuidv4(),
                    permissionCode: payload.permissionCode,
                    permissionName: payload.permissionName,
                    permissionDescription: payload.permissionDescription,
                    isActive: true
                }

                const savedResult = await permissionManager.savePermission(permission)
                if (savedResult.validity) {
                    res.status(201).json(savedResult)
                } else {
                    res.status(500).json({ error: savedResult.error, success: false })
                }
            } else {
                res.status(400).json({ error: "Invalid model", success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.getPermissionDetails = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (errors && errors.isEmpty()) {
            const permissionDetails = await permissionManager.getPermissionDetails()
            if (permissionDetails) {
                res.status(200).json(permissionDetails)
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

exports.getPermissionDetail = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (errors && errors.isEmpty()) {
            const permissionId = req.params.permissionId
            if (permissionId) {
                const permission = await permissionManager.getPermission(permissionId)
                if (permission) {
                    res.status(200).json(permission)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(500).json({ error: "Permission id is required.", success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.getFilteredPermission = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (errors && errors.isEmpty()) {
            const filteredParams = req.body.filterParams
            if (filteredParams) {
                const permissionDetails = await permissionManager.filterPermission(filteredParams)
                if (permissionDetails) {
                    res.status(200).json(permissionDetails)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "filteredParams are required.", success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return
        }

    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.updatePermission = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            const payload = req.body;
            const permission = {
                _id: payload._id,
                permissionId: payload.permissionId,
                permissionCode: payload.permissionCode,
                permissionName: payload.permissionName,
                permissionDescription: payload.permissionDescription,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode
            }

            const updatedResult = await permissionManager.updatePermission(permission)
            if (updatedResult && updatedResult.validity) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: updatedResult.error, success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.deletePermission = async (req, res) => {
    try {
        const permissionIds = JSON.parse(req.body.permissionIds);
        if (permissionIds) {
            const deleted = await permissionManager.deletePermission(permissionIds);
            if (deleted) {
                res.status(200).json(deleted)
            } else {
                res.status(204).json()
            }
        } else {
            res.status(400).json({ error: "Permission ids required.", success: false })
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}