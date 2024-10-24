// unit 4 data validation 
const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model")

  //Registration Data Validation Rules
  validate.registrationRules = () => {
    return [
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."),
  
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."),
  
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() 
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
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
        .withMessage("Password does not meet requirements."),
    ]
  }

  validate.loginRules = () => {
    return [
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() 
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

    // Rules for adding a Classification in Managment view
    validate.ClassificationRules = () => {
      return [
        body("classification_name")
          .trim()
          .escape()
          .notEmpty()
          .matches("^[A-Za-z]+$")
          .withMessage("Please provide a correct classification name.")
          .custom(async (classification_name) => {
            const classExists = await invModel.checkExistingClass(classification_name)
          if (classExists){
              throw new Error("This class already exists")
          }
          })
        ]
    }

    validate.InventoryListRules = () => {
      return [
        body("inv_make")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a make."),
    
        body("inv_model")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a model."),
  
        body("inv_description")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a description."),
    
        body("inv_image")
          .trim()
          .notEmpty()
          .withMessage("Please provide an image path."),

        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("Please provide a thumbnail path."),

        body("inv_price")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a price."),

        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a year."),

        body("inv_miles")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide the miles"),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a color"),
      ]
    }

    //unit 5 - update account errors (firstname, lastname and email)
    validate.accountUpdateListRules = () => {
      return [
        body("account_firstname")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a first name."),
    
        body("account_lastname")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a last name."),
  
          body("account_email")
          .trim()
          .isEmail()
          .normalizeEmail() 
          .withMessage("A valid email is required.")
          .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists){
              throw new Error("Email exists. Please use different email")
          }
          })
      ]
    }

    //unit 5 - update account errors (password)
    validate.passwordChangeRules = () => {
      return [
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

        //unit 6 - membership signup errors
        validate.memberSignupRules = () => {
          return [
            body("account_firstname")
              .trim()
              .escape()
              .notEmpty()
              .withMessage("Please provide a first name."),
        
            body("account_lastname")
              .trim()
              .escape()
              .notEmpty()
              .withMessage("Please provide a last name."),
      
              body("account_email")
              .trim()
              .isEmail()
              .normalizeEmail() 
              .withMessage("Please provide an email."),

              body("account_phone")
              .trim()
              .escape()
              .notEmpty()
              .matches(/^\d{3}-\d{3}-\d{4}$/)
              .withMessage("Please provide a phone number")
              .withMessage("Phone number must be in the format XXX-XXX-XXXX")
          ]
        }

    
  // Check data and return errors or continue to login
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

//Check data and return errors or continue to registration
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

  // unit 5 - checks for the entire inventory list
  validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      const classificationList = await utilities.buildClassificationList()
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
        classification_id
      })
      return
    }
    next()
  }

  // unit 5 - redirects errors back to the edit view
  validate.checkUpdateData = async (req, res, next) => {
    const { classificationList, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id, classification_id } = req.body
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/edit-vehicle", {
        errors,
        title: "Edit ",
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
        inv_id,
        classification_id,
        classificationSelect
      })
      return
    }
    next()
  }

    // unit 5 - redirects errors back to the update view
    validate.checkAccountUpdateData = async (req, res, next) => {
      const { account_firstname, account_lastname, account_email } = req.body
      let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
          errors,
          title: "Edit ",
          nav,
          account_firstname,
          account_lastname,
          account_email
        })
        return
      }
      next()
    }

    validate.checkAccountPasswordUpdateData = async (req, res, next) => {
      const { account_password, account_id } = req.body
      let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
          errors,
          title: "Edit ",
          nav,
          account_password,
          account_id
        })
        return
      }
      next()
    }

    validate.checkMembershipData = async (req, res, next) => {
      const { account_firstname, account_lastname, account_email, account_phone, account_id } = req.body
      let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/membership", {
          errors,
          title: "Membership Signup",
          nav,
          account_firstname,
          account_lastname,
          account_email,
          account_phone,
          account_id
        })
        return
      }
      next()
    }
  
  module.exports = validate