const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "baomat",
});
const { generateKeyPair } = require("../common/rsa");
connection.connect();
connection.queryPromise = function (query, params) {
  return new Promise((resolve, reject) => {
    this.query(query, params, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
const { firstData } = require("./first_data");

// setup thuật toán mã hóa
var AES = require("../common/aes");
const { generateId } = require("./util");
const { use } = require("./route");

// create table if not exists
function createTable() {
  connection.query(
    "CREATE TABLE IF NOT EXISTS users (id VARCHAR(255) PRIMARY KEY, citizenIdentificationCard VARCHAR(255), username VARCHAR(255), name VARCHAR(255), password VARCHAR(255), gender VARCHAR(255), dateOfBirth VARCHAR(255), address VARCHAR(255), phoneNumber VARCHAR(255), publicKey VARCHAR(255), privateKey VARCHAR(255))",
    function (err, results) {
      if (err) {
        return console.log(err.message);
      }

      let isErrorOccurred = false;

      // insert sample data
      firstData.forEach((user) => {
        const {
          username,
          name,
          password,
          citizenIdentificationCard,
          gender,
          dateOfBirth,
          address,
          phoneNumber,
        } = user;

        encryptedCitizenIdentificationCard = AES.encrypt(
          citizenIdentificationCard,
          password
        );

        encryptedPassword = AES.encrypt(password, password);
        encryptedGender = AES.encrypt(gender, password);
        encryptedDateOfBirth = AES.encrypt(dateOfBirth, password);
        encryptedAddress = AES.encrypt(address, password);
        encryptedPhoneNumber = AES.encrypt(phoneNumber, password);
        const id = generateId();
        // insert user to database ( mã hóa dữ liệu trước khi insert vào db )
        const { publicKey, privateKey } = generateKeyPair();
        encryptedPrivateKey = AES.encrypt(privateKey, password);
        const query = `INSERT INTO users (id, citizenIdentificationCard, username, name, password, gender, dateOfBirth, address, phoneNumber, publicKey, privateKey) VALUES ('${id}', '${encryptedCitizenIdentificationCard}', '${username}', '${name}', '${encryptedPassword}', '${encryptedGender}', '${encryptedDateOfBirth}', '${encryptedAddress}', '${encryptedPhoneNumber}', '${publicKey}', '${encryptedPrivateKey}')`;

        connection.query(query, function (err) {
          if (err) {
            console.log(err.message);
            isErrorOccurred = true;
            return;
          }
        });
      });

      if (!isErrorOccurred) {
        console.log("Insert sample data success");
      }
    }
  );
}

function createMessageTable() {
  connection.query(
    `
    CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR(255) PRIMARY KEY,
      chatId VARCHAR(255),
      text TEXT,
      senderId VARCHAR(255),
      receiverId VARCHAR(255),
      timestamp VARCHAR(255),
      ivA VARCHAR(255),
      ivB VARCHAR(255),
      FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE
    )`,
    function (err, results) {
      if (err) {
        console.log(err.message);
        return;
      }

      console.log("Table messages created successfully!");
    }
  );
}
function insertMessage({
  id,
  chatId,
  text,
  senderId,
  receiverId,
  timestamp,
  ivA,
  ivB,
}) {
  connection.query(
    "INSERT INTO messages (id, chatId, text, senderId, receiverId, timestamp, ivA,ivB) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id, chatId, text, senderId, receiverId, timestamp, ivA, ivB],
    function (err, results) {
      if (err) {
        console.log(err.message);
      }
    }
  );
}
// createTable();
// createMessageTable();

module.exports = {
  connection,
  insertMessage,
};
