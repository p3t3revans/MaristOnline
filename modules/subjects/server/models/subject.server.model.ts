'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Subject Schema
 */
var SubjectSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  yearLevel: {
    type: Number,
    required: 'year level cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  year: {
    type: Number,
    required: 'year cannot be blank'
  },
  semester: {
    type: Number,
    required: 'semester cannot be blank'
  },
  teacher: {
    type: String,
    default: '',
    trim: true
  },
  artists: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Subject', SubjectSchema);
