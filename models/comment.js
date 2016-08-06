"use strict"

// ****************************************************************************
// Imports

const mongoose = require( "mongoose" )



// ****************************************************************************
// Schema definition

const commentSchema = mongoose.Schema({
  text  : String,
  author: String
})



// ****************************************************************************
// Exports

module.exports = mongoose.model( "Comment", commentSchema )
