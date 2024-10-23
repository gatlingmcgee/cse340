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
// register package route - unit 4
const bodyParser = require("body-parser")
// unit 5 - login process
const cookieParser = require("cookie-parser")

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

// makes body parser available to the aplication
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// unit 5 login process
app.use(cookieParser())
app.use(utilities.checkJWTToken)

//Unit 5 - changes local to session in order to make link visibility functional in ejs
app.use((req, res, next) => {
  res.locals.session = req.session
  next()
})

app.get('/logout', (req, res) => {
  res.clearCookie('jwt')
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/account')
    }
    res.redirect('/')
  })
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
