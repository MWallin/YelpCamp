"use strict"


// *****************************************************************************
// *****************************************************************************
// Requires and basics

const express = require( "express" )




// *****************************************************************************
// *****************************************************************************
// App setup + Model imports

const router = express.Router()


const Campground = require( "../models/campground" )




// *****************************************************************************
// *****************************************************************************
// Campground routes

// Index -- Show all items
router.get( "/", function ( req, res ) {

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


//NEW -- Form for making a new item
router.get( "/new", function ( req, res ) {

  res.render( "campgrounds/new" )


})



// Create -- Add a new item to the database
router.post( "/", function ( req, res ) {

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






// SHOW -- Show details about one item
router.get( "/:id", ( req, res ) => {

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





// ****************************************************************************
// ****************************************************************************
// Exports

module.exports = router

