"use strict"


// *****************************************************************************
// *****************************************************************************
// Requires and basics

const express    = require( "express" )
const bodyParser = require( "body-parser" )
const mongoose   = require( "mongoose" )

const app = express()




// *****************************************************************************
// *****************************************************************************
// App setup

app.set( "view engine", "ejs" );

app.use( bodyParser.urlencoded({extended: true}) )

mongoose.connect( "mongodb://localhost/yelp_camp" )




// *****************************************************************************
// *****************************************************************************
// Schema setup

const campgroundSchema = new mongoose.Schema({
  name       : String,
  image      : String,
  description: String
})

const Campground = mongoose.model( "Campground", campgroundSchema )


// Campground.create(
//   {
//     name       : "Beachside",
//     image      : "http://www.knightsnotes.com/Hawaii%20Trip/Campsite%20Near%20Beach.jpg",
//     description: "Just near the sea, a beuatiful, but haunted place. Also, no toiletts."
//   },
//   ( err, campground ) => {

//     if ( err ) {
//       console.log( err )

//     } else {
//       console.log( "New campground: " )
//       console.log( campground )

//     }
//   }

// )




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
  Campground.findById(
    findID,
    ( err, foundCampground ) => {

      if ( err ) {
        console.log( "Error" + err );

      } else {
        res.render( "show", {
          campground: foundCampground
        })

      }

    }
  )

  // Render show template for that campground


})



// *****************************************************************************
// *****************************************************************************
// Server

app.listen( 3000, function () {
  console.log( "The YelpCamp server has started" )
})

