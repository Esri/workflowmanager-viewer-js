define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    
    "dojo/i18n!./nls/Strings",
    "app/WorkflowManager/config/Topics",
    "./Alert", 

], function(
        declare, lang, topic, 
        i18n, appTopics, Alert ) {
            
    return declare(null, {
        
        // WM Tasks
        wmAOILayerTask: null,
        wmConfigurationTask: null,
        
        // WM server configuration info
        serviceInfo: null,
        users: null,
        groups: null,
        dataWorkspaceDetails: null,
        aoiJobIdField: null,
        commentActivityTypeId: null,
        
        loadServiceConfiguration: function (args) {
            var self = lang.hitch(this);
            
            this.user = args.user;
            this.wmAOILayerTask = args.wmAOILayerTask;
            this.wmConfigurationTask = args.wmConfigurationTask;
            
            if (!this.wmAOILayerTask && !this.wmConfigurationTask) {
                var errMsg = "Unable to load Workflow Manager configuration: AOI layer task or configuration task is null";
                console.log("Unable to load Workflow Manager configuration: AOI layer task or configuration task is null");
                self.errorHandler(errMsg, error);
            }
            
            //load service information
            console.log("Loading WM service info");
            this.wmConfigurationTask.getServiceInfo(function (data) {
                console.log("WM Service info: ", data);

                // service info
                self.serviceInfo = data;

                //sort priorities by value
                self.serviceInfo.jobPriorities = self.serviceInfo.jobPriorities.sort(function(a, b) {
                    return a.value - b.value;
                });
                
                // commentActivityTypeId
                self.commentActivityTypeId = self.getActivityType("Comment");
                
                // load other service configurations
                self.intializeJobID();
                self.loadUsers();

            }, function(error) {
                var errMsg = i18n.error.errorLoadingServiceInfo;
                console.log(errMsg, error);
                self.errorHandler(errMsg, error);
            });

        },
        
        intializeJobID: function() {
            var self = lang.hitch(this);
            console.log("Retrieving AOI job Id field");
            this.wmAOILayerTask.getJobIdField(function (data) {
                console.log("AOI Job Id Field: ", data);
                self.aoiJobIdField = data;
            }, function (error) {
                var errMsg = i18n.error.errorLoadingJobIdField;
                console.log(errMsg, error);
                self.errorHandler(errMsg, error);
            });
        },

        loadUsers: function() {
            var self = lang.hitch(this);
            console.log("Loading users");
            this.wmConfigurationTask.getAllUsers(function (data) {
                console.log("Users: ", data);
                self.users = data;
                self.loadGroups();
            }, function(error) {
                var errMsg = i18n.error.errorLoadingUsers;
                console.log(errMsg, error);
                self.errorHandler(errMsg, error);
                self.loadGroups();
            });
        },
        
        loadGroups: function() {
            var self = lang.hitch(this);
            console.log("Loading groups");
            this.wmConfigurationTask.getAllGroups(function (data) {
                console.log("Groups: ", data);
                self.groups = data;
                self.loadDataWorkspaces();
            }, function(error) {
                var errMsg = i18n.error.errorLoadingGroups;
                console.log(errMsg, error);
                self.errorHandler(errMsg, error);
                self.loadDataWorkspaces();
            });
        },
        
        loadDataWorkspaces: function() {
            var self = lang.hitch(this);
            console.log("Loading data workspace details");
            this.dataWorkspaceDetails = new Array();
            
            var dataWorkspaces = this.serviceInfo.dataWorkspaces;
            var length = dataWorkspaces.length;
            for (var i = 0; i < length; i++) {                            
                this.wmConfigurationTask.getDataWorkspaceDetails(dataWorkspaces[i].id, this.user, function(data) {
                    self.dataWorkspaceDetails.push(data);
                }, function(error) {
                    var errMsg = i18n.error.errorLoadingDataWorkspaceDetails;
                    console.log(errMsg, error);
                    // Suppress any errors on the UI.  Errors will be logged to server
                    //self.errorHandler(errMsg, error);
                });
            }
            
            topic.publish(appTopics.manager.serviceConfigurationLoaded, this, {
                serviceInfo: self.serviceInfo,
                users: self.users,
                groups: self.groups,
                dataWorkspaceDetails: self.dataWorkspaceDetails,
                aoiJobIdField: self.aoiJobIdField,
                commentActivityTypeId: self.commentActivityTypeId
            });
        },
        
        getActivityType: function(activityTypeName) {
            var activityTypes = this.serviceInfo.activityTypes;
            for (var i = 0; i < activityTypes.length; i++) {
                var activityType = activityTypes[i];
                if (activityType && activityType.name == activityTypeName)
                    return activityType.id;
            }
            return -1;
        },
        
        errorHandler: function (message, error) {
            Alert.show(i18n.error.title, message, error);
        }
    });
});
