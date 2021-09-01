const mongoose = require('mongoose');
const feedBrandModel = require('../models/feed-brand');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');


exports.saveFeedBrand = async (feedBrand) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    feedBrand.feedBrandUniqueId = uuidv4();
    feedBrand.isActive = true;
    feedBrand.createdOn = new Date();
    feedBrand.createdBy = headerDetails.user;
    feedBrand.clientTenentId = headerDetails.clientId;
    feedBrand.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {

            const savedFarm = await feedBrandModel.create(feedBrand);

            if (savedFarm) {
                response = {};
                response['feedBrand'] = savedFarm;
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

exports.udpateFeedBrand = async (feedBrand) => {
    const headerDetails = headerReader.getHeaderDetails();
    feedBrand.clientTenentId = headerDetails.clientId;
    feedBrand.countryCode = headerDetails.countryCode;
    feedBrand.modifiedBy = headerDetails.user;
    feedBrand.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { feedBrandUniqueId: feedBrand.feedBrandUniqueId };
    const updateDoc = {
        $set: { ...feedBrand },
    };

    return await feedBrandModel.updateOne(filter, updateDoc, options);
}

exports.filterFeedBrand = async (filterParam) => {
    return await feedBrandModel.find({ ...filterParam, isActive: true }).sort({ createdOn: 'descending' });
}

exports.getFeedBrandDetails = async () => {
    return await feedBrandModel.find({ isActive: true }).sort({ createdOn: 'descending' });
}

exports.getFeedBrand = async (feedBrandUniqueId) => {
    return await feedBrandModel.find({ isActive: true, feedBrandUniqueId: feedBrandUniqueId });
}


exports.deleteFeedBrand = async (payload) => {
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

    const deletedRes = await feedBrandModel.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}