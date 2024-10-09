// account controller - unit 4
const utilities = require('../utilities')

// login details - unit 4
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

  module.exports = { buildLogin }