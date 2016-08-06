"use strict"


// *****************************************************************************
// *****************************************************************************
// Requires and basics

// Externals
const express    = require( "express" )
const bodyParser = require( "body-parser" )
const mongoose   = require( "mongoose" )


// Own modules
const seedDB =  require( "./seeds" )




// *****************************************************************************
// *****************************************************************************
// App setup

const app = express()


app.set( "view engine", "ejs" );

app.use( bodyParser.urlencoded({extended: true}) )


mongoose.connect( "mongodb://localhost/yelp_camp" )


// Seed the database
seedDB()




// *****************************************************************************
// *****************************************************************************
// Model imports

const Campground = require( "./models/campground" )
const Comment = require( "./models/comment" )




// *****************************************************************************
// *****************************************************************************
// Routes

app.get( "/", function ( req, res ) {

  res.render( "landing" )


})



// Index -- Show all items
app.get( "/campgrounds", function ( req, res ) {

  // Get all campgrounds from db
  Campground.find(
    {},
    ( err, allCampgrounds ) => {

      if ( err ) {

        console.log( "Error: " + err )

      } else {

        // Render campgrounds
        res.render( "index", {
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

  res.render( "new" )


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
          res.render( "show", {
            campground: foundCampground
          })

        }
      }
    )


})



// *****************************************************************************
// *****************************************************************************
// Server

app.listen( 3000, function () {
  console.log( "The YelpCamp server has started" )
})

