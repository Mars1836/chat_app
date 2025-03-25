const AES = require("../common/aes");

const decryptUser = (user, password) => {
  return {
    ...user,
    citizenIdentificationCard: AES.decrypt(
      user.citizenIdentificationCard,
      password
    ),
    gender: AES.decrypt(user.gender, password),
    dateOfBirth: AES.decrypt(user.dateOfBirth, password),
    address: AES.decrypt(user.address, password),
    phoneNumber: AES.decrypt(user.phoneNumber, password),
    privateKey: AES.decrypt(user.privateKey, password),
  };
};
const maskingUser = (user) => {
  return {
    ...user,
    citizenIdentificationCard: "********",
    address: "********",
    phoneNumber: "********",
    dateOfBirth: "********",
  };
};
const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};
module.exports = { decryptUser, maskingUser, generateId };
