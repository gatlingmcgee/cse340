const pool = require("../database/")

// Get all classification data
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

// Get all inventory items and classification_name by classification_id - unit 3
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

// Get all vehicles by (inv_id)
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
       WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getVehicleById error: " + error)
  }
}

// unit 4 assignment - add the classification
async function addClassification(classification_name) {
  try {
    const sql = await pool.query(`INSERT INTO public.classification (classification_name) VALUES ($1)`, [classification_name])
    return sql
    //return await pool.query(sql, [classification_name])
  } catch (error) {
    console.error("addClassification error: " + error)
    throw error
  }
}

// unit 4 assignment - add the vehicle to inventory
async function AddNewInventory(inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) {
  try {
    const sql = `INSERT INTO public.inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    const data = await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id])
    return data.rows[0]
  } catch (error) {
    console.error("AddNewInventory error: " + error)
    throw error
  }
}

// unit 5 assignment - edits the vehicle in inventory
async function updateInventory(inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id) {
  try {
    const sql = `UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *`
    const data = await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("AddNewInventory error: " + error)
    throw error
  }
}

// unit 5 assignment - delete an item
async function deleteInventoryItem(inv_id) {
  try {
    const sql = `DELETE FROM inventory WHERE inv_id = $1`
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("Delete Inventory Error " + error)
    throw error
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, AddNewInventory, updateInventory, deleteInventoryItem }