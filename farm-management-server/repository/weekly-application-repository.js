const mongoose = require('mongoose');
const weeklyApplication = require('../models/weekly-application');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');

exports.saveDetails = async (weeklyApplications) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    if (weeklyApplications && weeklyApplications.length > 0) {
        weeklyApplications.forEach(sampling => {
            sampling.weeklyApplicationUniqueId = uuidv4();
            sampling.isActive = true;
            sampling.createdOn = new Date();
            sampling.createdBy = headerDetails.user;
            sampling.clientTenentId = headerDetails.clientId;
            sampling.countryCode = headerDetails.countryCode;
        });

        const session = await mongoose.startSession();

        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };

        try {
            await session.withTransaction(async () => {
                const savedResult = await weeklyApplications.insertMany(weeklyApplications);
                if (savedResult) {
                    response = {};
                    response = savedResult;
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


exports.saveDetail = async (weeklyApp) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    weeklyApp.weeklyApplicationUniqueId = uuidv4();
    weeklyApp.isActive = true;
    weeklyApp.createdOn = new Date();
    weeklyApp.createdBy = headerDetails.user;
    weeklyApp.clientTenentId = headerDetails.clientId;
    weeklyApp.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {
            const savedResult = await weeklyApplication.create(weeklyApp);
            if (savedResult) {
                response = {};
                response = savedResult;
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

exports.udpateDetails = async (weeklyApp) => {

    const headerDetails = headerReader.getHeaderDetails();

    weeklyApp.clientTenentId = headerDetails.clientId;
    weeklyApp.countryCode = headerDetails.countryCode;
    weeklyApp.modifiedBy = headerDetails.user;
    weeklyApp.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { weeklyApplicationUniqueId: weeklyApp.weeklyApplicationUniqueId };
    const updateDoc = {
        $set: { ...weeklyApp },
    };
    return await weeklyApplication.updateOne(filter, updateDoc, options);
}

exports.filterDetails = async (filterParam) => {
    let query = {};
    const param = Object.keys(filterParam);
    param.forEach(p => {
        if (filterParam[p]) {
            query[p] = filterParam[p]
        }
    })
    return await weeklyApplication.find({ ...query, isActive: true })
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
        .populate({
            path: 'application',
            model: 'Applications'
        })
        .sort({ createdOn: 'descending' });
}


exports.getAllDetails = async () => {
    return await weeklyApplication.find({ isActive: true })
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
        .populate({
            path: 'application',
            model: 'Applications'
        })
        .sort({ createdOn: 'descending' });
}

exports.getDetail = async (weeklyApplicationUniqueId) => {
    return await weeklyApplication.find({ isActive: true, weeklyApplicationUniqueId: weeklyApplicationUniqueId });
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

    const deletedRes = await weeklyApplication.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}