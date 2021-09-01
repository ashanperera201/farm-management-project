const mongoose = require('mongoose');
const WeeklyPerformance = require('../models/weekly-performance');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');

exports.saveDetails = async (weeklyPerformance) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    if (weeklyPerformance && weeklyPerformance.length > 0) {
        weeklyPerformance.forEach(sampling => {
            sampling.weeklyPerformanceUniqueId = uuidv4();
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
                const savedResult = await WeeklyPerformance.insertMany(weeklyPerformance);
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


exports.saveDetail = async (weeklyPerformance) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    weeklyPerformance.weeklyPerformanceUniqueId = uuidv4();
    weeklyPerformance.isActive = true;
    weeklyPerformance.createdOn = new Date();
    weeklyPerformance.createdBy = headerDetails.user;
    weeklyPerformance.clientTenentId = headerDetails.clientId;
    weeklyPerformance.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {
            const savedResult = await WeeklyPerformance.create(weeklyPerformance);
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

exports.updateDetails = async (weeklyPerformance) => {

    const headerDetails = headerReader.getHeaderDetails();

    weeklyPerformance.clientTenentId = headerDetails.clientId;
    weeklyPerformance.countryCode = headerDetails.countryCode;
    weeklyPerformance.modifiedBy = headerDetails.user;
    weeklyPerformance.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { weeklyPerformanceUniqueId: weeklyPerformance.weeklyPerformanceUniqueId };
    const updateDoc = {
        $set: { ...weeklyPerformance },
    };
    return await WeeklyPerformance.updateOne(filter, updateDoc, options);
}

exports.getDetails = async () => {
    return await WeeklyPerformance.find({ isActive: true })
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

exports.getDetail = async (weeklyPerformanceUniqueId) => {
    return await WeeklyPerformance.find({ isActive: true, weeklyPerformanceUniqueId: weeklyPerformanceUniqueId })
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
        });
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

    const deletedRes = await WeeklyPerformance.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}