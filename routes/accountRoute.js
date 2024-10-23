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

// Route to build the login success page - unit 5
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.loginSuccess))

// Route to build the login update page - unit 5
router.get("/update/:account_id", utilities.handleErrors(accountController.processUpdate))

// Route to register an account and process the registration data - unit 4
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// unit 4, Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    //unit 5, login process
    utilities.handleErrors(accountController.accountLogin),
    (req, res) => {
      res.status(200).send('login process')
    }
  )

  // unit 5 - account route for update page (firstname, lastname and email)
router.post("/updateaccount/",
  regValidate.accountUpdateListRules(),
  regValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

  // unit 5 - account route for update page (password)
  router.post("/updatepassword/",
    regValidate.passwordChangeRules(),
    regValidate.checkAccountPasswordUpdateData,
    utilities.handleErrors(accountController.changePassword)
  )

module.exports = router