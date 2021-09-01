const mongoose = require('mongoose');
const HarvestManagement = require('../models/harvest-management');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');

exports.saveDetails = async (harvestManagement) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    if (harvestManagement && harvestManagement.length > 0) {
        harvestManagement.forEach(harvest => {
            harvest.harvestManagementUniqueId = uuidv4();
            harvest.isActive = true;
            harvest.createdOn = new Date();
            harvest.createdBy = headerDetails.user;
            harvest.clientTenentId = headerDetails.clientId;
            harvest.countryCode = headerDetails.countryCode;
        });

        const session = await mongoose.startSession();

        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };

        try {
            await session.withTransaction(async () => {
                const savedResult = await HarvestManagement.insertMany(harvestManagement);
                if (savedResult) {
                    response = {};
                    response['harvestManagement'] = savedResult;
                    await session.commitTransaction();
                } else {
                    await session.abortTransaction();
                }
            }, transactionOptions);
        } catch (error) {
            await session.abortTransaction();
            throw error;
        }
        session.endSession();
    }
    return response;
}


exports.saveDetail = async (harvestManagement) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    harvestManagement.harvestManagementUniqueId = uuidv4();
    harvestManagement.isActive = true;
    harvestManagement.createdOn = new Date();
    harvestManagement.createdBy = headerDetails.user;
    harvestManagement.clientTenentId = headerDetails.clientId;
    harvestManagement.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {
            const savedResult = await HarvestManagement.create(harvestManagement);
            if (savedResult) {
                response = {};
                response['harvestManagement'] = savedResult;
                await session.commitTransaction();
            } else {
                await session.abortTransaction();
            }
        }, transactionOptions);
    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
    session.endSession();
    return response;
}

exports.updateDetail = async (harvestDetails) => {

    const headerDetails = headerReader.getHeaderDetails();

    harvestDetails.clientTenentId = headerDetails.clientId;
    harvestDetails.countryCode = headerDetails.countryCode;
    harvestDetails.modifiedBy = headerDetails.user;
    harvestDetails.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { harvestManagementUniqueId: harvestDetails.harvestManagementUniqueId };
    const updateDoc = {
        $set: { ...harvestDetails },
    };
    return await HarvestManagement.updateOne(filter, updateDoc, options);
}

exports.filterDetails = async (filterParam) => {
    let query = {};
    const param = Object.keys(filterParam);
    param.forEach(p => {
        if (filterParam[p]) {
            query[p] = filterParam[p]
        }
    })
    return await HarvestManagement.find({ ...query, isActive: true })
        .populate({
            path: 'owner',
            model: 'ClubMember'
        })
        .populate({
            path: 'farmer',
            model: 'FarmManagement'
        })
        .populate({
            path: 'pond',
            model: 'PondManagement'
        })
        .sort({ createdOn: 'descending' });
}


exports.getDetails = async () => {
    return await HarvestManagement.find({ isActive: true })
        .populate({
            path: 'owner',
            model: 'ClubMember'
        })
        .populate({
            path: 'farmer',
            model: 'FarmManagement'
        })
        .populate({
            path: 'pond',
            model: 'PondManagement'
        })
        .sort({ createdOn: 'descending' });
}

exports.getDetail = async (harvestManagementUniqueId) => {
    return await HarvestManagement.find({ isActive: true, harvestManagementUniqueId: harvestManagementUniqueId });
}

exports.deleteDetails = async (payload) => {
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

    const deletedRes = await HarvestManagement.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}