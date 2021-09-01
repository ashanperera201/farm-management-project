const mongoose = require('mongoose');
const applicationsModel = require('../models/applications');
const headerReader = require('../helpers/header-reader');
const { v4: uuidv4 } = require('uuid');


exports.saveApplicationsDetails = async (applications) => {
    let response = null;
    const headerDetails = headerReader.getHeaderDetails();

    applications.applicationUniqueId = uuidv4();
    applications.isActive = true;
    applications.createdOn = new Date();
    applications.createdBy = headerDetails.user;
    applications.clientTenentId = headerDetails.clientId;
    applications.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();
    
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {

            const savedFarm = await applicationsModel.create(applications);

            if (savedFarm) {
                response = {};
                response['applications'] = savedFarm;
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

exports.updateApplciations = async (applications) => {
    const headerDetails = headerReader.getHeaderDetails();
    applications.clientTenentId = headerDetails.clientId;
    applications.countryCode = headerDetails.countryCode;
    applications.modifiedBy = headerDetails.user;
    applications.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { applicationUniqueId: applications.applicationUniqueId };
    const updateDoc = {
        $set: { ...applications },
    };

    return await applicationsModel.updateOne(filter, updateDoc, options);
}

exports.getApplicationDetails = async () => {
    return await applicationsModel.find({ isActive: true }).sort({ createdOn: 'descending' });
}

exports.filterDetails = async (filterParam) => {
    let query = {};
    const param = Object.keys(filterParam);
    param.forEach(p => {
        if (filterParam[p]) {
            query[p] = filterParam[p]
        }
    })
    return await applicationsModel.find({ ...query, isActive: true }).sort({ createdOn: 'descending' });
}

exports.getApplication = async (applicationUniqueId) => {
    return await applicationsModel.find({ isActive: true, applicationUniqueId: applicationUniqueId });
}


exports.deleteApplications = async (payload) => {
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

    const deletedRes = await applicationsModel.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}