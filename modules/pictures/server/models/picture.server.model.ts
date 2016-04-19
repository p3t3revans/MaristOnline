'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Picture Schema
 *     title: { type: String },
    year: { type: Number },
    artistName: { type: String },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    medium: { type: String, default: 'Work on Paper' },
    picture: { type: String },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    frontPage : { type: Boolean, default : false}
 */
var PictureSchema = new Schema({
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
    content: {
        type: String,
        default: '',
        trim: true
    },
    artistName: {
        type: String,
        default: '',
        trim: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
    },
    medium: {
        type: String,
        default: 'Work on Paper',
        trim: true
    },
    picture: {
        type: String
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    subjectName: {
        type: String,
        default: '',
        trim: true
    },
    teacher: {
        type: String,
        default: '',
        trim: true
    },
    yearLevel: {
        type: Number
    },
    year: {
        type: Number
    },
    semester: {
        type: Number
    },
    frontPage: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Picture', PictureSchema);
