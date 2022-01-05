const sendmail = require('sendmail')();
var mongoose = require('mongoose');

var JobHistorySchema = require("../../job/models/job-history.model"),
    JobHistory = mongoose.model('JobHistory');

/** Queue Process handler for branching */
exports.mailer = function (job, done) {
    var jobName =  job.data.data.data.name;
    console.log("Email getting processed", job);
    sendmail({
        from: 'rajarshi.sharma@citrix.com',
        to: job.data.data.data.distributionList,
        subject: 'Test Release branching automation for '+ jobName,
        html: `The release branch for ${jobName} is going to be created. Please commit your code changes! `,
    }, function (err, reply) {
        if (err) {
            jobHistory = new JobHistory();
            jobHistory.jobName = jobName;
            jobHistory.runStatus = "FAILED";
            jobHistory.jobData = job.data;
            jobHistory.jobType = "emailing";
            jobHistory.save();
            console.log(err && err.stack);
            return Promise.reject(err);
        } else {
            jobHistory = new JobHistory();
            jobHistory.jobName = jobName;
            jobHistory.runStatus = "SUCCESS";
            jobHistory.jobType = "emailing"
            jobHistory.jobData = job.data;
            jobHistory.save();
            console.dir(reply);
        }
        done();
    });
}