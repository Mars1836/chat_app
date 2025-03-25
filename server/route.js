const express = require("express");
const router = express.Router();
const {
  signUp,
  signIn,
  signInDg,
  getMe,
  getUsers,
  getUserById,
  getMessages,
  logout,
  getUserByUsername,
  getOtherUsers,
} = require("./controller");
const handleError = require("./handleError");
const { checkAuth } = require("./middleware");
router.post("/auth/sign-up", handleError(signUp));
router.post("/auth/sign-in", handleError(signIn));
router.post("/auth/sign-in-dg", handleError(signInDg));
router.post("/auth/logout", handleError(logout));
router.get("/users/username/:username", handleError(getUserByUsername));
router.get("/users/others", checkAuth, handleError(getOtherUsers));
router.get("/users/:id", handleError(getUserById));
router.get("/users", handleError(getUsers));
router.get("/me", checkAuth, handleError(getMe));
router.get("/messages/:senderId/:receiverId", handleError(getMessages));
module.exports = router;
