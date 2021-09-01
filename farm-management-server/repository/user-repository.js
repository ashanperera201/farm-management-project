const mongoose = require('mongoose');
const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const roleRepository = require('./role-repository');
const headerReader = require('../helpers/header-reader');
const userPasswordHash = require('../helpers/user-password-hash');
require("dotenv/config");

const environmentConfigs = process.env;

exports.saveUser = async (user) => {
  let createdResult = null;

  const hashedResult = await userPasswordHash.hashPassword(user.password);
  const details = headerReader.getHeaderDetails();
  user.password = hashedResult.passwordHash;
  user.passwordSalt = hashedResult.passwordSalt;
  user.createdBy = details && details.user ? details.user : user.userId;
  user.createdOn = new Date();
  user.clientTenentId = details.clientTenentId;
  user.countryCode = details.countryCode;

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      if (user.roles && user.roles.length === 0) { 
        const defaultRole = await roleRepository.filterRole({ roleCode: 'NORMAL_USER' }, true);
        if (defaultRole && defaultRole.length > 0) {
          user.roles = [];
          user.roles.push(defaultRole[0].id)
        } else {
          user.roles = [];
        }
      }
      createdResult = await userModel.create(user);
      if (createdResult) {
        const passwordInBinary = environmentConfigs.passwordSecret;

        createdResult["password"] = `${passwordInBinary}@!${uuidv4()}#%#${await bcrypt.genSalt(10)}`;
        createdResult["passwordSalt"] = `${passwordInBinary}###${await bcrypt.genSalt(10)}###${uuidv4()}`;
        await session.commitTransaction();
      } else {
        await session.abortTransaction();
      }
    })
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
  }
  return createdResult.toJSON();
};

exports.getUserDetails = async () => {
  return await userModel
    .find({ isActive: true })
    .sort({ createdOn: 'descending' })
    .select("-password -passwordSalt");
};

exports.isExists = async (filterParams) => {
  const query = {
    $or: [
      { userName: filterParams.userName },
      { userEmail: filterParams.userEmail },
      { nic: filterParams.nic },
    ],
  };
  return await userModel.exists(query);
};

exports.filterUser = async (filterParams) => {
  return await userModel
    .find({ ...filterParams, isActive: true })
    .select("-password -passwordSalt");
};

exports.getUserDetail = async (userId) => {
  return await userModel
    .find({ userId: userId })
    .populate({
      path: "roles",
      model: "Role",
      select: "-_id -__v",
      match: { isActive: true },
      populate: {
        path: "permissions",
        match: { isActive: true },
        select: "-_id -__v -permissionId",
        model: "Permission",
      },
    })
    .select("-password -passwordSalt -__v");
};

exports.getUserRolePermissions = async (userId) => {
  const userRole = await userModel
    .find({ userId: userId })
    .populate({
      path: "roles",
      model: "Role",
      select: "-_id -__v",
      match: { isActive: true },
      populate: {
        path: "permissions",
        match: { isActive: true },
        select: "-_id -__v -permissionId",
        model: "Permission",
      },
    })
    .select("_id");
  return userRole;
};

exports.updateUser = async (user) => {
  const options = { upsert: true };
  const filter = { userId: user.userId };

  const currentUser = await this.getUserDetail(user.userId);
  if (currentUser) {
    const details = headerReader.getHeaderDetails();
    currentUser.firstName = user.firstName;
    currentUser.lastName = user.lastName;
    currentUser.middleName = user.middleName;
    currentUser.profilePic = user.profilePic;
    currentUser.createdBy = user.createdBy;
    currentUser.createdOn = user.createdOn;
    currentUser.modifiedBy = details.user;
    currentUser.modifiedOn = new Date();
    currentUser.isActive = user.isActive;
    currentUser.clientTenentId = details.clientId;
    currentUser.countryCode = details.countryCode;
    currentUser.userEmail = user.userEmail;
    currentUser.contact = user.contact;
    currentUser.userAddress = user.userAddress;
    currentUser.nic = user.nic;
    currentUser.passportId = user.passportId;
    currentUser.roles = user.roles;

    const updateDoc = {
      $set: {
        ...currentUser,
      },
    };
    const updatedUser = await userModel.updateOne(filter, updateDoc, options);
    updatedUser["password"] = null;
    updatedUser["passwordSalt"] = null;
    return updatedUser;
  }
};

exports.findUserForAuthentication = async (user) => {
  const query = {
    $or: [{ userEmail: user.userNameOrEmail }, { userName: user.userNameOrEmail }],
  };
  const searchedUser = await userModel.findOne(query).populate({
    path: "roles",
    model: "Role",
    select: "-_id -__v",
    match: { isActive: true },
    populate: {
      path: "permissions",
      match: { isActive: true },
      select: "-_id -__v -permissionId",
      model: "Permission",
    },
  });
  return searchedUser;
};

exports.changePassword = async (passwordChangeRequest) => {
  const user = (
    await this.filterUser({ userEmail: passwordChangeRequest.email })
  )[0];
  if (user) {
    const filter = { _id: user._id };
    user.password = passwordChangeRequest.password;
    user.passwordSalt = passwordChangeRequest.passwordSalt;
    const updateDoc = {
      $set: {
        ...user,
      },
    };
    await userModel.updateOne(filter, updateDoc);
    user.password = null;
    user.passwordSalt = null;
    return {
      message: "updated successfully.",
    };
  }
  return null;
};


exports.deleteUsers = async (payload) => {
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

  const deletedRes = await userModel.deleteMany(query);
  if (deletedRes) {
    return true;
  } else {
    return false;
  }
}
