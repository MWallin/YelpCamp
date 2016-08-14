"use strict"

// ****************************************************************************
// Imports

const mongoose = require( "mongoose" )
const passportLocalMongoose = require( "passport-local-mongoose" )



// ****************************************************************************
// Schema definition

const userSchema = mongoose.Schema({
  username: String,
  password: String
})



// ****************************************************************************
// Schema extensions

userSchema.plugin( passportLocalMongoose )



// ****************************************************************************
// Exports

module.exports = mongoose.model( "User", userSchema )
