const mongoose = require('mongoose');
const FeedingPercentage = require('../models/feeding-percentage');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');

exports.saveDetails = async (feedingPercentage) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    if (feedingPercentage && feedingPercentage.length > 0) {
        feedingPercentage.forEach(percentage => {
            percentage.feedingPercentageUniqueId = uuidv4();
            percentage.isActive = true;
            percentage.createdOn = new Date();
            percentage.createdBy = headerDetails.user;
            percentage.clientTenentId = headerDetails.clientId;
            percentage.countryCode = headerDetails.countryCode;
        });

        const session = await mongoose.startSession();

        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };

        try {
            await session.withTransaction(async () => {
                const savedResult = await FeedingPercentage.insertMany(feedingPercentage);
                if (savedResult) {
                    response = {};
                    response['feedingPercentage'] = savedResult;
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


exports.saveDetail = async (feedingPercentage) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    feedingPercentage.feedingPercentageUniqueId = uuidv4();
    feedingPercentage.isActive = true;
    feedingPercentage.createdOn = new Date();
    feedingPercentage.createdBy = headerDetails.user;
    feedingPercentage.clientTenentId = headerDetails.clientId;
    feedingPercentage.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {
            const savedResult = await FeedingPercentage.create(feedingPercentage);
            if (savedResult) {
                response = {};
                response['feedingPercentage'] = savedResult;
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

exports.updatefeedingPercentage = async (feedingPercentageDetails) => {

    const headerDetails = headerReader.getHeaderDetails();

    feedingPercentageDetails.clientTenentId = headerDetails.clientId;
    feedingPercentageDetails.countryCode = headerDetails.countryCode;
    feedingPercentageDetails.modifiedBy = headerDetails.user;
    feedingPercentageDetails.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { feedingPercentageUniqueId: feedingPercentageDetails.feedingPercentageUniqueId };
    const updateDoc = {
        $set: { ...feedingPercentageDetails },
    };
    return await FeedingPercentage.updateOne(filter, updateDoc, options);
}

exports.getfeedingPercentageDetails = async () => {
    return await FeedingPercentage.find({ isActive: true })
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

exports.getfeedingPercentageDetail = async (feedingPercentageUniqueId) => {
    return await FeedingPercentage.find({ isActive: true, feedingPercentageUniqueId: feedingPercentageUniqueId })
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

exports.filterDetails = async (filterParam) => {
    let query = {};
    const param = Object.keys(filterParam);
    param.forEach(p => {
        if (filterParam[p]) {
            query[p] = filterParam[p]
        }
    })
    return await FeedingPercentage.find({ ...query, isActive: true })
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

    const deletedRes = await FeedingPercentage.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}