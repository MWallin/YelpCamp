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

// Own modules
const seedDB =  require( "./seeds" )





// *****************************************************************************
// *****************************************************************************
// App setup

const app = express()


app.set( "view engine", "ejs" );

app.use( bodyParser.urlencoded({extended: true}) )
app.use( express.static( __dirname + "/public" ) )





// *****************************************************************************
// *****************************************************************************
// Database setup + Model imports

mongoose.connect( "mongodb://localhost/yelp_camp" )


const Campground = require( "./models/campground" )
const Comment    = require( "./models/comment" )
const User       = require( "./models/user" )


// Seed the database
seedDB()





// -----------------------------------------------------------------------------
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
// Routes

app.get( "/", function ( req, res ) {

  res.render( "landing" )

})


// -----------------------------------------------------------------------------
// Campground routes

// Index -- Show all items
app.get( "/campgrounds", function ( req, res ) {

  // Get all campgrounds from db
  Campground.find(
    {},
    ( err, allCampgrounds ) => {

      if ( err ) {

        console.log( `Error: ${err}` )

      } else {

        // Render campgrounds
        res.render( "campgrounds/index", {
          campgrounds: allCampgrounds
        })

      }
    }
  )


})



// Create -- Add a new item to the database
app.post( "/campgrounds", function ( req, res ) {

  // Get data from the request
  const name  = req.body.campName
  const image = req.body.campImage
  const description = req.body.campDesc


  // Make an object from the caught data
  const newCampground = {
    name       : name,
    image      : image,
    description: description
  }

  // Add campground to database
  Campground.create(
    newCampground,
    ( err, newlyCreated ) => {

      if ( err ) {

        console.log( "Something went wrong" );
        console.log( err );

      } else {

        console.log( "New campground" );
        console.log( newlyCreated );

        // Send user to the campg site
        res.redirect( "/campgrounds" )

      }
    }
  )


})



//NEW -- Form for making a new item
app.get( "/campgrounds/new", function ( req, res ) {

  res.render( "campgrounds/new" )


})



// SHOW -- Show details about one item
app.get( "/campgrounds/:id", ( req, res ) => {

  // Get data from the request
  const findID = req.params.id

  // Find campground with provided ID
  Campground.findById( findID )
    .populate( "comments" )
    .exec(
      ( err, foundCampground ) => {

        if ( err ) {

          console.log( "Error" + err );

        } else {

          // Render show template for that campground
          res.render( "campgrounds/show", {
            campground: foundCampground
          })

        }
      }
    )


})

// -----------------------------------------------------------------------------
// Comments routes

app.get( "/campgrounds/:id/comments/new", isLoggedIn, ( req, res ) => {

  // Get data from the request
  const findID = req.params.id

  // Find campground with provided ID
  Campground.findById( findID, ( err, foundCampground ) => {

    if ( err ) {

      console.log( `ERROR: ${err}` )

    } else {

      res.render( "comments/new", {
        campground: foundCampground
      })

    }
  })


})


app.post( "/campgrounds/:id/comments", isLoggedIn, ( req, res ) => {

  // Get data from the request
  const findID = req.params.id
  const createComment = req.body.comment

  // Find campground with provided ID
  Campground.findById( findID, ( err, foundCampground ) => {

    if ( err ) {

      console.log( `ERROR: ${err}` )

      res.redirect( "/campgrounds" )

    } else {

      Comment.create(
        createComment,
        ( err, newComment ) => {

          if ( err ) {

            console.log( `ERROR: ${err}` )

          } else {

            foundCampground.comments.push( newComment )
            foundCampground.save()

            res.redirect( `/campgrounds/${foundCampground._id}` )

          }

        })

    }
  })


})

// -----------------------------------------------------------------------------
// Auth routes

// Show register form
app.get( "/register", ( req, res ) => {

  res.render( "auth/register", {})

})

// Register user
app.post( "/register", ( req, res ) => {

  const newName = req.body.username
  const newPassword  = req.body.password

  const newUser = new User({username: newName})


  User.register( newUser, newPassword, ( err, user ) => {

    if ( err ) {

      console.log( `ERROR: ${err}` )

      res.redirect( "/register" )


    } else {

      passport.authenticate( "local" )( req, res, () => {

        res.redirect( "/campgrounds" )


      })

    }
  })


})



// Show login form
app.get( "/login", ( req, res ) => {

  res.render( "auth/login" )

})


// Login user
app.post( "/login", passport.authenticate( "local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), ( req, res ) => {

    // No need for stuff here

})


// Logout
app.get( "/logout", ( req, res ) => {

  req.logout()

  res.redirect( "/" )

})



// *****************************************************************************
// *****************************************************************************
// Middleware

function isLoggedIn( req, res, next ) {

  if ( req.isAuthenticated() ) {

    next()

  } else {

    res.redirect( "/login" )

  }
}


function addCurrentUser ( req, res, next ) {

  res.locals.currentUser = req.user;

  next();

}



// *****************************************************************************
// *****************************************************************************
// Server

app.listen( 3000, function () {
  console.log( "The YelpCamp server has started" )
})

