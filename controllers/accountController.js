// account controller - unit 4
const utilities = require('../utilities')
const accountModel = require('../models/account-model')
// unit 4 password hashing
const bcrypt = require("bcryptjs")
// unit 5 - login process
const jwt = require("jsonwebtoken")
require("dotenv").config()


// login details - unit 4
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

// register details - unit 4
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
} 

// login success - unit 5
async function loginSuccess(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account", {
    title: "Login Success",
    nav,
    errors: null,
    accountType: req.session.accountType
  })
} 

// Process Registration

async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // unit 4 password hashing - hash the password before storing
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash("notice", `Congratulations, you\'re registered ${account_firstname}. Please log in.`)
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}

//unit 5 - create account make view
async function processUpdate(req, res) {
  console.log("Account ID from params:", req.params.account_id)
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountId(account_id)

  res.render("./account/update", {
    title: "Edit account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email
  })
}

// unit 5 - Update Account Data
async function updateAccount (req, res, next) {
  let nav = await utilities.getNav()
  const {account_firstname, account_lastname, account_email, account_id} = req.body
  const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)
  console.log({ account_firstname, account_lastname, account_email, account_id })

  if (updateResult) {
    req.session.userName = account_firstname
    req.flash("notice", `Your account was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
    title: "Edit account",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id
    })
  }
}

// Change Password
async function changePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  const hashedPassword = await bcrypt.hash(account_password, 10)
  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

  if (updateResult) {
    req.flash("notice", "Your password has been successfully changed.")
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id
    })
  }
}

/* ****************************************
 *  Process login request - unit 5
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  //console.log("Account Data:", accountData)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
   return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   req.session.loggedin = true
   req.session.userName = accountData.account_firstname
   req.session.accountType = accountData.account_type
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   res.redirect("/account")
   }
  } catch (error) {
   throw new Error('Access Forbidden')
  }
 }

  module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, loginSuccess, processUpdate, updateAccount, changePassword }