define("workflowmanager/WMNotificationTask", [
    "dojo/_base/declare",
    "workflowmanager/_BaseTask",
    "workflowmanager/_Util"
], function(declare, BaseTask, Util) {
    return declare([BaseTask], {
        constructor: function (url) {
            this.url = url;
            this.disableClientCaching = true;
        },
        subscribeToNotification: function (notificationTypeId, email, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.email = email;
    
            this.sendRequest(params, "/notificationTypes/" + notificationTypeId + "/subscribe", successCallBack, errorCallBack);
        },
        unsubscribeFromNotification: function (notificationTypeId, email, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.email = email;
    
            this.sendRequest(params, "/notificationTypes/" + notificationTypeId + "/unsubscribe", successCallBack, errorCallBack);
        },
        sendNotification: function (jobId, notificationType, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.type = notificationType;
            this.sendRequest(params, "/jobs/" + jobId + "/sendNotification", successCallBack, errorCallBack);
        },
        getAllChangeRules: function (successCallBack, errorCallBack) {
            var params = {};
    
            this.sendRequest(params, "/spatialNotification/changeRules", function (response) {
                successCallBack(response.changeRules);
            }, errorCallBack);
        },
        getChangeRule: function (ruleId, successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "/spatialNotification/changeRules/" + ruleId, successCallBack, errorCallBack);
        },
        queryChangeRules: function (name, description, searchType, user, successCallBack, errorCallBack) {
            var params = {};
            if (name != null && name != "") {
                params.name = name;
            }
            if (description != null && description != "") {
                params.description = description;
            }
            if (searchType != null && searchType != "") {
                params.searchType = searchType;
            }
            if (user != null && user != "") {
                params.user = this.formatDomainUsername(user);
            }
            this.sendRequest(params, "/spatialNotification/changeRules/query", function (response) {
                successCallBack(response.changeRules);
            }, errorCallBack);
        },
        addChangeRule: function (rule, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.name = rule.name;
            params.notifier = JSON.stringify(rule.notifier);
            params.evaluators = JSON.stringify(rule.evaluators);
            if (rule.description) {
                params.description = rule.description;
            }
            if (rule.summarize) {
                params.summarize = rule.summarize;
            }
            this.sendRequest(params, "/spatialNotification/changeRules/add", function (response) {
                successCallBack(response.changeRuleId);
            }, errorCallBack);
        },
        deleteChangeRule: function (ruleId, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            this.sendRequest(params, "/spatialNotification/changeRules/" + ruleId + "/delete", successCallBack, errorCallBack);
        },
        getDatabaseTime: function (dataWorkspaceId, successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "/spatialNotification/time/" + dataWorkspaceId, function (response) {
                successCallBack((new Util()).convertToDate(response.time));
            }, errorCallBack);
        },
        runSpatialNotificationOnHistory: function (dataWorkspaceId, from, to, logMatches, send, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.dataWorkspaceId = dataWorkspaceId;
            if (from) {
                params.from = Date.parse(from);
            }
            if (to) {
                params.to = Date.parse(to);
            }
            if (logMatches) {
                params.logMatches = logMatches;
            }
            if (send) {
                params.send = send;
            }
            this.sendRequest(params, "/spatialNotification/runOnHistory", function (response) {
                successCallBack(response.sessionId);
            }, errorCallBack);
        },
        getChangeRuleMatch: function (matchId, successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "/spatialNotification/matches/" + matchId, function (response) {
                response.changeTime = (new Util()).convertToDate(response.changeTime);
                successCallBack(response);
            }, errorCallBack);
        },
        getSessionMatches: function (sessionId, successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "/spatialNotification/esssions/" + sessionId, function (response) {
                var util = new Util();
                for (var i = 0; i < response.matches.length; i++) {
                    var match = response.matches[i];
                    match.changeTime = util.convertToDate(match.changeTime);
                }
                successCallBack(response.matches);
            }, errorCallBack);
        },
        notifySession: function (sessionId, deleteAfter, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            if (deleteAfter) {
                params.deleteAfter = deleteAfter;
            }
            this.sendRequest(params, "/spatialNotification/sessions/" + sessionId + "/notify", successCallBack, errorCallBack);
        }
    });
});
