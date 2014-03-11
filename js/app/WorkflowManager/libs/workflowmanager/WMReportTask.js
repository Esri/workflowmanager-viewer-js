define("workflowmanager/WMReportTask", [
    "dojo/_base/declare",
    "workflowmanager/_BaseTask"
], function(declare, BaseTask) {
    return declare([BaseTask], {
        timeZoneOffset: 0,
        constructor: function (url) {
            this.url = url;
            this.disableClientCaching = true;
            this.timeZoneOffset = 0;
        },
        getAllReports: function (successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "/reports", function (response) {
                successCallBack(response.reports);
            }, errorCallBack);
        },
        getReportData: function (reportId, user, successCallBack, errorCallBack) {
            var params = {};
            // user parameter is now required at 10.1
            params.user = this.formatDomainUsername(user);
            if (this.timeZoneOffset != 0) {
                params.timeZoneOffset = this.timeZoneOffset;
            }
            this.sendRequest(params, "/reports/" + reportId + "/data", function (response) {
                successCallBack(response.reportData);
            }, errorCallBack);
        },
        getReportStylesheet: function (reportId, successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "/reports/" + reportId + "/stylesheet", function (response) {
                successCallBack(response.stylesheet);
            }, errorCallBack);
        },
        generateReport: function (reportId, user, successCallBack, errorCallBack) {
            var params = {};
            // user parameter is now required at 10.1
            params.user = this.formatDomainUsername(user);
            if (this.timeZoneOffset != 0) {
                params.timeZoneOffset = this.timeZoneOffset;
            }
            this.sendRequest(params, "/reports/" + reportId + "/generate", function (response) {
                successCallBack(response.reportContent);
            }, errorCallBack);
        },
        getReportContentURL: function (reportId, user) {
            var contentUrl = this.url + "/reports/" + reportId + "/generate";
            // make it work on 10.1
            contentUrl += "?f=file";
            if (user != null && user != "") {
                contentUrl += "&user=" + this.formatDomainUsername(user);
            }
            if (this.token != null && this.token != "") {
                contentUrl += "&token=" + this.token;
            }
            if (this.timeZoneOffset != 0) {
                contentUrl += "&timeZoneOffset=" + this.timeZoneOffset;
            }
            if (this.proxyURL) {
                contentUrl = this.proxyURL + "?" + contentUrl;
            }
            return contentUrl;
        },
        useLocalTimeZoneOffset: function() {
            this.timeZoneOffset = -(new Date().getTimezoneOffset());
        }
    });
});