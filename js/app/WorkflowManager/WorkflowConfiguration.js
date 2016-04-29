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
        wmPOILayerTask: null,
        wmConfigurationTask: null,
        
        // WM server configuration info
        serviceInfo: null,
        users: null,
        groups: null,
        dataWorkspaceDetails: null,
        aoiJobIdField: null,
        poiJobIdField: null,
        commentActivityTypeId: null,
        
        loadServiceConfiguration: function (args) {
            var self = lang.hitch(this);
            
            this.user = args.user;
            this.wmAOILayerTask = args.wmAOILayerTask;
            this.wmPOILayerTask = args.wmPOILayerTask; 
            this.wmConfigurationTask = args.wmConfigurationTask;
            
            if (!this.wmAOILayerTask && !this.wmConfigurationTask) {
                console.log("Unable to load Workflow Manager configuration: AOI layer task or configuration task is null");
                self.errorHandler(i18n.error.errorLoadingWorkflowConfiguration, error);
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
                console.log("Unable to load service info", error);
                self.errorHandler(i18n.error.errorLoadingServiceInfo, error);
            });

        },
        
        intializeJobID: function() {
            var self = lang.hitch(this);
            console.log("Retrieving AOI job Id field");
            this.wmAOILayerTask.getJobIdField(function (data) {
                console.log("AOI Job Id Field: ", data);
                self.aoiJobIdField = data;
            }, function (error) {
                console.log("Unable to load job Id field from job AOI map service", error);
                self.errorHandler(i18n.error.errorLoadingJobIdField, error);
            });
            
            if (this.wmPOILayerTask != null) {
                console.log("Retrieving POI job Id field");
                this.wmPOILayerTask.getJobIdField(function (data) {
                    console.log("POI Job Id Field: ", data);
                    self.poiJobIdField = data;
                }, function (error) {
                    console.log("Unable to load job Id field from job POI map service", error);
                    self.errorHandler(i18n.error.errorLoadingJobIdFieldPOI, error);
                });
            }
        },

        loadUsers: function() {
            var self = lang.hitch(this);
            console.log("Loading users");
            this.wmConfigurationTask.getAllUsers(function (data) {
                console.log("Users: ", data);
                self.users = data;
                self.loadGroups();
            }, function(error) {
                console.log("Unable to load users", error);
                self.errorHandler(i18n.error.errorLoadingUsers, error);
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
                console.log("Unable to load groups", error);
                self.errorHandler(i18n.error.errorLoadingGroups, error);
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
                    console.log("Unable to load data workspace details", error);
                    // Suppress any errors on the UI.  Errors will be logged to server
                    //self.errorHandler(i18n.error.errorLoadingDataWorkspaceDetails, error);
                });
            }
            
            topic.publish(appTopics.manager.serviceConfigurationLoaded, this, {
                serviceInfo: self.serviceInfo,
                users: self.users,
                groups: self.groups,
                dataWorkspaceDetails: self.dataWorkspaceDetails,
                aoiJobIdField: self.aoiJobIdField,
                poiJobIdField: self.poiJobIdField,
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
            topic.publish(appTopics.manager.hideProgress, this); 
            Alert.show(i18n.error.title, message, error);
        }
    });
});
