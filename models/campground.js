"use strict"

// ****************************************************************************
// Imports

const mongoose = require( "mongoose" )




// ****************************************************************************
// Schema definition

const campgroundSchema = mongoose.Schema({
  name       : String,
  image      : String,
  description: String,
  creator    : {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref : "Comment"
    }
  ]
})




// ****************************************************************************
// Exports

module.exports = mongoose.model( "Campground", campgroundSchema )
