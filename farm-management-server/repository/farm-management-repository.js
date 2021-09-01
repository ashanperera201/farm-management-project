const mongoose = require('mongoose');
const farmManagementModel = require('../models/farm-management');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');


exports.saveFarmDetails = async (farmDetail) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    farmDetail.farmUniqueId = uuidv4();
    farmDetail.isActive = true;
    farmDetail.createdOn = new Date();
    farmDetail.createdBy = headerDetails.user;
    farmDetail.clientTenentId = headerDetails.clientId;
    farmDetail.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {

            const savedFarm = await farmManagementModel.create(farmDetail)

            if (savedFarm) {
                response = {};
                response['farmDetail'] = savedFarm;
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

exports.filterFarmDetails = async (filterParam) => {
    let query = {};
    const param = Object.keys(filterParam);
    param.forEach(p => {
        if (filterParam[p]) {
            query[p] = filterParam[p]
        }
    })

    return await farmManagementModel.find({ ...query, isActive: true })
        .populate({
            path: 'owner',
            model: 'ClubMember',
        })
        .sort({ createdOn: 'descending' });
}

exports.updateFarmDetail = async (farmDetail) => {
    const headerDetails = headerReader.getHeaderDetails();
    farmDetail.clientTenentId = headerDetails.clientId;
    farmDetail.countryCode = headerDetails.countryCode;
    farmDetail.modifiedBy = headerDetails.user;
    farmDetail.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { farmUniqueId: farmDetail.farmUniqueId };
    const updateDoc = {
        $set: { ...farmDetail },
    };
    return await farmManagementModel.updateOne(filter, updateDoc, options);
}

exports.getFarmDetails = async () => {
    return await farmManagementModel.find({ isActive: true })
        .populate({
            path: 'owner',
            model: 'ClubMember',
        }).sort({ createdOn: 'descending' });
}

exports.getFarmDetail = async (farmDetailId) => {
    return await farmManagementModel.find({ isActive: true, farmUniqueId: farmDetailId });
}


exports.deleteFarmDetail = async (payload) => {
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

    const deletedRes = await farmManagementModel.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}