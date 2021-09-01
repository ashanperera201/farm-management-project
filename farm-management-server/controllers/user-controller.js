const { v4: uuidv4 } = require("uuid");
const { body, header } = require("express-validator");
const { validationResult } = require("express-validator");
const userManager = require("../business/user/user-manager");
require("dotenv/config");

exports.validateHeaders = () => {
  return [
    header('x-user', 'Header\'s required.').notEmpty(),
    header('x-client', 'Header\'s required.').notEmpty(),
    header('x-country', 'Header\'s required.').notEmpty()
  ]
}

exports.validate = (method) => {
  switch (method) {
    case "saveUser": {
      return [
        body("userName", "user name is required.").exists().notEmpty(),
        body("userEmail", "user email is required.").exists().notEmpty(),
        body("password", "user password is required.").exists().notEmpty(),
        body("nic", "Nic is required").exists().notEmpty(),
      ];
    }
    case "updateUser":
      return [
        body("userName", "user name is required.").exists().notEmpty(),
        body("userEmail", "user email is required.").exists().notEmpty(),
        body("nic", "Nic is required").exists().notEmpty(),
      ];
    case "UserAuthentication":
      return [
        body("userNameOrEmail", "user name is required.").exists().notEmpty(),
        body("password", "user password is required.").exists().notEmpty(),
      ];
    case "changePassword":
      return [
        body("email", "email is required.").exists().notEmpty(),
        body("email", "invalid email.").exists().isEmail(),
        body("password", "password is required.").exists().notEmpty(),
      ];
  }
};

exports.changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const payload = req.body;
      const changePasswordPayload = {
        email: payload.email,
        password: payload.password,
      };
      const userResult = await userManager.changeUserPassword(
        changePasswordPayload
      );
      if (userResult && userResult.validity) {
        res.status(200).json(userResult);
      } else {
        res.status(500).json({ error: userResult.message, success: false });
      }
    } else {
      res.status(422).json({ errors: errors.array() });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error, success: false });
  }
};

exports.UserAuthentication = async (req, res) => {
  try {
    const payload = req.body;
    if (payload) {
      const userPaylod = {
        userNameOrEmail: payload.userNameOrEmail,
        password: payload.password,
      };
      const UserAuthentication = await userManager.authenticateUser(userPaylod);
      if (UserAuthentication && UserAuthentication.validity) {
        res.status(200).json(UserAuthentication);
      } else {
        res.status(401).json(UserAuthentication);
      }
    } else {
      res.status(400).json({ error: "Invalid model", success: false });
    }
  } catch (error) {
    res.status(500).json({ error: error, success: false });
  }
};

exports.saveUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const payload = req.body;
      if (payload) {
        const user = {
          userId: uuidv4(),
          userName: payload.userName,
          firstName: payload.firstName,
          lastName: payload.lastName,
          middleName: payload.middleName,
          userEmail: payload.userEmail,
          password: payload.password,
          contact: payload.contact,
          userAddress: payload.userAddress,
          nic: payload.nic,
          passportId: payload.passportId,
          roles: payload.roles,
          permission: payload.permission,
          profilePic: payload.profilePic,
          isActive: true,
        };
        const savedResult = await userManager.saveUser(user);
        if (savedResult && savedResult.validity) {
          res.status(201).json(savedResult);
        } else {
          res.status(500).json({ error: savedResult.message, success: false });
        }
      } else {
        res.status(400).json({ error: "Invalid model", success: false });
      }
    } else {
      res.status(422).json({ errors: errors.array() });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.stack, success: false });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const userDetails = await userManager.getUserDetails();
      if (userDetails.validity) {
        res.status(200).json(userDetails);
      } else {
        res.status(204).json();
      }
    } else {
      res.status(422).json({ errors: errors.array() });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.stack, success: false });
  }
};

exports.getUserDetail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const userId = req.params.userId;
      if (userId) {
        const user = await userManager.getUser(userId);
        if (user.validity) {
          res.status(200).json(user);
        } else {
          res.status(204).json();
        }
      } else {
        res.status(400).json({ error: "user id required.", success: false });
      }
    } else {
      res.status(422).json({ errors: errors.array() });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.stack, success: false });
  }
};

exports.getFilteredUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const filteredParams = req.body.filterParams;
      if (filteredParams) {
        const userDetails = await userManager.filterUser(filteredParams);
        if (userDetails && userDetails.validity) {
          res.status(200).json(userDetails);
        } else {
          res.status(204).json();
        }
      } else {
        res
          .status(400)
          .json({ error: "Filter params are required.", success: false });
      }
    } else {
      res.status(422).json({ errors: errors.array() });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.stack, success: false });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const payload = req.body;
      if (payload) {
        const user = {
          _id: payload._id,
          userId: payload.userId,
          userName: payload.userName,
          firstName: payload.firstName,
          lastName: payload.lastName,
          middleName: payload.middleName,
          userEmail: payload.userEmail,
          password: payload.password,
          contact: payload.contact,
          userAddress: payload.userAddress,
          nic: payload.nic,
          passportId: payload.passportId,
          roles: payload.roles,
          permission: payload.permission,
          isActive: payload.isActive,
          profilePic: payload.profilePic,
          createdBy: payload.createdBy,
          createdOn: payload.createdOn,
          modifiedBy: payload.modifiedBy,
          modifiedOn: payload.modifiedOn,
          isActive: payload.isActive,
          clientTenentId: payload.clientId,
          countryCode: payload.countryCode
        };

        const updatedResult = await userManager.updateUser(user);
        if (updatedResult && updatedResult.validity) {
          res.status(201).json(updatedResult);
        } else {
          res.status(500).json({ error: updatedResult.error, success: false });
        }
      } else {
        res.status(400).json({ error: "Invalid model", success: false });
      }
    } else {
      res.status(422).json({ errors: errors.array() });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.stack, success: false });
  }
};

exports.getUserRolePermission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const userId = req.params.userId;
      if (userId) {
        const userRolePermission = await userManager.getUserRolePermission(
          userId
        );
        if (
          userRolePermission.validity &&
          userRolePermission.result &&
          userRolePermission.result.length > 0
        ) {
          res.status(201).json(userRolePermission);
        } else {
          res.status(204).json();
        }
      } else {
        res.status(400).json({ error: "user id is required.", success: false });
      }
    } else {
      res.status(422).json({ errors: errors.array() });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.stack, success: false });
  }
};

exports.deleteUsers = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const userIds = JSON.parse(req.body.userIds);
      if (userIds) {
        const deleted = await userManager.deleteUsers(userIds);
        if (deleted && deleted.validity) {
          res.status(200).json(deleted);
        } else {
          res.status(204).json();
        }
      } else {
        res.status(400).json({ error: "user id's is required.", success: false });
      }
    } else {
      res.status(422).json({ errors: errors.array() })
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.stack, success: false });
  }
};
