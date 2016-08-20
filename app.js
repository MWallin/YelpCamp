"use strict"


// *****************************************************************************
// *****************************************************************************
// Requires and basics

// Externals
const expressSession = require( "express-session" )
const methodOverride = require( "method-override" )
const LocalStrategy  = require( "passport-local" )
const bodyParser     = require( "body-parser" )
const mongoose       = require( "mongoose" )
const passport       = require( "passport" )
const express        = require( "express" )
const flash          = require( "connect-flash" )

// Own modules
// const seedDB =  require( "./seeds" )
const middleware = require( "./middleware" )




// *****************************************************************************
// *****************************************************************************
// App setup is here

const app = express()


app.set( "view engine", "ejs" );

app.use( express.static( __dirname + "/public" ) )
app.use( bodyParser.urlencoded({extended: true}) )
app.use( methodOverride( "_method" ) )
app.use( flash() )

// Seed the database
// seedDB()




// *****************************************************************************
// *****************************************************************************
// Database setup + Model imports

// Local database
//mongoose.connect( "mongodb://localhost/yelp_camp" )

// mLab database
mongoose.connect( "mongodb://yc_app:password@ds063715.mlab.com:63715/yelpcamp" )

const User = require( "./models/user" )




// *****************************************************************************
// *****************************************************************************
// Auth setup

app.use( expressSession({
  secret           : "This is a really awesome app and I like cats!",
  resave           : false,
  saveUninitialized: false
}) )

app.use( passport.initialize() )
app.use( passport.session() )

passport.use( new LocalStrategy( User.authenticate() ) )
passport.serializeUser( User.serializeUser() )
passport.deserializeUser( User.deserializeUser() )


app.use( middleware.addCurrentUser )




// *****************************************************************************
// *****************************************************************************
// Router setup

const campgroundRoutes = require( "./routes/campgrounds" )
const commentRoutes    = require( "./routes/comments" )
const indexRoutes      = require( "./routes/index" )


app.use( "/", indexRoutes )
app.use( "/campgrounds", campgroundRoutes )
app.use( "/campgrounds/:id/comments", commentRoutes )




// *****************************************************************************
// *****************************************************************************
// Server

// Set correct port depending on local or Heroku
app.set( "port", ( process.env.PORT || 3000 ) );

app.listen( app.get( "port" ), function () {
  console.log( "The YelpCamp server has started" )
})

