const mongoose = require('mongoose');
const stockingModel = require('../models/stocking');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');

exports.saveStockingDetails = async (stockingDetails) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    if (stockingDetails && stockingDetails.length > 0) {
        stockingDetails.forEach(stock => {
            stock.stockingUniqueId = uuidv4();
            stock.isActive = true;
            stock.createdOn = new Date();
            stock.createdBy = headerDetails.user;
            stock.clientTenentId = headerDetails.clientId;
            stock.countryCode = headerDetails.countryCode;
        });

        const session = await mongoose.startSession();

        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };

        try {
            await session.withTransaction(async () => {
                const savedResult = await stockingModel.insertMany(stockingDetails);
                if (savedResult) {
                    response = {};
                    response['stockingDetails'] = savedResult;
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


exports.saveStockingDetail = async (stockingDetail) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    stockingDetail.stockingUniqueId = uuidv4();
    stockingDetail.isActive = true;
    stockingDetail.createdOn = new Date();
    stockingDetail.createdBy = headerDetails.user;
    stockingDetail.clientTenentId = headerDetails.clientId;
    stockingDetail.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {
            const savedResult = await stockingModel.create(stockingDetail);
            if (savedResult) {
                response = {};
                response['stockingDetail'] = savedResult;
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

exports.updateStockDetail = async (stockDetail) => {
    const headerDetails = headerReader.getHeaderDetails();
    stockDetail.clientTenentId = headerDetails.clientId;
    stockDetail.countryCode = headerDetails.countryCode;
    stockDetail.modifiedBy = headerDetails.user;
    stockDetail.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { stockingUniqueId: stockDetail.stockingUniqueId };
    const updateDoc = {
        $set: { ...stockDetail },
    };
    return await stockingModel.updateOne(filter, updateDoc, options);
}

exports.getStockDetails = async () => {
    return await stockingModel.find({ isActive: true })
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

exports.getStockDetail = async (stockingUniqueId) => {
    return await stockingModel.find({ isActive: true, stockingUniqueId: stockingUniqueId })
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

    const deletedRes = await stockingModel.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}