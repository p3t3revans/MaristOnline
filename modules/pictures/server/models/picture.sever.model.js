'use strict';

/**
 * Module dependencies. 
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var pictureModel = new Schema({
    title: { type: String },
    year : { type: Number },
    artistName : { type: String },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    medium: { type: String, default: 'Work on Paper'},
    picture: { type: String },
    subject:{type: mongoose.Schema.Types.ObjectId, ref: 'Subject'}
});

mongoose.model('Picture', pictureModel);