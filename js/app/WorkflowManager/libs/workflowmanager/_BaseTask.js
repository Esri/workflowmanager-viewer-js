define("workflowmanager/_BaseTask", [
    "dojo/_base/declare",
    "esri/request"
], function(declare, esriRequest) {
    return declare(null, {
        // instance properties
        url : null,
        token: null,
        proxyURL : null,
        disableClientCaching: true,
        
        constructor: function(args) {
            this.url = args.url;
            this.token = args.token;
            this.proxyURL = args.proxyURL;
            this.disableClientCaching = args.disableClientCaching;
        },
        
        sendRequest: function(inputParams, appendURL, successCallBack, errorCallBack) {
            var requestUrl = (this.proxyURL) ? this.proxyURL + "?" + this.url : this.url;
            requestUrl += appendURL;
            inputParams.f = "json";
            if (this.token) {
                inputParams.token = this.token;
            }
            if (this.disableClientCaching) {
                inputParams._ts = new Date().getTime();
            }        
            var request = esriRequest({
                url: requestUrl,
                content: inputParams,
                handleAs: "json",
                callbackParamName: "callback"
            }, { useProxy: (this.proxyURL && (this.proxURL != "")) });
            request.then(successCallBack, errorCallBack);
        },

        sendRequestFile: function (formToSend, appendURL, successCallBack, errorCallBack) {
            var requestUrl = (this.proxyURL) ? this.proxyURL + "?" + this.url : this.url;
            requestUrl += appendURL;
            var inputParams = {};
            if (this.token) {
                inputParams.token = this.token;
            }
            if (this.disableClientCaching) {
                inputParams._ts = new Date().getTime();
            }
            var request = esriRequest({
                url: requestUrl,
                content: inputParams,
                form: formToSend,
                handleAs: "json",
                callbackParamName: "callback"
            }, { useProxy: (this.proxyURL && (this.proxURL != "")) });
            request.then(successCallBack, errorCallBack);
        },
        
        formatDomainUsername: function(username) {
            if (username && username.length > 0)
            {
                // replace all occurences of backslash with "|" in the string
                username = username.replace(/\\/g, '|');
            }
            return username;
        }     
    });
});