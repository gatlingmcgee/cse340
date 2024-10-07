// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Util = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId))

router.get("/detail/:inv_id", Util.handleErrors(invController.getVehicleDetails))

router.get("/intentional-error", Util.handleErrors(invController.triggerError))

module.exports = router