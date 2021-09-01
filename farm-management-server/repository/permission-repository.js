const permissionModel = require('../models/permission')
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');

exports.saveBulkPermission = async (permissionSet) => {
    const details = headerReader.getHeaderDetails();
    permissionSet.forEach(p => {
        p.permissionId = uuidv4();
        p.isActive = true;
        p.createdBy = details && details.user ? details.user : 0;
        p.createdOn = new Date();
        p.modifiedBy = "";
        p.modifiedOn = null;
    })
    return await permissionModel.insertMany(permissionSet)
}

exports.savePermission = async (permission) => {
    const details = headerReader.getHeaderDetails();
    permission.isActive = true;
    permission.createdBy = details && details.user ? details.user : 0;
    permission.createdOn = new Date();
    return await permissionModel.create(permission)
}

exports.getPermissionDetails = async (skipTenentProperties = false) => {
    if (skipTenentProperties) {
        return await permissionModel.find({ isActive: true }).sort({ createdOn: 'descending' });
    } else {
        const details = headerReader.getHeaderDetails();
        const query = { $and: [{ createdBy: details.user }, { isActive: true }] };
        return await permissionModel.find(query).sort({ createdOn: 'descending' });
    }
}

exports.isExistsPermission = async (permission) => {
    return await permissionModel.exists({ permissionCode: permission.permissionCode, permissionName: permission.permissionName })
}

exports.filterByParam = async (param) => {
    return await permissionModel.find({ ...param });
}

exports.filterPermission = async (filterParams, skipbaseProperties = false) => {
    if (skipbaseProperties) {
        const finalQuery = {
            $or: [{ permissionCode: { $regex: filterParams.permissionCode, $options: 'i' } }, { permissionName: filterParams.permissionName }]
        }
        return await permissionModel.find(finalQuery)
    } else {
        const details = headerReader.getHeaderDetails();
        const finalQuery = {
            $or: [{ permissionCode: { $regex: filterParams.permissionCode, $options: 'i' } }, { permissionName: filterParams.permissionName }],
            $and: { createdBy: details.user }
        }
        return await permissionModel.find({ ...finalQuery })
    }
}

exports.getPermission = async (permissionId, skipbaseProperties = false) => {
    if (skipbaseProperties) {
        return await permissionModel.findOne({ permissionId: permissionId }).populate('roleId')
    } else {
        const details = headerReader.getHeaderDetails();
        const query = { $and: [{ createdBy: details.user }, { permissionId: permissionId }, { isActive: true }] };
        return await permissionModel.findOne(query).populate('roleId')
    }
}

exports.updatePermission = async (permission) => {
    const details = headerReader.getHeaderDetails();
    permission.modifiedBy = details && details.user ? details.user : 0;
    permission.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { permissionId: permission.permissionId };
    const updateDoc = {
        $set: { ...permission },
    };
    return await permissionModel.updateOne(filter, updateDoc, options)
}

exports.deletePermission = async (payload) => {
    let query = null;
    if (payload.length === 0) {
        query = { _id: payload[0] };
    } else {
        let queryList = [];
        payload.forEach(e => {
            queryList.push({ _id: e });
        })
        query = { $or: queryList };
    }

    const deletedRes = await permissionModel.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}