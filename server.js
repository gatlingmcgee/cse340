/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const baseController = require("./controllers/baseController")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/index")
const session = require("express-session")
const pool = require('./database/')
// account route - unit 4
const accountRoute = require('./routes/accountRoute')


/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})



/* ***********************
 * View engine and templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
//May need to delete these next two lines
/*
app.get("/", function(req, res){
  res.render("index", {title: "Home"})
})
*/
// Inventory routes
app.use("/inv", inventoryRoute)

// account route - unit 4
app.use("/account", require("./routes/accountRoute"))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware - unit 3
*************************/

/*
//404 errors
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Try a different route, maybe, maybe not?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})
  */

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  
  let message
  
  //404 error
  if (err.status === 404) {
      message = err.message
      res.status(404)
  //500 error
  } else if (err.status === 500) {
      message = 'There is a problem with the resource you are looking for, and it cannot be displayed.'
      res.status(500)
  }
  //Server error
  else {
    message = 'Oh no! There was a crash. Try a different route, maybe, maybe not?'
  }

  res.render("errors/error", {
      title: err.status || 'Server Error',
      message,
      nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
