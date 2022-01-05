var express = require('express');
var router = express.Router();

const jobController = require("../controllers/job.controller");


router.route("/")
/* GET schedules listing */
.get(jobController.getJob)
/**POST create a schedule */
.post(jobController.createJob);

router.route("/:id")
/** PUT update a schedule */
//.put(jobController.updateJob)
/**DELETE delete schedules */
.delete(jobController.deleteJob);

router.route("/history/")
.get(jobController.getHistory);

module.exports = router;