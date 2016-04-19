'use strict';
/**
 * Module dependencies
 */
var mongoose = require('mongoose'), Schema = mongoose.Schema;
/**
 * Artist Schema
 */
var ArtistSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    yearEnrolled: {
        type: Number,
        required: 'Year Enrolled cannot be blank'
    },
    house: {
        type: String,
        default: '',
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});
mongoose.model('Artist', ArtistSchema);
