define("workflowmanager/WMTokenTask", [
    "dojo/_base/declare",
    "workflowmanager/_BaseTask"
], function(declare, BaseTask) {
    return declare([BaseTask], {
        constructor: function (url) {
            this.url = url;
            this.disableClientCaching = true;
        },
        parseTokens: function (jobId, stringToParse, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.job = jobId;
            params.stringtoparse = stringToParse;
            this.sendRequest(params, "/tokens/parseTokens", function (response) {
                successCallBack(response.output);
            }, errorCallBack);
        }
    });
});