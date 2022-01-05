var mailer = require("../util/email.util").mailer;
var mongoose = require('mongoose');

// var JobHistorySchema = require("../../job/models/job-history.model"),
//     JobHistory = mongoose.model('JobHistory');

/** Queue Process handler for branching */
exports.notifier = function (job, done) {
    if (job.data.type === 'notification') {

        // jobHistory = new JobHistory();
        // jobHistory.jobName = job.data.name;
        // jobHistory.runStatus = "SUCCESS";
        // jobHistory.jobType = "notification";
        // jobHistory.jobData = job.data;
        // jobHistory.save();
        console.log("Message Queue - notification queue is processing a notification", job);
        done();
    } else {
        console.log("Message Queue - notification queue is processing an email", job);
        mailer(job, done);
    }
}