const mongoose = require('mongoose');
const WeeklySampling = require('../models/weekly-sampling');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');

exports.saveDetails = async (weeklySamplings) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    if (weeklySamplings && weeklySamplings.length > 0) {
        weeklySamplings.forEach(sampling => {
            sampling.samplingUniqueId = uuidv4();
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
                const savedResult = await WeeklySampling.insertMany(weeklySamplings);
                if (savedResult) {
                    response = {};
                    response['weeklySamplings'] = savedResult;
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

exports.saveDetail = async (weeklySampling) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    weeklySampling.samplingUniqueId = uuidv4();
    weeklySampling.isActive = true;
    weeklySampling.createdOn = new Date();
    weeklySampling.createdBy = headerDetails.user;
    weeklySampling.clientTenentId = headerDetails.clientId;
    weeklySampling.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {
            const savedResult = await WeeklySampling.create(weeklySampling);
            if (savedResult) {
                response = {};
                response['weeklySampling'] = savedResult;
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

exports.updateWeeklySampling = async (samplingDetail) => {

    const headerDetails = headerReader.getHeaderDetails();

    samplingDetail.clientTenentId = headerDetails.clientId;
    samplingDetail.countryCode = headerDetails.countryCode;
    samplingDetail.modifiedBy = headerDetails.user;
    samplingDetail.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { samplingUniqueId: samplingDetail.samplingUniqueId };
    const updateDoc = {
        $set: { ...samplingDetail },
    };
    return await WeeklySampling.updateOne(filter, updateDoc, options);
}

exports.filterDetails = async (filterParam) => {
    let query = {};
    const param = Object.keys(filterParam);
    param.forEach(p => {
        if (filterParam[p]) {
            query[p] = filterParam[p]
        }
    })
    return await WeeklySampling.find({ ...query, isActive: true })
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


exports.getWeeklySamplingDetails = async () => {
    return await WeeklySampling.find({ isActive: true })
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

exports.getWeeklySamplingDetail = async (samplingUniqueId) => {
    return await WeeklySampling.find({ isActive: true, samplingUniqueId: samplingUniqueId });
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

    const deletedRes = await WeeklySampling.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}