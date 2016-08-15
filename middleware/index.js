"use strict"

// *****************************************************************************
// *****************************************************************************
// App setup + Model imports

const Campground = require( "../models/campground" )
const Comment    = require( "../models/comment" )




// ****************************************************************************
// ****************************************************************************
// Object declaration

const middlewareObj = {

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Checks if logged in user owns the campground
  isCampgroundOwner ( req, res, next ) {

    // Get data from the request
    const currentCampground = req.params.id
    const currentUser = req.user

    if ( req.isAuthenticated() ) {

      Campground.findById( currentCampground, ( err, foundCampground ) => {

        if ( err ) {

          console.log( `ERROR: ${err}` )

          res.redirect( "back" )


        } else if ( foundCampground.creator.id.equals( currentUser._id ) ) {

          next()


        } else {

          res.redirect( "back" )


        }

      })

    } else {

      res.redirect( "back" )


    }

  },




  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Checks if logged in user owns the comment
  isCommentOwner ( req, res, next ) {

    // Get data from the request
    const currentComment = req.params.comment_id
    const currentUser = req.user

    if ( req.isAuthenticated() ) {

      Comment.findById( currentComment, ( err, foundComment ) => {

        if ( err ) {

          console.log( `ERROR: ${err}` )

          res.redirect( "back" )


        } else if ( foundComment.author.id.equals( currentUser._id ) ) {

          next()


        } else {

          res.redirect( "back" )


        }

      })

    } else {

      res.redirect( "back" )


    }

  },




  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Checks if the user is logged in
  isLoggedIn ( req, res, next ) {

    if ( req.isAuthenticated() ) {

      next()


    } else {

      req.flash( "error", "You must login first!" )

      res.redirect( "/login" )


    }
  },




  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Add data to all templates
  addCurrentUser ( req, res, next ) {

    // Add user
    res.locals.currentUser = req.user;


    // Add flash messages
    res.locals.error = req.flash( "error" )
    res.locals.success = req.flash( "success" )


    // Move on
    next();


  },

}


// ****************************************************************************
// ****************************************************************************
// Exports

module.exports = middlewareObj
