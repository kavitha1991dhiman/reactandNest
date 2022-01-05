const azureDevOps = require("azure-devops-node-api");
const buildApi = require("azure-devops-node-api/BuildApi");
const git = require("simple-git/promise")();
const moment = require("moment");
var mongoose = require("mongoose");
const rimraf = require("rmfr");
var shell = require('shell-exec');

var JobHistorySchema = require("../models/job-history.model"),
  JobHistory = mongoose.model("JobHistory");
/** Queue Process handler for branching */
exports.brancher = function(job, done) {
  var jobName = job.data.jobName;

  console.log("Scan queue - running ", job);
  const ORG =  process.env.ORG ;
  const USER = process.env.REPOSERVICE_ACCOUNT  ;
  const PASS = process.env.ACCESSTOKEN ;

  const ORGURL = `https://dev.azure.com/${ORG}/`;
  const remote = `https://${USER}:${PASS}@dev.azure.com/${ORG}/${job.data.projectname}/_git/${job.data.repo}`;
    
   const projectname = job.data.projectname,
        repo = job.data.repo,
        targetbranch = job.data.targetBranch,
        bvtName = job.data.bvtname;
    
  let tmpLoc = "./tmp-" + jobName + "-" + Math.random();
  let releasename = "updatedlib"; //+ moment().format("YYYYMMDDhhmmss").toLocaleLowerCase();
  
return git
    .cwd("./")
    .then(success => {
      return git.clone(remote, tmpLoc);
    })
    .then(success => {
      return git.cwd(tmpLoc);
    })
    .then(dir => {
      return git.checkout("outdatedlib");
    })
    .then(branch => {
      return git.checkoutLocalBranch(releasename);
    })
    .then(lbranch => {
      return shell("npm install --prefix " + tmpLoc);
    })
    .then(install => {
      return shell("npm audit fix --prefix" + tmpLoc);
    })
    .then(cmdStat => {
      return git.diffSummary();
    })
    .then(summary => {
      console.log("summary", summary);
        if (summary.files.length > 0) {
            return git.commit("Committing package updates");
      } else {
        return  Promise.reject(false);
      }
    }).then(
        committed => {
            return git.push(remote, releasename); 
        })
    .then(pushed => {
            return runBVT(ORGURL, PASS, projectname, bvtName, releasename);
    }).then(bvtState => {
        if (false === bvtState) {
            return  Promise.reject(false);
        } else {
            return makePullRequest(ORGURL, PASS, projectname, repo, releasename, targetbranch);
        }
    })
    .then(pullRequest => {
      //store job run
      jobHistory = new JobHistory();
      jobHistory.jobName = jobName;
      jobHistory.jobType = "Scanning";
      jobHistory.runStatus = "SUCCESS";
      jobHistory.jobData = job.data;
      return jobHistory.save();
    })
    .then(saved => {
      console.log("ygg");
    })
    .finally(deleted => {
     console.log("cleaned");
        rimraf(tmpLoc);
        done();
    })
    .catch(err => {
      console.log("Error in Job Queue", err);
      //store job run
      jobHistory = new JobHistory();
      jobHistory.jobName = jobName;
      jobHistory.runStatus = "FAILED";
      jobHistory.jobType = "Scanning";
      jobHistory.jobData = job.data;
      jobHistory.save();
    });
}

function runBVT(orgurl, pat, projectname, bvtName, releasename) { 

let authHandler = azureDevOps.getPersonalAccessTokenHandler(
    pat
  );
    let buildConn = new buildApi.BuildApi(orgurl, [authHandler]);
  //TestDevops
return buildConn.getDefinitions(projectname, bvtName)
    .then(buildDefData => {
         return buildConn.queueBuild({ sourceBranch: releasename, definition: {id: buildDefData[0].id}}, projectname);
     })
    .then(queued => { 
        return new Promise((resolve, reject) => { 
            let timeout = setTimeout(() => {
                console.log("waiting");
                clearTimeout(timeout);
                resolve(buildConn.rest.get(queued.url));
            }, 60000);

        });
    }).then(queueState => {
        if(queueState.result.result ==="succeeded" && queueState.result.status === "completed")
            return Promise.resolve(true);
        else
            return Promise.resolve(false)
    })
    .catch(err => {
        return Promise.reject(err);
    });
}

function makePullRequest(orgUrl, pat, projectname,repo, releasename, targetbranch) {
  let authHandler = azureDevOps.getPersonalAccessTokenHandler(pat);
  let webApiConn = new azureDevOps.WebApi(orgUrl, authHandler);
    
  return webApiConn
    .getGitApi()
    .then(gitApi => {
      return gitApi.createPullRequest(
        {
          description: "Pull request for update and audit fixes",
          repository: {
            name: repo
          },
          sourceRefName: "refs/heads/"+releasename,
          targetRefName: "refs/heads/"+targetbranch,
          title: "Update and audit PR"
        },
        repo,
        projectname
      );
    })
    .then(pullReqStatus => {
        return Promise.resolve(true);
    })
    .catch(err => {
        return Promise.reject(err);
    });
}