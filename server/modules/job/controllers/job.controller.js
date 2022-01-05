var Queue = require("bull");
const branchqueue = require("../../queue/util/queuemanager").jobqueue;
const emailqueue = require("../../queue/util/queuemanager").emailqueue;
const notifyqueue = require("../../queue/util/queuemanager").notifyqueue;

var mongoose = require("mongoose");
var JobSchema = require("../models/job.model"),
  Job = mongoose.model("Job");

var JobHistorySchema = require("../models/job-history.model"),
  JobHistory = mongoose.model("JobHistory");

exports.getJob = function(req, res) {
  Job.find().then(jobs => {
    res.jsonp(jobs);
  });
};
exports.getHistory = function(req, res) {
  JobHistory.find().then(history => {
    res.jsonp(history);
  });
};

exports.createJob = function(req, res) {
  var job = new Job(req.body);
  //job gets submitted for branching every schedule
  branchqueue
      .add("ScannerQueue", { jobName: job.name, projectname: job.name, repo: job.repo, targetBranch:job.targetBranch, bvtname: job.bvtUrl }, {
      repeat: {
        cron: job.scanSchedule,
        jobId: job.id
      }
    })
    .then(jobcreatesuccess => {
      return job.save();
    })
    .then(dbSaveSuccess => {
      //respond to client
      res.status(201).json({
        message: "Job Created!"
      });
    })
    .catch(err => {
      console.log("saving error", err);
      res.status(400).jsonp({
        message: "Couldnt create record!"
      });
    });
}

exports.deleteJob = function(req, res) {
  var id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: "Invalid item"
    });
  }
  Job.findById(id)
    .then(job => {
      //remove branching job
      return branchqueue.removeRepeatable("ScannerQueue", {
        jobId: id,
        cron: job.scanSchedule
      });
    })
    .then(removesuccess => {
      //remove from mongoDB
      return Job.deleteOne({ _id: id });
    })
    .then(success => {
      res.status(200).json({
        message: "record deleted"
      });
    })
    .catch(err => {
      console.log("delete error", err);
      res.status(400).json({
        message: "couldnt delete"
      });
    });
}
