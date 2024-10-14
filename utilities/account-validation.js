// unit 4 data validation 

const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
const accountModel = require("../models/account-model")

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      //body("account_email")
      //.trim()
      //.escape()
      //.notEmpty()
      //.isEmail()
      //.normalizeEmail() // refer to validator.js docs
      //.withMessage("A valid email is required."),

      // valid email is required and cannot already exist in the database - unit 4
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
      }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  validate.loginRules = () => {
    return [
      // valid email is required and cannot already exist in the database - unit 4
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (!emailExists){
          throw new Error("Email does not exist. Sign up")
      }
      }),

      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Incorrect password credentials."),
    ]
  }

    /* ******************************
 * Rules for adding a Classification in Managment view
 * ***************************** */
    validate.ClassificationRules = () => {
      return [
        body("classification_name")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a correct classification name."), // on error this message is sent.
      ]
    }

    validate.InventoryListRules = () => {
      return [

        // make is required and must be string
        body("inv_make")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a make."), // on error this message is sent.
    
        // model is required and must be string
        body("inv_model")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a model."), // on error this message is sent.
  
        // description is required and must be string
        body("inv_description")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a description."), // on error this message is sent.
    
        // image path is required and must be string
        body("inv_image")
          .trim()
          .notEmpty()
          .withMessage("Please provide an image path."), // on error this message is sent.

          // thumbnail is required and must be string
        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("Please provide a thumbnail path."), // on error this message is sent.

        // price is required and must be string
        body("inv_price")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a price."), // on error this message is sent.

          // year is required and must be string
        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a year."), // on error this message is sent.

        // miles are required and must be string
        body("inv_miles")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide the miles"), // on error this message is sent.

          // color is required and must be string
        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a color"), // on error this message is sent.
      ]
    }
    

  /* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
  validate.checkLogData = async (req, res, next) => {
    const {account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
      })
      return
    }
    next()
  }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

  validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-new-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }

  validate.checkInventoryData = async (req, res, next) => {
    const { classificationList, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-new-inventory", {
        errors,
        title: "Add New Inventory",
        nav,
        classificationList,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
      })
      return
    }
    next()
  }
  
  module.exports = validate