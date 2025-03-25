const {
  signUpService,
  signInService,
  getUsersService,
  getUserByIdService,
  getMessagesService,
  getUserByUsernameService,
  getOtherUsersService,
  signInServiceV2,
} = require("./service");
const jwt = require("jsonwebtoken");
const signUp = async (req, res) => {
  const {
    citizenIdentificationCard,
    username,
    name,
    password,
    gender,
    dateOfBirth,
    address,
    phoneNumber,
  } = req.body;

  const data = await signUpService({
    citizenIdentificationCard,
    username,
    name,
    password,
    gender,
    dateOfBirth,
    address,
    phoneNumber,
  });

  res.status(200).json(data);
};
const signInDg = async (req, res) => {
  const { username, password } = req.body;

  const data = await signInService(username, password);
  const token = jwt.sign(data, "secret", {
    expiresIn: "1h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 3600000,
  });
  res.status(200).json({ data, token });
};
const signIn = async (req, res) => {
  const { username, password } = req.body;

  const data = await signInServiceV2(username, password);
  const token = jwt.sign(data, "secret", {
    expiresIn: "1h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 3600000,
  });
  res.status(200).json({ data, token });
};
const getUserByUsername = async (req, res) => {
  const { username } = req.params;
  const user = await getUserByUsernameService(username);
  res.status(200).json(user);
};
const getUsers = async (req, res) => {
  const users = await getUsersService();
  res.status(200).json(users);
};

const getOtherUsers = async (req, res) => {
  const users = await getOtherUsersService(req.user.username);
  res.status(200).json(users);
};
const getMe = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};
const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await getUserByIdService(id);
  res.status(200).json(user);
};
const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;
  const messages = await getMessagesService(senderId, receiverId);
  res.status(200).json(messages);
};
const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
module.exports = {
  signUp,
  signIn,
  signInDg,
  getMe,
  getUsers,
  getUserById,
  getMessages,
  getUserByUsername,
  logout,
  getOtherUsers,
};
