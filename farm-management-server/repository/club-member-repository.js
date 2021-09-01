const mongoose = require('mongoose');
const userModel = require('../models/user');
const clubMemberModel = require('../models/club-member');
const userRepository = require('./user-repository');
const headerReader = require('../helpers/header-reader');
const userPasswordHash = require("../helpers/user-password-hash");

const { v4: uuidv4 } = require('uuid');


exports.saveClubMember = async (clubMember) => {
    let response = { clubMember: null, user: null };
    const headerDetails = headerReader.getHeaderDetails();

    clubMember.clubMemberId = uuidv4();
    clubMember.isActive = true;
    clubMember.createdOn = new Date();
    clubMember.createdBy = headerDetails.user;
    clubMember.clientTenentId = headerDetails.clientId;
    clubMember.countryCode = headerDetails.countryCode;

    const session = await mongoose.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {

            const savedClubMember = await clubMemberModel.create(clubMember);

            if (savedClubMember) {
                console.log("Club Member successfully saved.");
                response = {};
                response['clubMember'] = savedClubMember;

                if (clubMember.userName) {
                    const user = {
                        userId: uuidv4(),
                        userName: clubMember.userName,
                        firstName: clubMember.firstName,
                        lastName: clubMember.lastName,
                        middleName: null,
                        userEmail: clubMember.email,
                        contact: clubMember.contactNumber,
                        userAddress: clubMember.address,
                        nic: clubMember.nic,
                        passportId: null,
                        isActive: true,
                    };
                    const isUserExists = await userRepository.isExists({ userName: clubMember.userName });
                    if (isUserExists) {
                        console.log("User is already exists moving to commit the transaction.");
                    } else {
                        const hashedResult = await userPasswordHash.hashPassword(clubMember.password);
                        user.password = hashedResult.passwordHash;
                        user.passwordSalt = hashedResult.passwordSalt;
                        user.createdBy = headerDetails.user;

                        const savedUser = await userModel.create(user);
                        if (savedUser) {
                            savedUser.password = null;
                            savedUser.passwordSalt = null;
                            response['user'] = savedUser;
                            console.log("User successfully saved.");
                            await session.commitTransaction();
                        }
                    }
                } else {
                    await session.abortTransaction();
                }
            } else {
                await session.commitTransaction();
            }
        }, transactionOptions);
    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
    session.endSession();
    return response;
}

exports.updateClubMember = async (clubMember) => {
    const headerDetails = headerReader.getHeaderDetails();
    clubMember.clientTenentId = headerDetails.clientId;
    clubMember.countryCode = headerDetails.countryCode;
    clubMember.modifiedBy = headerDetails.user;
    clubMember.modifiedOn = new Date();

    const options = { upsert: true };
    const filter = { clubMemberId: clubMember.clubMemberId };
    const updateDoc = {
        $set: { ...clubMember },
    };
    return await clubMemberModel.updateOne(filter, updateDoc, options);
}

exports.filterClubMemberDetails = async (filterParam) => {
    let query = {};
    const param = Object.keys(filterParam);
    param.forEach(p => {
        if (filterParam[p]) {
            query[p] = filterParam[p]
        }
    })
    return await clubMemberModel.find({ ...query, isActive: true }).sort({ createdOn: 'descending' });
}

exports.getClubMemberDetails = async () => {
    return await clubMemberModel.find({ isActive: true }).sort({ createdOn: 'descending' });
}

exports.getClubMemberDetail = async (clubMemberId) => {
    return await clubMemberModel.find({ isActive: true, clubMemberId: clubMemberId });
}

exports.deleteClubMembers = async (payload) => {
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

    const deletedRes = await clubMemberModel.deleteMany(query);
    if (deletedRes) {
        return true;
    } else {
        return false;
    }
}