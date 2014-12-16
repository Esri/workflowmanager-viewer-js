define("workflowmanager/WMWorkflowTask", [
    "dojo/_base/declare",
    "workflowmanager/_BaseTask",
    "workflowmanager/_Util"
], function(declare, BaseTask, Util) {
    return declare([BaseTask], {
        constructor: function (url) {
            this.url = url;
            this.disableClientCaching = true;
        },
        getWorkflowImageURL: function (jobId) {
            var timestamp = new Date().getTime();
            var imageUrl = this.url + "/jobs/" + jobId + "/workflow?f=image&ts=" + timestamp;
            if (this.token != null && this.token != "") {
                imageUrl += "&token=" + this.token;
            }
            if (this.proxyURL) {
                imageUrl = this.proxyURL + "?" + imageUrl;
            }        
            return imageUrl;
        },
        getWorkflowDisplayDetails: function (jobId, successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "/jobs/" + jobId + "/workflow", function (response) {
                var util = new Util();
                for (var i = 0; i < response.workflow.paths.length; i++) {
                    response.workflow.paths[i].labelColor = util.getDojoColor(response.workflow.paths[i].labelColor);
                    response.workflow.paths[i].lineColor = util.getDojoColor(response.workflow.paths[i].lineColor);
                }
                for (var i = 0; i < response.workflow.steps.length; i++) {
                    response.workflow.steps[i].fillColor = util.getDojoColor(response.workflow.steps[i].fillColor);
                    response.workflow.steps[i].labelColor = util.getDojoColor(response.workflow.steps[i].labelColor);
                    response.workflow.steps[i].outlineColor = util.getDojoColor(response.workflow.steps[i].outlineColor);
                }
                for (var i = 0; i < response.workflow.annotations.length; i++) {
                    response.workflow.annotations[i].fillColor = util.getDojoColor(response.workflow.annotations[i].fillColor);
                    response.workflow.annotations[i].outlineColor = util.getDojoColor(response.workflow.annotations[i].outlineColor);
                    response.workflow.annotations[i].labelColor = util.getDojoColor(response.workflow.annotations[i].labelColor);
                }
                successCallBack(response.workflow);
            }, errorCallBack);
        },
        getAllSteps: function (jobId, successCallBack, errorCallBack) {
            var params = {};        
            this.sendRequest(params, "/jobs/" + jobId + "/workflow/steps", function (response) {
                successCallBack(response.steps);
            }, errorCallBack);
        },
        getCurrentSteps: function (jobId, successCallBack, errorCallBack) {
            var params = {};        
            this.sendRequest(params, "/jobs/" + jobId + "/workflow/steps/current", function (response) {
                successCallBack(response.steps);
            }, errorCallBack);
        },
        getStep: function (jobId, stepId, successCallBack, errorCallBack) {
            var params = {};        
            this.sendRequest(params, "/jobs/" + jobId + "/workflow/steps/" + stepId, successCallBack, errorCallBack);
        },
        getStepDescription: function (jobId, stepId, successCallBack, errorCallBack) {
            var params = {};        
            this.sendRequest(params, "/jobs/" + jobId + "/workflow/steps/" + stepId + "/description", function (response) {
                successCallBack(response.stepDescription);
            }, errorCallBack);
        },
        getStepFileURL: function (jobId, stepId) {
            var fileUrl = this.url + "/jobs/" + jobId + "/workflow/steps/" + stepId + "/file";
            if (this.token != null && this.token != "") {
                fileUrl += "?token=" + this.token;
            }
            if (this.proxyURL) {
                fileUrl = this.proxyURL + "?" + fileUrl;
            }        
            return fileUrl;
        },
        assignSteps: function (jobId, stepIds, assignedType, assignedTo, user, successCallBack, errorCallBack) {
            var params = {};        
            params.user = this.formatDomainUsername(user);
            params.assignedType = assignedType;
            params.assignedTo = this.formatDomainUsername(assignedTo);
            params.steps = (new Util()).convertIdsToString(stepIds);
    
            this.sendRequest(params, "/jobs/job/" + jobId + "/workflow/steps/assign", successCallBack, errorCallBack);
        },
        canRunStep: function (jobId, stepId, user, successCallBack, errorCallBack) {
            var params = {};        
            params.user = this.formatDomainUsername(user);
            this.sendRequest(params, "/jobs/" + jobId + "/workflow/steps/" + stepId + "/canRun", function (response) {
                successCallBack(response.canRun);
            }, errorCallBack);
        },
        executeSteps: function (jobId, stepIds, user, auto, successCallBack, errorCallBack) {
            var params = {};        
            params.user = this.formatDomainUsername(user);
            params.steps = (new Util()).convertIdsToString(stepIds);
            if(auto){
                params.auto = true;
            }
            this.sendRequest(params, "/jobs/" + jobId + "/workflow/steps/execute", function (response) {
                successCallBack(response.executeInfo);
            }, errorCallBack);
        },
        markStepsAsDone: function (jobId, stepIds, user, successCallBack, errorCallBack) {
            var params = {};        
            params.user = this.formatDomainUsername(user);
            params.steps = (new Util()).convertIdsToString(stepIds);        
            this.sendRequest(params, "/jobs/" + jobId + "/workflow/steps/markAsDone", function (response) {
                successCallBack(response.executeInfo);
            }, errorCallBack);
        },
        moveToNextStep: function (jobId, stepId, returnCode, user, successCallBack, errorCallBack) {
            var params = {};        
            params.user = this.formatDomainUsername(user);
            if(returnCode != null){
                params.returnCode = returnCode;
            }
            this.sendRequest(params, "/jobs/" + jobId + "/workflow/steps/" + stepId + "/moveNext", successCallBack, errorCallBack);
        },
        resolveConflict: function (jobId, stepId, optionReturnCode, optionStepIds, user, successCallBack, errorCallBack) {
            var params = {};        
            params.user = this.formatDomainUsername(user);
            params.optionReturnCode = optionReturnCode;
            params.optionSteps = optionStepIds.toString();     
            this.sendRequest(params, "/jobs/" + jobId + "/workflow/steps/" + stepId + "/resolveConflict", successCallBack, errorCallBack);
        },
        setCurrentStep: function (jobId, stepId, user, successCallBack, errorCallBack) {
            var params = {};        
            params.user = this.formatDomainUsername(user);
            this.sendRequest(params, "/jobs/" + jobId + "/workflow/steps/" + stepId + "/setAsCurrent", successCallBack, errorCallBack);
        },
        getStepComments: function (jobId, stepId, successCallBack, errorCallBack) {
            var params = {};                      
            this.sendRequest(params, "/jobs/" + jobId + "/workflow/steps/" + stepId + "/comments", function (response) {
                successCallBack(response.comments);
            }, errorCallBack);
        },
        logStepComment: function (jobId, stepId, comment, user, successCallBack, errorCallBack) {
            var params = {};                 
            params.user = this.formatDomainUsername(user);
            if(comment != null && comment != ""){
                params.comment = comment;     
            }
            this.sendRequest(params, "/jobs/" + jobId + "/workflow/steps/" + stepId + "/logComment", successCallBack, errorCallBack);
        },
        recreateWorkflow: function(jobId, user, successCallBack, errorCallBack) {
            var params = {};                 
            params.user = this.formatDomainUsername(user);
            this.sendRequest(params, "/jobs/" + jobId + "/workflow/recreate", successCallBack, errorCallBack);
        }
    });
});
