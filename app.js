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
app.use( express.static( __dirname + "/public" ) )


mongoose.connect( "mongodb://localhost/yelp_camp" )


// Seed the database
seedDB()





// *****************************************************************************
// *****************************************************************************
// Model imports

const Campground = require( "./models/campground" )
const Comment    = require( "./models/comment" )




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

app.get( "/campgrounds/:id/comments/new", ( req, res ) => {

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


app.post( "/campgrounds/:id/comments", ( req, res ) => {

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




// *****************************************************************************
// *****************************************************************************
// Server

app.listen( 3000, function () {
  console.log( "The YelpCamp server has started" )
})

