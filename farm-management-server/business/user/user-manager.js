const { v4: uuidv4 } = require("uuid");
const userRepository = require("../../repository/user-repository");
const userPermissionRepo = require("../../repository/role-permission-repository");
const userValidater = require("./user-validator");
const userPasswordHash = require('../../helpers/user-password-hash');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config({ path: `./env-${process.env.NODE_ENV}.env` })

const environmentConfigs = process.env;

exports.changeUserPassword = async (userPasswordChangeRequest) => {
  try {
    const hashedResult = await userPasswordHash.hashPassword(userPasswordChangeRequest.password);
    const userPasswordChangeEntity = {
      email: userPasswordChangeRequest.email,
      password: hashedResult.passwordHash,
      passwordSalt: hashedResult.passwordSalt,
    };
    const userChangedResult = await userRepository.changePassword(userPasswordChangeEntity);
    if (userChangedResult) {
      return {
        validity: true,
        result: userChangedResult,
      };
    } else {
      return {
        validity: false,
        message: "Failed to change password.",
      };
    }
  } catch (error) {
    throw error;
  }
};

exports.authenticateUser = async (userRequest) => {
  try {
    const user = await userRepository.findUserForAuthentication(userRequest);
    if (user) {
      const isPasswordValidated = await bcrypt.compare(userRequest.password, user.password);
      if (isPasswordValidated) {
        const userToken = jwt.sign({
          userId: user.userId,
          userEmail: user.userEmail
        },
          `${environmentConfigs.applicationSecret}`,
          { expiresIn: environmentConfigs.tokenExpiration }
        );
        return {
          validity: true,
          result: {
            userId: user.userId,
            accessToken: userToken,
          },
        };
      } else {
        return {
          validity: false,
          error: "invalid password.",
        };
      }
    } else {
      return {
        validity: false,
        error: "User name or email is invalid.",
      };
    }
  } catch (error) {
    throw error;
  }
};

exports.saveUser = async (user) => {
  try {
    const filterParam = userValidater.validateFilterParamForUser(user);
    const existsUsers = await userRepository.isExists({ ...filterParam });
    if (existsUsers) {
      return {
        message: "Specified user is already exists",
        validity: false,
      };
    } else {
      const savedUser = await userRepository.saveUser({ ...user });
      return {
        validity: true,
        result: savedUser,
      };
    }
  } catch (error) {
    throw error;
  }
};

exports.getUserDetails = async () => {
  try {
    const userDetails = await userRepository.getUserDetails();
    return {
      validity: true,
      result: userDetails,
    };
  } catch (error) {
    throw error;
  }
};

exports.filterUser = async (filterParams) => {
  try {
    const filteredUser = await userRepository.filterUser({ ...filterParams });
    return {
      validity: true,
      result: filteredUser,
    };
  } catch (error) {
    throw error;
  }
};

exports.getUser = async (userId) => {
  try {
    const userResult = await userRepository.getUserDetail(userId);
    return {
      validity: true,
      result: userResult,
    };
  } catch (error) {
    throw error;
  }
};

exports.getUserRolePermission = async (userId) => {
  try {
    const userRolePermission = await userRepository.getUserRolePermissions(userId);
    return {
      validity: true,
      result: userRolePermission,
    };
  } catch (error) {
    throw error;
  }
};

exports.updateUser = async (user) => {
  try {
    const existsUsers = await userRepository.filterUser({ userEmail: user.userEmail });
    const isDuplicated = existsUsers.some(x => x.userId !== user.userId && x.userEmail === user.userEmail);
    if (isDuplicated) {
      return {
        validity: false,
        result: null,
        error: 'User already exists.'
      };
    } else {
      const updatedUser = await userRepository.updateUser(user);
      return {
        validity: true,
        result: updatedUser,
        error: null
      };
    }
  } catch (error) {
    throw error;
  }
};

exports.deleteUsers = async (userIds) => {
  try {
    const deletedResult = await userRepository.deleteUsers(userIds);
    return {
      validity: true,
      result: deletedResult,
    };
  } catch (error) {
    throw error;
  }
};

exports.getAllMappedUserPermission = async () => {
  try {
    const mappedUserPermission = await userPermissionRepo.getAllMappedUserPermission();
    return mappedUserPermission;
  } catch (error) {
    throw error;
  }
};

exports.mapUserPermission = async (userPermission) => {
  try {
    const userPermissionSavedResult = await userPermissionRepo.mapUserRolePremission(
      userPermission
    );
    return userPermissionSavedResult;
  } catch (error) {
    throw error;
  }
};
