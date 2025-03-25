const { connection } = require("./database");
const AES = require("../common/aes");
const { decryptUser, maskingUser, generateId } = require("./util");
const { generateKeyPair } = require("../common/rsa");
const signUpService = async ({
  citizenIdentificationCard,
  username,
  name,
  password,
  gender,
  dateOfBirth,
  address,
  phoneNumber,
}) => {
  const encryptedCitizenIdentificationCard = AES.encrypt(
    citizenIdentificationCard,
    password
  );
  const encryptedPassword = AES.encrypt(password, password);
  const encryptedGender = AES.encrypt(gender, password);
  const encryptedDateOfBirth = AES.encrypt(dateOfBirth, password);
  const encryptedAddress = AES.encrypt(address, password);
  const encryptedPhoneNumber = AES.encrypt(phoneNumber, password);
  const { publicKey, privateKey } = await generateKeyPair();
  const encryptedPrivateKey = AES.encrypt(privateKey, password);
  const query1 = `SELECT * FROM users WHERE username=? OR citizenIdentificationCard=?`;
  const id = generateId();
  const results = await connection.queryPromise(query1, [
    username,
    citizenIdentificationCard,
  ]);
  if (results.length > 0) {
    throw new Error("Người dùng đã tồn tại");
  }
  // insert user to database
  const query = `INSERT INTO users (id, citizenIdentificationCard, username, name, password, gender, dateOfBirth, address, phoneNumber, publicKey, privateKey) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  try {
    const result = await connection.queryPromise(query, [
      id,
      encryptedCitizenIdentificationCard,
      username,
      name,
      encryptedPassword,
      encryptedGender,
      encryptedDateOfBirth,
      encryptedAddress,
      encryptedPhoneNumber,
      publicKey,
      encryptedPrivateKey,
    ]);
    return result;
  } catch (err) {
    if (err.errno === 1062) {
      throw new Error("Người dùng đã tồn tại");
    } else {
      throw new Error(err.message);
    }
  }
};
const signInService = async (username, password) => {
  const encryptedPassword = AES.encrypt(password, password);
  const query = `SELECT id, citizenIdentificationCard, username, name,
   gender, dateOfBirth, address, phoneNumber, publicKey, privateKey 
   FROM users WHERE username='${username}' AND password='${encryptedPassword}'`;
  const results = await connection.queryPromise(query);
  if (results.length === 0) {
    throw new Error("Tài khoản hoặc mật khẩu không đúng");
  }
  return decryptUser(results[0], password);
};
const signInServiceV2 = async (username, password) => {
  const encryptedPassword = AES.encrypt(password, password);
  const query = `SELECT id, citizenIdentificationCard, username, name,
   gender, dateOfBirth, address, phoneNumber, publicKey, privateKey 
  FROM users WHERE username=? AND password=?`;
  const results = await connection.queryPromise(query, [
    username,
    encryptedPassword,
  ]);
  if (results.length === 0) {
    throw new Error("Tài khoản hoặc mật khẩu không đúng");
  }
  return decryptUser(results[0], password);
};

const getUsersService = async () => {
  const query = `SELECT id, citizenIdentificationCard, username, name, gender, dateOfBirth, address, phoneNumber, publicKey FROM users`;
  const results = await connection.queryPromise(query);
  return results;
};
const getOtherUsersService = async (username) => {
  const query = `SELECT id, citizenIdentificationCard, username, name, gender, dateOfBirth, address, phoneNumber, publicKey FROM users WHERE username != '${username}'`;
  const results = await connection.queryPromise(query);
  return results;
};
const getUserByIdService = async (id) => {
  const query = `SELECT id, citizenIdentificationCard, username, name, gender, dateOfBirth, address, phoneNumber, publicKey FROM users WHERE id='${id}'`;
  const results = await connection.queryPromise(query);
  return results[0];
};
const getMessagesService = async (senderId, receiverId) => {
  const chatId = [senderId, receiverId].sort().join("-");
  const query = `SELECT * FROM messages WHERE chatId = ? ORDER BY timestamp ASC`;
  const results = await connection.queryPromise(query, [chatId]);
  return results;
};
const getUserByUsernameService = async (username) => {
  const query = `SELECT id, citizenIdentificationCard, username, name, gender, dateOfBirth, address, phoneNumber, publicKey FROM users WHERE username=?`;
  const results = await connection.queryPromise(query, [username]);
  if (results.length === 0) {
    throw new Error("Người dùng không tồn tại");
  }
  return maskingUser(results[0]);
};
module.exports = {
  signUpService,
  signInService,
  getUsersService,
  getUserByIdService,
  getMessagesService,
  getUserByUsernameService,
  getOtherUsersService,
  signInServiceV2,
};
