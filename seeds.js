"use strict"

// ****************************************************************************
// Imports

const mongoose = require( "mongoose" )



// *****************************************************************************
// Model imports

const Campground = require( "./models/campground" )
const Comment = require( "./models/comment" )



// *****************************************************************************
// Remove all data from database and insert fresh data

function  seedDB() {

  // ***************************************************************************
  // Campground data

  const campData = [
    {
      name       : "Rocky View",
      image      : "https://hd.unsplash.com/photo-1445308394109-4ec2920981b1",
      description: "A nice place in the mountains. No toilets but a stunning view. "
    },
    {
      name       : "Misty hills",
      image      : "https://hd.unsplash.com/photo-1434987215074-1caeadb28cf8",
      description: "This is an awesome place with realy nice cabins."
    },
    {
      name       : "Desert valley",
      image      : "https://hd.unsplash.com/photo-1455763916899-e8b50eca9967",
      description: "A bit dry and hot, but there really is no one else around. "
    },
    {
      name       : "Green fields",
      image      : "https://hd.unsplash.com/photo-1468869196565-78ea346a98ee",
      description: "The fields are big and green but the tents are a bit close together."
    },
    {
      name       : "Magical forest",
      image      : "https://hd.unsplash.com/photo-1465695954255-a262b0f57b40",
      description: "There are only you and the trees here, and a few elves. "
    },
    {
      name       : "Moonligt grove",
      image      : "https://hd.unsplash.com/photo-1432817495152-77aa949fb1e2",
      description: "Tall, inviting trees and some nice facilities. "
    },
  ]



  // ***************************************************************************
  // Remove all the campgrounds
  Campground.remove(
    {},
    err => {

      if ( err ) {

        console.log( "ERROR: " + err );

      } else {

        console.log( "Removed all campgrounds" );

        // ***************************************************************************
        // Insert campgrounds
        campData.forEach( campSeed => {

          Campground.create(
            campSeed,
            ( err, campground ) => {

              if ( err ) {

                console.log( "ERROR: " + err );

              } else {

                console.log( "Added a campground" );

                // ***************************************************************************
                // Insert comments

                Comment.create(
                  {
                    text  : "This place is great, but the wifi suck!",
                    author: "Andy"
                  }, ( err, comment ) => {

                    if ( err ) {

                      console.log( "ERROR: " + err );

                    } else {

                      campground.comments.push( comment )
                      campground.save()

                      console.log( "Created a comment" );

                    }
                  }
                )


              }

            }
          )
        })


      }
    }
  )








}




// ****************************************************************************
// Exports

module.exports = seedDB
