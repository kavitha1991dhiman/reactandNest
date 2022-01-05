var Queue = require('bull');
var brancher = require('../../job/util/branchbreaker').brancher;
var notifier = require('../../notifications/util/notifications.util').notifier;
const jobqueue = new Queue("jobqueue");
const notifyqueue = new Queue("notifyqueue");

/**
 * Starts the queue processors for managing branching, notifcations and emails
 */
var startTheQueues = function (req, res, next) {

    console.log("Starting the queues ...");

    jobqueue.process("ScannerQueue", brancher);
};


exports.jobqueue = jobqueue;
exports.notifyqueue = notifyqueue;
exports.startTheQueues = startTheQueues;