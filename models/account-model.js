// unit 4 registration
const pool = require("../database/")

// Register new account
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

// Check for existing email
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }

  // unit 5 - login process
/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

// unit 5 assignment - grabs Account information by ID
async function getAccountId(account_id){
  try {
    const sql = "SELECT * FROM public.account WHERE account_id = $1"
    const data = await pool.query(sql, [account_id])
    return data.rows[0]
  } catch (error) {
    return error.message
  }
}

// unit 5 assignment - Updates account information
async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
  try {
    const sql = `UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *`
    const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("Updating Account error: " + error)
    throw error
  }
}

// unit 5 - Updated password
async function updatePassword(account_password, account_id) {
  try {
    const sql = `UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *`
    const data = await pool.query(sql, [account_password, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("Updating Password error: " + error)
    throw error
  }
}

// unit 5 - Updated password
async function clientToMember(account_id, account_phone) {
  try {
    const sql = `UPDATE account SET account_type = 'Member', account_phone = $2 WHERE account_id = $1 AND account_type = 'Client' RETURNING *`
    const data = await pool.query(sql, [account_id, account_phone])
    return data.rows[0]
  } catch (error) {
    console.error("Membership Signup Failed: " + error)
    throw error
  }
}

  module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountId, updateAccount, updatePassword, clientToMember }