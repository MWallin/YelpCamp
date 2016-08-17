"use strict"

// *****************************************************************************
// *****************************************************************************
// Requires and basics

const passport = require( "passport" )
const express  = require( "express" )



// *****************************************************************************
// *****************************************************************************
// App setup + Model imports

const router = express.Router()


const User = require( "../models/user" )




// *****************************************************************************
// *****************************************************************************
// Index routes

// Show landing page
router.get( "/", function ( req, res ) {

  res.render( "landing" )

})


// -----------------------------------------------------------------------------
// Auth routes

// Register routes
router.route( "/register" )

  // Show register form
  .get( ( req, res ) => {

    res.render( "auth/register", {})

  })


  // Register user
  .post( ( req, res ) => {

    const newName = req.body.username
    const newPassword  = req.body.password

    const newUser = new User({username: newName})


    User.register( newUser, newPassword, ( err, user ) => {

      if ( err ) {

        console.log( `ERROR: ${err}` )

        req.flash( "error", err.message )

        res.redirect( "/register" )


      } else {

        passport.authenticate( "local" )( req, res, () => {

          req.flash( "success", `Welcome to YelpCamp, ${user.username}` )

          res.redirect( "/campgrounds" )


        })

      }
    })


  })




// Login routes
router.route( "/login" )

  // Show login form
  .get( ( req, res ) => {

    res.render( "auth/login" )

  })

  // Login user
  .post( passport.authenticate( "local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), ( req, res ) => {

      // No need for stuff here

  })




// Logout route
router.get( "/logout", ( req, res ) => {

  req.logout()

  req.flash( "success", "You are now logged out!" )
  res.redirect( "/" )

})





// ****************************************************************************
// ****************************************************************************
// Exports

module.exports = router
