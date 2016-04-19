'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Year Schema
 */
var YearSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  year: {
    type: Number,
    required: 'Year cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Year', YearSchema);
