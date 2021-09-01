const mongoose = require('mongoose');
const pondManagementModel = require('../models/pond-management');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');


exports.savePondDetails = async (pondDetail) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    pondDetail.pondUniqueId = uuidv4();
    pondDetail.isActive = true;
    pondDetail.createdOn = new Date();
    pondDetail.createdBy = headerDetails.user;
    pondDetail.clientTenentId = headerDetails.clientId;
    pondDetail.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {

            const savedFarm = await pondManagementModel.create(pondDetail);

            if (savedFarm) {
                response = {};
                response['pondDetail'] = savedFarm;
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

exports.updatePondDetail = async (pondDetail) => {
    const headerDetails = headerReader.getHeaderDetails();
    pondDetail.clientTenentId = headerDetails.clientId;
    pondDetail.countryCode = headerDetails.countryCode;
    pondDetail.modifiedBy = headerDetails.user;
    pondDetail.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { pondUniqueId: pondDetail.pondUniqueId };
    const updateDoc = {
        $set: { ...pondDetail },
    };
    return await pondManagementModel.updateOne(filter, updateDoc, options);
}

exports.filterPondDetails = async (filterParam) => {
    return await pondManagementModel.find({ ...filterParam, isActive: true })
        .populate({
            path: 'owner',
            model: 'ClubMember'
        })
        .populate({
            path: 'farmer',
            model: 'FarmManagement'
        })
        .sort({ createdOn: 'descending' });
}

exports.getPondDetails = async () => {
    return await pondManagementModel.find({ isActive: true })
        .populate({
            path: 'owner',
            model: 'ClubMember'
        })
        .populate({
            path: 'farmer',
            model: 'FarmManagement'
        })
        .sort({ createdOn: 'descending' });
}

exports.getPondDetail = async (pondDetailId) => {
    return await pondManagementModel.find({ isActive: true, pondUniqueId: pondDetailId });
}


exports.deletePondDetail = async (payload) => {
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

    const deletedRes = await pondManagementModel.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}