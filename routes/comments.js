"use strict"

// *****************************************************************************
// *****************************************************************************
// Requires and basics

//Externals
const express = require( "express" )

// Own modules
const middleware = require( "../middleware" )




// *****************************************************************************
// *****************************************************************************
// App setup + Model imports

const router = express.Router({mergeParams: true})


const Campground = require( "../models/campground" )
const Comment    = require( "../models/comment" )




// *****************************************************************************
// *****************************************************************************
// Comments routes

router.get( "/new", middleware.isLoggedIn, ( req, res ) => {

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




router.post( "/", middleware.isLoggedIn, ( req, res ) => {

  // Get data from the request
  const findID = req.params.id
  const createComment = req.body.comment
  const currentUser = req.user

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

            // Add user to comment and save to it
            newComment.author.id = currentUser._id
            newComment.author.username = currentUser.username

            newComment.save()

            console.log( "NEW COMMENT" )
            console.log( newComment )

            // Add comment to campground
            foundCampground.comments.push( newComment )
            foundCampground.save()


            req.flash( "success", "Successfully added new comment" )

            res.redirect( `/campgrounds/${foundCampground._id}` )

          }

        })

    }
  })


})




// Edit comment
router.get( "/:comment_id/edit", middleware.isCommentOwner, ( req, res ) => {

  const currentCampground = req.params.id
  const currentComment = req.params.comment_id


  Comment.findById( currentComment, ( err, foundComment ) => {

    if ( err ) {

      console.log( `ERROR: ${err}` )

      res.redirect( "back" )

    } else {

      res.render( "comments/edit", {
        comment     : foundComment,
        campgroundId: currentCampground
      })

    }

  })
})




// Update comment
router.put( "/:comment_id", middleware.isCommentOwner, ( req, res ) => {

  const currentCampground = req.params.id
  const currentComment    = req.params.comment_id
  const updatesToComment  = req.body.comment


  Comment.findByIdAndUpdate( currentComment, updatesToComment, ( err, updatedComment ) => {

    if ( err ) {

      console.log( `ERROR: ${err}` )

      res.redirect( "back" )

    } else {

      req.flash( "success", "Updated comment" )

      // Redirect to show page
      res.redirect( `/campgrounds/${currentCampground}` )

    }

  })

})




// Delete comment
router.delete( "/:comment_id", middleware.isCommentOwner, ( req, res ) => {

  const currentCampground = req.params.id
  const currentComment    = req.params.comment_id

  Comment.findByIdAndRemove( currentComment, ( err ) => {

    if ( err ) {

      console.log( `ERROR: ${err}` )

    } else {

      req.flash( "success", "Deleted comment" )

      //Redirect
      res.redirect( `/campgrounds/${currentCampground}` )

    }

  })
})



// ****************************************************************************
// ****************************************************************************
// Exports

module.exports = router

