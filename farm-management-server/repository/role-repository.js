const roleModel = require('../models/role')
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');

exports.saveRoles = async (roles) => {
    const details = headerReader.getHeaderDetails();
    roles.forEach(r => {
        r.roleId = uuidv4();
        r.isActive = true;
        r.createdBy = details && details.user ? details.user : 0;
        r.createdOn = new Date();
        r.modifiedBy = "";
        r.modifiedOn = null;
        r.clientTenentId = details.clientId;
        r.countryCode = details.countryCode;
    })
    return await roleModel.insertMany(roles);
}

exports.saveRole = async (role) => {
    const details = headerReader.getHeaderDetails();
    role.isActive = true;
    role.createdBy = details && details.user ? details.user : 0;
    role.createdOn = new Date();
    role.clientTenentId = details.clientId;
    role.countryCode = details.countryCode;
    return await roleModel.create(role);
}

exports.getRoleDetails = async (skipBaseProperties = false) => {
    if (skipBaseProperties) {
        return await roleModel.find({ isActive: true }).sort({ createdOn: 'descending' });
    } else {
        const details = headerReader.getHeaderDetails();
        const query = { $and: [{ createdBy: details.user }, { isActive: true }] };
        return await roleModel.find(query).sort({ createdOn: 'descending' });
    }
}

exports.isExistsRole = async (role) => {
    return await roleModel.exists({roleCode: role.roleCode})
}

exports.filterRole = async (filterParams, skipBaseProperties = false) => {
    if (skipBaseProperties) {
        const finalQuery = {
            $or: [{ roleCode: { $regex: filterParams.roleCode, $options: 'i' } }, { roleName: filterParams.roleName }]
        }
        return await roleModel.find(finalQuery)
    } else {
        const details = headerReader.getHeaderDetails();
        const finalQuery = {
            $or: [{ roleCode: { $regex: filterParams.roleCode, $options: 'i' } }, { roleName: filterParams.roleName }],
            $and: { createdBy: details.user }
        }
        return await roleModel.find({ ...finalQuery })
    }
}

exports.getRole = async (roleId, skipBaseProperties = false) => {
    if (skipBaseProperties) {
        return await roleModel.findOne({ roleId: roleId }).populate('permissions')
    } else {
        const details = headerReader.getHeaderDetails();
        const query = { $and: [{ createdBy: details.user }, { roleId: roleId }, { isActive: true }] };
        return await roleModel.findOne(query).populate('permissions')
    }
}

exports.updateRole = async (role) => {
    const details = headerReader.getHeaderDetails();
    role.modifiedBy = details && details.user ? details.user : 0;
    role.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { roleId: role.roleId };
    const updateDoc = {
        $set: { ...role },
    };
    return await roleModel.updateOne(filter, updateDoc, options)
}

exports.deleteRoles = async (payload) => {
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

    const deletedRes = await roleModel.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}
