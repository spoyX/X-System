const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
require("dotenv").config()
var {requireAuth} = require("../middleware/middleware");
var {checkIfUser}=require("../middleware/middleware")
const { check, validationResult } = require("express-validator");
const authController = require("../Controller/authController")


router.get("*", checkIfUser);


router.get("/signout", authController.get_signout);

router.get("/", authController.get_welcome);

router.get("/login", authController.get_login);

router.get("/signup",authController.get_signup);

router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check(
      "password",
      "Password must be at least 8 characters with 1 upper case letter and 1 number"
    ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  ],
  authController.post_signup
);


router.post("/login", authController.post_login);


// GET Requst
router.get("/home", requireAuth, userController.user_index_get);

router.get("/edit/:id", requireAuth, userController.user_edit_get);

router.get("/view/:id", requireAuth, userController.user_view_get);

router.post("/search",checkIfUser, userController.user_search_post);

// DELETE Request
router.delete("/edit/:id", userController.user_delete);

// PUT Requst
router.put("/edit/:id", userController.user_put);


const multer  = require('multer')
const upload = multer({storage: multer.diskStorage({})});
const cloudinary = require('cloudinary').v2

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});
const AuthUser = require("../models/authuser");
var jwt = require("jsonwebtoken");

// LEVEL 3
router.post("/update-profile", upload.single('avatar'),authController.post_ProfileImage)



module.exports = router;