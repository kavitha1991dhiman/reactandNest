"use strict";

/**
 * Module dependencies.
 */
var mongoose = require("mongoose"),
  validate = require("mongoose-validator"),
  Schema = mongoose.Schema;

var alphaNumericValidator = [
  validate({
    validator: "isLength",
    arguments: [3, 50],
    message: "Name should be between {ARGS[0]} and {ARGS[1]} characters"
  }),
  validate({
    validator: "matches",
    passIfEmpty: true,
    arguments: /^[a-zA-Z0-9\-]+$/i,
    message: "Name should contain alpha-numeric characters only"
  })
];

var cronRegexValidator = validate({
  validator: "matches",
  arguments: /((?<=^|\s)\*\/?\d*|(?<=^|\s)\d+(?=\s)|(?<=^|\s)\d+(?:\,\d+)+)/g
});
/**
 * Job Schema
 */
var JobSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: "",
    trim: true,
    required: "Job name cannot be blank",
    validate: alphaNumericValidator,
    unique: true
  },
  platformCategory: {
    type: String,
    default: "",
    trim: true
  },
  repo: {
    type: String,
    default: "",
    trim: true,
    required: "Repo name cannot be blank",
    validate: alphaNumericValidator
  },
  targetBranch: {
    type: String,
    default: "",
    trim: true,
    required: "target Branch name cannot be blank",
    validate: alphaNumericValidator
  },
  bvtUrl: {
    type: String,
    default: "",
    required: "BVT name cannot be blank",
    validate: alphaNumericValidator,
    trim: true
  },
  jobid: {
    type: String,
    default: "",
    trim: true
  },
  scanSchedule: {
    type: String,
    default: "",
    trim: true,
    validate: cronRegexValidator
  }
});

mongoose.model("Job", JobSchema);
