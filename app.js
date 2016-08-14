"use strict"


// *****************************************************************************
// *****************************************************************************
// Requires and basics

// Externals
const expressSession = require( "express-session" )
const LocalStrategy  = require( "passport-local" )
const bodyParser     = require( "body-parser" )
const mongoose       = require( "mongoose" )
const passport       = require( "passport" )
const express        = require( "express" )

// -----------------------------------------------------------------------------
// Own modules
const seedDB =  require( "./seeds" )




// *****************************************************************************
// *****************************************************************************
// App setup

const app = express()


app.set( "view engine", "ejs" );

app.use( bodyParser.urlencoded({extended: true}) )
app.use( express.static( __dirname + "/public" ) )


// Seed the database
seedDB()




// *****************************************************************************
// *****************************************************************************
// Database setup + Model imports

mongoose.connect( "mongodb://localhost/yelp_camp" )


const User       = require( "./models/user" )




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


app.use( addCurrentUser )



// *****************************************************************************
// *****************************************************************************
// Middleware


function addCurrentUser ( req, res, next ) {

  res.locals.currentUser = req.user;

  next();

}




// *****************************************************************************
// *****************************************************************************
// Router setup

const campgroundRoutes = require( "./routes/campgrounds" )
const commentRoutes = require( "./routes/comments" )
const indexRoutes = require( "./routes/index" )


app.use( "/", indexRoutes )
app.use( "/campgrounds", campgroundRoutes )
app.use( "/campgrounds/:id/comments", commentRoutes )




// *****************************************************************************
// *****************************************************************************
// Server

app.listen( 3000, function () {
  console.log( "The YelpCamp server has started" )
})

