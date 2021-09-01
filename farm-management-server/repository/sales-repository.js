const mongoose = require('mongoose');
const salesModel = require('../models/sales');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');

exports.saveDetails = async (sales) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    if (sales && sales.length > 0) {
        sales.forEach(sampling => {
            sampling.salesUniqueId = uuidv4();
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
                const savedResult = await salesModel.insertMany(sales);
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


exports.saveDetail = async (sale) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    sale.salesUniqueId = uuidv4();
    sale.isActive = true;
    sale.createdOn = new Date();
    sale.createdBy = headerDetails.user;
    sale.clientTenentId = headerDetails.clientId;
    sale.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {
            const savedResult = await salesModel.create(sale);
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

exports.udpateDetails = async (sale) => {

    const headerDetails = headerReader.getHeaderDetails();

    sale.clientTenentId = headerDetails.clientId;
    sale.countryCode = headerDetails.countryCode;
    sale.modifiedBy = headerDetails.user;
    sale.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { salesUniqueId: sale.salesUniqueId };
    const updateDoc = {
        $set: { ...sale },
    };
    return await salesModel.updateOne(filter, updateDoc, options);
}

exports.filterDetails = async (filterParam) => {
    let query = {};
    const param = Object.keys(filterParam);
    param.forEach(p => {
        if (filterParam[p]) {
            query[p] = filterParam[p]
        }
    })
    return await salesModel.find({ ...query, isActive: true }).sort({ createdOn: 'descending' });
}

exports.getAllDetails = async () => {
    return await salesModel.find({ isActive: true }).sort({ createdOn: 'descending' });
}

exports.getDetail = async (salesUniqueId) => {
    return await salesModel.find({ isActive: true, salesUniqueId: salesUniqueId });
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

    const deletedRes = await salesModel.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}