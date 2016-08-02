"use strict"


// *****************************************************************************
// *****************************************************************************
// Requires and basics

const express = require( "express" )
const app = express()

const bodyParser = require( "body-parser" )




// *****************************************************************************
// *****************************************************************************
// App setup

app.set( "view engine", "ejs" );

app.use( bodyParser.urlencoded({extended: true}) )




// *****************************************************************************
// *****************************************************************************
// Globals

const campgrounds = [
  {
    name : "Salmon Creek",
    image: "https://msdnshared.blob.core.windows.net/media/MSDNBlogsFS/prod.evol.blogs.msdn.com/CommunityServer.Blogs.Components.WeblogFiles/00/00/01/21/36/2818.IMG_2641.JPG"
  },
  {
    name : "Dismals Canyon",
    image: "http://dismalscanyon.com/campsites/images/caveman_5124_900px.jpg"
  },
  {
    name : "Beachside",
    image: "http://www.knightsnotes.com/Hawaii%20Trip/Campsite%20Near%20Beach.jpg"
  },
  {
    name : "Salmon Creek",
    image: "https://msdnshared.blob.core.windows.net/media/MSDNBlogsFS/prod.evol.blogs.msdn.com/CommunityServer.Blogs.Components.WeblogFiles/00/00/01/21/36/2818.IMG_2641.JPG"
  },
  {
    name : "Dismals Canyon",
    image: "http://dismalscanyon.com/campsites/images/caveman_5124_900px.jpg"
  },
  {
    name : "Beachside",
    image: "http://www.knightsnotes.com/Hawaii%20Trip/Campsite%20Near%20Beach.jpg"
  },
  {
    name : "Salmon Creek",
    image: "https://msdnshared.blob.core.windows.net/media/MSDNBlogsFS/prod.evol.blogs.msdn.com/CommunityServer.Blogs.Components.WeblogFiles/00/00/01/21/36/2818.IMG_2641.JPG"
  },
  {
    name : "Dismals Canyon",
    image: "http://dismalscanyon.com/campsites/images/caveman_5124_900px.jpg"
  },
  {
    name : "Beachside",
    image: "http://www.knightsnotes.com/Hawaii%20Trip/Campsite%20Near%20Beach.jpg"
  },
  {
    name : "Salmon Creek",
    image: "https://msdnshared.blob.core.windows.net/media/MSDNBlogsFS/prod.evol.blogs.msdn.com/CommunityServer.Blogs.Components.WeblogFiles/00/00/01/21/36/2818.IMG_2641.JPG"
  },
  {
    name : "Dismals Canyon",
    image: "http://dismalscanyon.com/campsites/images/caveman_5124_900px.jpg"
  },
  {
    name : "Beachside",
    image: "http://www.knightsnotes.com/Hawaii%20Trip/Campsite%20Near%20Beach.jpg"
  },
]




// *****************************************************************************
// *****************************************************************************
// Routes

app.get( "/", function ( req, res ) {

  res.render( "landing" )


})




app.get( "/campgrounds", function ( req, res ) {

  res.render( "campgrounds", {
    campgrounds: campgrounds
  })


})




app.post( "/campgrounds", function ( req, res ) {

  // Make an object from the request
  const newCampground = {
    name : req.body.campName,
    image: req.body.campImage
  }

  // Add campground to campgrounds-array
  campgrounds.push( newCampground )

  // Send user to the campg site
  res.redirect( "/campgrounds" )


})




app.get( "/campgrounds/new", function ( req, res ) {

  res.render( "newCamp" )


})




// *****************************************************************************
// *****************************************************************************
// Server

app.listen( 3000, function () {
  console.log( "The YelpCamp server has started" )
})

