// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')


// Route to build the account login page - unit 4
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build the account register page - unit 4
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to register an account and process the registration data - unit 4
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router