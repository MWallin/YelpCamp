"use strict"


// ******************************************
// Globals and require

const express = require( "express" )
const app = express()




// ******************************************
// App setup

app.set( "view engine", "ejs" );


// ******************************************
// Routes

app.get( "/", function ( req, res ) {

  res.render( "landing" )

})


app.get("/campgrounds", function ( req, res ) {

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
      name : "Adventurers Campsite",
      image: "http://vignette1.wikia.nocookie.net/elderscrolls/images/b/b1/Adventurers_Campsite.png/revision/latest?cb=20121123194546"
    },
  ]

  res.render( "campgrounds" )

})



// ******************************************
// Server

app.listen( 3000, function () {
  console.log( "The YelpCamp server has started" )
})

