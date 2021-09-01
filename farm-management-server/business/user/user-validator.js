exports.validateFilterParamForUser = (user) => {
  const filterParam = {};

  if (user.userName) {
    filterParam["userName"] = user.userName;
  }

  if (user.userEmail) {
    filterParam["userEmail"] = user.userEmail;
  }

  if (user.nic) {
    filterParam["nic"] = user.nic;
  }

  return { ...filterParam };
};
