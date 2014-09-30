define("workflowmanager/WMAOILayerTask", [
    "dojo/_base/declare",
    "workflowmanager/_BaseTask"
], function(declare, BaseTask) {
    return declare([BaseTask], {
        constructor: function (url) {
            this.url = url;
            this.disableClientCaching = true;
        },
        getServiceInfo: function (successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "", successCallBack, errorCallBack);
        },
        getJobIdField: function (successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "", function (data) {
                var JOB_ID = "JOB_ID";
                var jobIDField = null;
                var fieldName = null;

                var fields = data.fields;
                if (fields ==  null)
                    errorCallBack(new Error());
                
                for (var i=0,len=fields.length; i<len; i++) {
                    fieldName = fields[i].name.toString();
                    // check that fieldName is not null and ends with "JOB_ID"
                    if (fieldName != null && 
                            fieldName.toUpperCase().substring(fieldName.length - JOB_ID.length) == JOB_ID) {
                        if (jobIDField == null) 
                            jobIDField = fieldName;
                        else if (fieldName.toUpperCase().indexOf("JTX_JOBS_AOI") != -1)
                            // rewrite over the existing job ID only if it is an AOI job ID
                            jobIDField = fieldName;
                    }
                }
                if (jobIDField != null)
                    successCallBack(jobIDField);
                else
                    errorCallBack(new Error(errMsg));
            }, errorCallBack);
        }
    });
});