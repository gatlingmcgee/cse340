const { param } = require("express-validator")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

// build inventory by classification view
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

// build details by getVehicleById
invCont.getVehicleDetails = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getVehicleById(inv_id)
  let nav = await utilities.getNav()
  const grid = await utilities.buildVehicleDetailView(data)
  
  res.render("./inventory/classification", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    grid,
  })
}

// trigger error on purpose - link
invCont.triggerError = function (req, res, next) {
  const error = new Error("intentional error process")
  error.status = 500
  next(error)
}

// unit 4 assignment - build management view
invCont.managementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  // unit - 5 classification list
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect
    })
}

// unit 4 assignment - build classification view
invCont.classificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-new-classification", {
      title: "Add New Classification",
      nav,
      errors: null
  })
}

// unit 4 assignment - build inventory view
invCont.InventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-new-inventory", {
      title: "Add new Vehicle",
      nav,
      classificationList,
      errors: null
  })
}

// unit 4 assignment - add classification
 invCont.AddNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const classResults = await invModel.addClassification(classification_name)
  const classificationSelect = await utilities.buildClassificationList()

  if (classResults) {
    req.flash("notice", "Classification added successfully.")
    res.status(201).render("inventory/management", {
      title: "Mangement",
      nav,
      errors: null,
      classificationSelect
    })
  } else {
    req.flash("notice", "Failed to add classification.")
    res.status(501).render("inventory/add-new-classification", {
      title: "Add New Classification",
      nav,
      errors: null
    })
  }
} 

  // unit 4 assignment - add classification
 /* invCont.AddNewClassification = async function (req, res, next) {
    try {
      let nav = await utilities.getNav()
      const { classification_name } = req.body
      const classResults = await invModel.addClassification(classification_name)
  
      if (classResults) {
        req.flash("success", "Classification added successfully.")
        res.redirect("/inv/")
      } else {
        req.flash("error", "Failed to add classification.")
        res.redirect("/inv/add-new-classification")
      }
    } catch (error) {
      console.error("Error adding classification:", error)
      req.flash("error", "An error occurred while adding the classification.")
      res.redirect("/inv/add-new-classification")
    }
  }*/

  
// unit 4 assignment - add inventory
invCont.AddNewInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body

  const inventoryResults = await invModel.AddNewInventory(
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
  )

  if (inventoryResults) {
    req.flash("notice", "Successfully added vehicle.")
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect
    })
  } else {
    req.flash("notice", "Failed to add vehicle.")
    res.status(501).render("inventory/add-new-inventory", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  }
  
}

// unit - 5 Return Inventory by Classification As JSON
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

// unit - 5 Return edit by inventory_id
invCont.buildInvEdit = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const invData = await invModel.getVehicleById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(invData.classification_id)
  const itemName = `${invData.inv_make} ${invData.inv_model}`

    res.render("./inventory/edit-vehicle", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: invData.inv_id,
      inv_make: invData.inv_make,
      inv_model: invData.inv_model,
      inv_year: invData.inv_year,
      inv_description: invData.inv_description,
      inv_image: invData.inv_image,
      inv_thumbnail: invData.inv_thumbnail,
      inv_price: invData.inv_price,
      inv_miles: invData.inv_miles,
      inv_color: invData.inv_color,
      classification_id: invData.classification_id
    })
  }


// unit 5 - Update Inventory Data
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id,
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-vehicle", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont