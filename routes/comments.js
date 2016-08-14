"use strict"

// *****************************************************************************
// *****************************************************************************
// Requires and basics

const express = require( "express" )




// *****************************************************************************
// *****************************************************************************
// App setup + Model imports

const router = express.Router({mergeParams: true})


const Campground = require( "../models/campground" )
const Comment    = require( "../models/comment" )




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




// *****************************************************************************
// *****************************************************************************
// Comments routes

router.get( "/new", isLoggedIn, ( req, res ) => {

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


router.post( "/", isLoggedIn, ( req, res ) => {

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




// ****************************************************************************
// ****************************************************************************
// Exports

module.exports = router

