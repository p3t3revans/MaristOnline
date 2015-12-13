'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var artistSchema = new Schema({
  name: String,
  description: String,
  yearEnrolled:Number,
  active : { type :Boolean , default: true}
});

mongoose.model('Artists', artistSchema);