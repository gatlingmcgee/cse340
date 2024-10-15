// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Util = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build inventory for classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId))

// route to get details by (inv_id)
router.get("/detail/:inv_id", Util.handleErrors(invController.getVehicleDetails))

// route for intentional-error link (home page)
router.get("/intentional-error", Util.handleErrors(invController.triggerError))

// unit 4 assignment - route for management view
router.get("/", Util.handleErrors(invController.managementView))

// route to add a new classification
router.get("/add-new-classification", Util.handleErrors(invController.classificationView))

router.post(
    "/add-new-classification",
    regValidate.ClassificationRules(),
    regValidate.checkClassData,
    Util.handleErrors(invController.AddNewClassification)
  )

  // route to add a new vehicle to inventory
  router.get("/add-new-inventory", Util.handleErrors(invController.InventoryView))

  router.post(
    "/add-new-inventory",
    regValidate.InventoryListRules(),
    regValidate.checkInventoryData,
    Util.handleErrors(invController.AddNewInventory)
  )

module.exports = router