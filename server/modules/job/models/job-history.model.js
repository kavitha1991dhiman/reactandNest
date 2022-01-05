'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Job History Schema
 */
var JobHistorySchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    jobName: {
        type: String,
        trim: true,
    },
    jobType: {
        type: String,
        trim: true,
    },
    runStatus: {
        type: String,
        trim: true,
    },
    jobData: {
        type: Schema.Types.Mixed,
        default: '',
        trim: true
    },

});

mongoose.model('JobHistory', JobHistorySchema);