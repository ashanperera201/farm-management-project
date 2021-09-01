const mongoose = require('mongoose');
const dailyFeedEntity = require('../models/daily-feed');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');

exports.saveDetails = async (dailyFeedings) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    if (dailyFeedings && dailyFeedings.length > 0) {
        dailyFeedings.forEach(sampling => {
            sampling.dailyFeedUniqueId = uuidv4();
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
                const savedResult = await dailyFeedEntity.insertMany(dailyFeedings);
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


exports.saveDetail = async (dailyFeed) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    dailyFeed.dailyFeedUniqueId = uuidv4();
    dailyFeed.isActive = true;
    dailyFeed.createdOn = new Date();
    dailyFeed.createdBy = headerDetails.user;
    dailyFeed.clientTenentId = headerDetails.clientId;
    dailyFeed.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {
            const savedResult = await dailyFeedEntity.create(dailyFeed);
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

exports.udpateDetails = async (dailyFeed) => {

    const headerDetails = headerReader.getHeaderDetails();

    dailyFeed.clientTenentId = headerDetails.clientId;
    dailyFeed.countryCode = headerDetails.countryCode;
    dailyFeed.modifiedBy = headerDetails.user;
    dailyFeed.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { dailyFeedUniqueId: dailyFeed.dailyFeedUniqueId };
    const updateDoc = {
        $set: { ...dailyFeed },
    };
    return await dailyFeedEntity.updateOne(filter, updateDoc, options);
}

exports.getAllDetails = async () => {
    return await dailyFeedEntity.find({ isActive: true })
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

exports.getDetail = async (dailyFeedUniqueId) => {
    return await dailyFeedEntity.find({ isActive: true, dailyFeedUniqueId: dailyFeedUniqueId });
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

    const deletedRes = await dailyFeedEntity.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}