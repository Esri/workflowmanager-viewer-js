define([
    
    // dojo
    "dojo/topic", 
    "dojo/dom", 
    "dojo/dom-style", 
    "dojo/dom-construct", 
    "dojo/dom-class", 
    "dojo/dom-geometry", 
    "dojo/_base/array", 
    "dojo/_base/lang", 
    "dojo/_base/window", 
    "dojo/_base/json", 
    "dojo/_base/connect", 
    "dojo/string", 
    "dojo/when", 
    "dojo/aspect", 
    "dojo/fx", 
    "dojo/_base/fx", 
    "dojo/date/locale",
    "dojo/query",
    "esri/tasks/QueryTask", 
    "esri/tasks/query",
    
    // dijits
    "dijit/registry", 
    "dijit/Dialog", 
    "dijit/layout/BorderContainer", 
    "dijit/layout/TabContainer", 
    "dijit/layout/ContentPane", 
    "dijit/form/FilteringSelect", 
    "dijit/form/TextBox", 
    "dijit/form/Button", 
    "dijit/form/DropDownButton", 
    "dijit/form/ComboBox", 
    "dijit/form/RadioButton",

    //esri dijit
    "esri/dijit/Geocoder",
    
    // WM API
    "workflowmanager/WMAOILayerTask", 
    "workflowmanager/WMConfigurationTask", 
    "workflowmanager/WMJobTask", 
    "workflowmanager/WMReportTask", 
    "workflowmanager/WMTokenTask", 
    "workflowmanager/WMWorkflowTask", 
    "workflowmanager/Enum", 
    "workflowmanager/supportclasses/JobQueryParameters",
    
    // WM Templates
    "app/WorkflowManager/config/Topics", 
    "./WorkflowManager/Alert", 
    "./WorkflowManager/Header", 
    "./WorkflowManager/Filter", 
    "./WorkflowManager/Grid", 
    "./WorkflowManager/Statistics", 
    "./WorkflowManager/Properties", 
    "./WorkflowManager/ExtendedProperties", 
    "./WorkflowManager/Notes", 
    "./WorkflowManager/Workflow", 
    "./WorkflowManager/Attachments", 
    "./WorkflowManager/AttachmentItem", 
    "./WorkflowManager/History", 
    "./WorkflowManager/Aoi", 
    "./WorkflowManager/Holds", 
    "dojo/text!./WorkflowManager/templates/Map.html", 
    "./WorkflowManager/widgets/aoiFunctions",
    
    // WM Utils
    "./WorkflowManager/utils/MapUtil",
    "./WorkflowManager/utils/WMUtil",
    
    // GIS widgets
    "widget/gis/EsriMap", 
    "widget/gis/EsriLegend", 
    "widget/gis/Coordinates", 
    "widget/gis/BasemapGallery", 
    "widget/gis/DrawTool", 
    "widget/Login",
    
    // Utils
    "utils/Expander",
    
    // data handling
    "dojo/store/Memory",
    
    // i18n
    "dojo/i18n!./WorkflowManager/nls/Strings",
    
    // App configuration
    "./WorkflowManager/config/AppConfig",
    
    // Workflow configuration
    "./WorkflowManager/WorkflowConfiguration"

], function (
    topic, dom, domStyle, domConstruct, domClass, domGeom, arrayUtil, lang, win, json, connect, string, when, aspect, coreFx, baseFx, locale, query, QueryTask, Query,
    registry, Dialog, BorderContainer, TabContainer, ContentPane, FilteringSelect, TextBox, Button, DropDownButton, ComboBox, RadioButton,
    Geocoder,
    WMAOILayerTask, WMConfigurationTask, WMJobTask, WMReportTask, WMTokenTask, WMWorkflowTask, Enum, JobQueryParameters,
    appTopics, Alert, Header, Filter, Grid, Statistics, Properties, ExtendedProperties, Notes, Workflow, Attachments, AttachmentItem, History, Aoi, Holds, mapTemplate, AoiFunctionsTemplate,
    MapUtil, WMUtil,
    EsriMap, EsriLegend, Coordinates, BasemapGallery, DrawTool, Login,
    Expander,
    Memory,
    i18n,
    config,
    WorkflowConfiguration
    ) {

    //anonymous function to load CSS files required for this module
    ( function() {
            var css = [require.toUrl("./js/app/WorkflowManager/css/WorkflowManager.css")];
            var head = document.getElementsByTagName("head").item(0), link;
            for (var i = 0, il = css.length; i < il; i++) {
                link = document.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = css[i].toString();
                head.appendChild(link);
            }
        }());

    return {
        // Loading
        loading : true,

        // WM API
        wmServerUrl : null,
        wmAOILayerTask : null,
        wmConfigurationTask : null,
        wmJobTask : null,
        wmReportTask : null,
        wmTokenTask : null,
        wmWorkflowTask : null,
        
        // AOI query layer objects
        aoiMapServiceUrl: null,
        aoiMapServiceLayerID : 0,
        aoiMapServiceQueryLayerUrl : null,
        aoiDynamicLayerDefinitions : null,

        // Token service url
        tokenServerUrl : null,

        // WM configuration
        serviceInfo : null,
        users : null,
        groups : null,
        dataWorkspaceDetails : null,
        aoiJobIdField : null,
        commentActivityTypeId : null,

        // Current user
        authenticationMode : "none",
        isWindowsUser : false,
        user : null, // username
        userDetails : null, // user detailed information
        userQueries: null,

        userPrivileges : {
            canAssignAnyJob : false,
            canAddAttachesForHeldJobs : false,
            canAddCommentsForHeldJobs : false,
            canChangeJobOwner : false,
            canCloseJob : false,
            canCreateJob : false,
            canDeleteJobs : false,
            canGroupJobAssign : false,
            canIndividualJobAssign : false,
            canManageAOI : false,
            canManageAttachments : false,
            canManageDataWorkspace : false,
            canManageExtendedProperties : false,
            canManageHolds : false,
            canManageLinkedProperties : false,
            canManageVersion : false,
            canRecreateWorkflow : false,
            canReopenClosedJobs : false,
            canUpdateProperties : false,
            canUpdatePropsForHeldJobs : false,
            AOIOverlapOverride : false,
        },

        // Current job
        currentJob : null,
        currentJobHolds : null,
        jobHasActiveHold : null,

        // passed job/query
        jobIDInURL : null,
        queryIDInURL : null, 

        // Current query results
        queryResults: null,
        currentQueryId: null,
        selectedQuery: null,
        savedQuery: null,

        //i18n
        i18n_SearchResults: i18n.filter.results,
        i18n_NumberJobs: i18n.grid.numberJobs,

        // Assignment group
        currentAssignmentGroup: null,

        // Updating locks
        updatingAttachments: null,
        updatingExtendedProperties: null,
       
        handleURL: function() {
            //grab url and parse it,
            //pass teh appropriate id to teh correct variable
            var url = window.location.toString().split("#")[0];
            var index = url.indexOf("?");
            if (index > -1) {
                var endURL = url.substr(index + 1);
                if (endURL == "true") {
                    config.app.Reloaded = endURL;
                } else {

                    var jobToShow = endURL.split("?")[0];
                    config.app.Reloaded = endURL.split("?")[1];
                    var paramName = jobToShow.split("=")[0].toString().toUpperCase();
                    var idNumber = jobToShow.split("=")[1];
                    if (paramName == "JOBID") {
                        this.jobIDInURL = idNumber;
                    } else if (paramName == "QUERYID") {
                        this.queryIDInURL = idNumber;
                    }
                }
            }
        },

        startup: function (args) {
            
            //handle the url and any flags passed with it
            this.handleURL();
           
            //loading screen strings
            dom.byId("loadingAppTitle").innerHTML = i18n.header.title;
            dom.byId("loadingAppSubTitle").innerHTML = i18n.header.subHeader;
            dom.byId("loadingMessage").innerHTML = i18n.loading.loading;

            this.wmServerUrl = config.app.ServiceRoot;
            
            this.aoiMapServiceUrl = config.app.jobAOILayer.url;
            this.aoiMapServiceLayerID = config.app.jobAOILayer.AOILayerID != null ? config.app.jobAOILayer.AOILayerID : 0; 
            this.aoiMapServiceQueryLayerUrl = this.aoiMapServiceUrl + "/" + this.aoiMapServiceLayerID;
            this.aoiDynamicLayerDefinitions = MapUtil.formatLayerDefinitions([
                    MapUtil.getLayerDefinition(this.aoiMapServiceLayerID, "1=0")
                ]);            
            
            this.tokenServerUrl = config.app.TokenService;
            this.initTasks();

            // Theme
            this.initTheme(config.theme);

            // Authenticate user
            this.authenticationMode = config.app.AuthenticationMode != null ? config.app.AuthenticationMode.toLowerCase() : "none";
            switch (this.authenticationMode) {
                case "windows" :
                    if (args && args.user) {
                        // log in user automatically
                        this.user = args.user;
                        this.isWindowsUser = true;
                        this.validateUser(this.user);
                    }
                    else {
                        this.errorHandler(i18n.error.errorRetrievingWindowsUser);
                    }
                    break;
                case "token" :
                    this.initLogin();
                    break;
                case "none" :
                    if (config.app.AutoLogin == false || config.app.Reloaded) {
                        this.initLogin();
                    } else if (config.app.AutoLogin ) {
                        this.initLogin(config.app.DefaultUser);
                    }
                    break;  
                default:
                    var errMsg = i18n.error.errorInvalidAuthenticationMode.replace("{0}", this.authenticationMode);
                    this.errorHandler(errMsg);
                    break;
            }
        },

        initTheme : function(theme) {
            var css;
            switch (theme) {
                case "bootstrap":
                    css = [
                            "css/themes/" + theme + "/dojo/" + theme + ".css", 
                            "css/themes/" + theme + "/esri/css/esri.css", 
                            "css/themes/" + theme + "/dgrid/css/dgrid.css", 
                            "css/themes/" + theme + "/dgrid/css/skins/skin.css"
                    ];
                    break;
                case "nihilo":
                case "soria":
                case "tundra":
                case "claro":
                    css = [
                            require.toUrl("dijit/themes/" + theme + "/" + theme + ".css"), 
                            require.toUrl("esri/css/esri.css"), 
                            require.toUrl("dgrid/css/dgrid.css"), 
                            require.toUrl("dgrid/css/skins/" + theme + ".css")
                    ];
                    break;
                default:
                    css = [
                            require.toUrl("dijit/themes/claro/claro.css"), 
                            require.toUrl("esri/css/esri.css"), 
                            require.toUrl("dgrid/css/dgrid.css"), 
                            require.toUrl("dgrid/css/skins/claro.css")
                    ];
                    break;

            }
            // add the theme as a class to the body
            domClass.add(win.body(), theme);

            // add the actual link reference to the head
            var head = document.getElementsByTagName("head").item(0);
            var link;
            for (var i = 0, il = css.length; i < il; i++) {
                link = document.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = css[i].toString();
                head.appendChild(link);
            }
        },

        findWithAttr : function(array, attr, value) {
            //if array is defined
            if (array) {
                for (var i = 0; i < array.length; i += 1) {
                    if (array[i][attr] === value) {
                        return i;
                    }
                }
            }
        },

        initTasks : function() {
            console.log("initTasks called");

            // proxy defaults
            esri.config.defaults.io.proxyUrl = config.proxy.url;
            esri.config.defaults.io.alwaysUseProxy = config.proxy.alwaysUseProxy;

            this.wmAOILayerTask = new WMAOILayerTask(this.aoiMapServiceQueryLayerUrl);
            this.wmConfigurationTask = new WMConfigurationTask(this.wmServerUrl);
            this.wmReportTask = new WMReportTask(this.wmServerUrl);
            this.wmJobTask = new WMJobTask(this.wmServerUrl);
            this.wmWorkflowTask = new WMWorkflowTask(this.wmServerUrl);
            this.wmTokenTask = new WMTokenTask(this.wmServerUrl);

            // associate the token with each task
            if (this.token != null && this.token != "") {
                this.wmAOILayerTask.token = this.token;
                this.wmConfigurationTask.token = this.token;
                this.wmReportTask.token = this.token;
                this.wmJobTask.token = this.token;
                this.wmWorkflowTask.token = this.token;
                this.wmTokenTask.token = this.token;
            }
        },

        initConfig : function() {
            console.log("initConfig called");
            var self = lang.hitch(this);

            self.banner.content.setUserName(self.userDetails.fullName);

            //set user properties (job properties)
            self.tabProperties.content.setUserProperties({
                user : self.user,
                userDetails : self.userDetails,
                userPrivileges : self.userPrivileges,
            });

            //set user properties (filter)
            self.filter.content.setUserProperties({
                user : self.user,
                userDetails : self.userDetails,
                userPrivileges : self.userPrivileges,
            });

            //loop through user queries to get list of queries
            var userQueries = [];
            arrayUtil.forEach(self.userQueries.containers, function(container) {
                arrayUtil.forEach(container.queries, function(query) {
                    userQueries.push({
                        "name" : query.name,
                        "id" : query.id
                    });
                });
            });

            //set filter vars and activate radio if content exists
            if (userQueries.length) {
                self.filter.content.userQueries = userQueries;
                self.filter.content.queryTypeUser.set("disabled", false);
            }

            //load general information
            console.log("Loading WM service info");
            self.showProgress();
            var wmConfig = new WorkflowConfiguration();
            wmConfig.loadServiceConfiguration({
                user : this.user,
                wmAOILayerTask : this.wmAOILayerTask,
                wmConfigurationTask : this.wmConfigurationTask
            });
        },

        onServiceConfigurationLoaded : function() {
            var self = lang.hitch(this);
            console.log("Populating components with service configuration");

            //Public queries
            //console.log("Populating public queries");
            var queries = self.loadQueryData(self.serviceInfo.publicQueries);

            //set filter vars and activate radio if content exists
            if (queries.length) {
                self.filter.content.publicQueries = queries;
                self.filter.content.queryTypePublic.set("disabled", false);
            }
            // TODO Isn't this doing the same thing?
            // populate filter
            self.filter.content.setJobQueries(queries);
            self.filter.content.setQueryStore(self.serviceInfo.publicQueries, self.userQueries);

            //Add no workspace option
            var noDataWorkspace = {
                id : "0",
                name : i18n.properties.noDataWorkspace
            };
            self.serviceInfo.dataWorkspaces.unshift(noDataWorkspace);

            // populate properties
            //console.log("Populating job properties tab");
            self.tabProperties.content.populateDropdowns({
                jobTypes : self.serviceInfo.jobTypes,
                jobStatuses : self.serviceInfo.jobStatuses,
                dataWorkspaces : self.serviceInfo.dataWorkspaces,
                jobPriorities : self.serviceInfo.jobPriorities
            });

            // populate holds dropdown
            //console.log("Populating holds tab");
            self.tabHolds.content.populateDropdowns({
                holdTypes : self.serviceInfo.holdTypes
            });

            // populate filter create job dropdowns
            //console.log("Populating create jobs dialog");
            self.filter.content.populateDropdowns(this, {
                jobTypes : self.serviceInfo.jobTypes,
                dataWorkspaces : self.serviceInfo.dataWorkspaces,
                jobPriorities : self.serviceInfo.jobPriorities
            });

            // populate users
            //console.log("Populating users");
            self.tabProperties.content.populateUsers(self.users);
            self.filter.content.populateUsers(self.users);

            // populate groups
            //console.log("Populating groups");
            self.tabProperties.content.populateGroups(self.groups);
            self.filter.content.populateGroups(self.groups);

            //console.log("Populating map aoiJobIdField");
            self.myMap.jobIdField = self.aoiJobIdField;

            aspect.around(this.tabs, "selectChild", function(selectChild) {
                return function(page) {
                    var oldVal = self.tabs.get("selectedChildWidget");
                    var newVal = arguments[0];
                    //console.log("selected child changed from ", oldVal.title, " to ", newVal.title);
                    
                    self.doSelectChild = selectChild;
                    self.selectChildObject = this;
                    self.selectChildArgs = arguments;

                    // moving from properties to any other tab, prompt user to save updates as needed
                    if ((oldVal.id == self.tabProperties.id) && (newVal.id != self.tabProperties.id)) {
                        self.tabProperties.content.closingProps();
                    }
                    if ((oldVal.id == self.tabExtendedProperties.id) && (newVal.id != self.tabExtendedProperties.id)) {
                        self.tabExtendedProperties.content.closingExtendedProps();
                    }
                    
                    // refresh tab contents
                    switch (newVal.id) {
                        case self.tabProperties.id:
                            //refresh job data
                            self.getJobById({
                                jobId : self.selectedRowId,
                                updateWorkflow : false,
                                zoomToPolygon : false
                            });
                            //temp clear update properties notification
                            self.tabProperties.content.updateCallback("");
                            selectChild.apply(this, arguments);
                            break;
                        case self.tabWorkflow.id:
                            //refresh job data
                            self.updateWorkflow();
                            self.getJobById({
                                jobId : self.selectedRowId,
                                updateWorkflow : false,
                                zoomToPolygon : false
                            });
                            selectChild.apply(this, arguments);
                            break;
                        case self.tabHistory.id:
                            //update tab
                            self.updateHistory();
                            selectChild.apply(this, arguments);
                            break;
                        case self.tabNotes.id:
                            //update tab
                            self.updateNotes();
                            selectChild.apply(this, arguments);
                            break;
                        case self.tabHolds.id:
                            //update tab
                            self.updateHolds();
                            selectChild.apply(this, arguments);
                            break;
                        case self.tabExtendedProperties.id:
                            //update tab
                            self.updateExtendedProperties(self.currentJob.id);
                            selectChild.apply(this, arguments);
                            break;
                        case self.tabAttachments.id:
                            
                            self.updateAttachments(self.currentJob.id);
                            selectChild.apply(this, arguments);
                            break;
                        default:
                            break;
                    }
                };

            });

            console.log("Done with service configuration");
        },

        checkAttachmentPrivileges: function () {
            //check for user privileges and job properites
            var jobHold = this.jobHasActiveHold;
            var canAddHeld = this.userPrivileges.canAddAttachesForHeldJobs;
            var canManageAttach = this.userPrivileges.canManageAttachments;
            var jobClosed = (this.currentJob.stage == Enum.JobStage.CLOSED);
            if (jobHold) {
                this.jobWarning.innerHTML = i18n.header.onHold;
            } else if (jobClosed) {
                this.jobWarning.innerHTML = i18n.header.closed;
            } else {
                this.jobWarning.innerHTML = "";
            }
            return {jobHold: jobHold, canAddHeld: canAddHeld, canManageAttach: canManageAttach, jobClosed: jobClosed};
        },


        switchTabs : function() {
            var self = lang.hitch(this);
            if (this.selectChildArgs[0].id == this.tabWorkflow.id) {
                self.updateWorkflow();
            }
            this.doSelectChild.apply(this.selectChildObject, this.selectChildArgs);
        },

        loadQueryData : function(queryData) {
            var queries = [];
            if (queryData) {
                var self = lang.hitch(this);
                // TODO Preserve query containers, for now just add the query to the list
                //add each folder
                arrayUtil.forEach(queryData.containers, function(container) {
                    self.addQueriesFromContainer(container, queries);
                });
                //add each query under root, if any
                arrayUtil.forEach(queryData.queries, function(query) {
                    queries.push({
                        "name" : query.name,
                        "id" : query.id
                    });
                });
            }
            return queries;
        },

        addQueriesFromContainer : function(container, queries) {
            if (container) {
                var self = lang.hitch(this);
                //add each query
                arrayUtil.forEach(container.queries, function(query) {
                    queries.push({
                        "name" : query.name,
                        "id" : query.id
                    });
                });
                //add queries from each container
                arrayUtil.forEach(container.containers, function(item) {
                    self.addQueriesFromContainer(item, queries);
                });
            }
        },

        setQueryNameFromId: function(queryId) {
            var self = lang.hitch(this);
            arrayUtil.forEach(self.filter.content.publicQueries, function(query) {
                if (query.id == queryId) {
                    self.savedQuery = query.name;
                }
            });
            arrayUtil.forEach(self.filter.content.userQueries, function (query) {
                if (query.id == queryId) {
                    self.savedQuery = query.name;
                }
            });
        },

        initUserPrivileges : function(privileges) {
            for (var i = 0; i < privileges.length; i++) {
                var privilegeName = privileges[i].name;
                switch (privilegeName) {
                    case "AssignAnyJob":
                        this.userPrivileges.canAssignAnyJob = true;
                        break;
                    case "CanAddAttachesForHeldJobs":
                        this.userPrivileges.canAddAttachesForHeldJobs = true;
                        break;
                    case "CanAddCommentsForHeldJobs":
                        this.userPrivileges.canAddCommentsForHeldJobs = true;
                        break;
                    case "CanChangeJobOwner":
                        this.userPrivileges.canChangeJobOwner = true;
                        break;
                    case "CanUpdatePropsForHeldJobs":
                        this.userPrivileges.canUpdatePropsForHeldJobs = true;
                        break;
                    case "CloseJob":
                        this.userPrivileges.canCloseJob = true;
                        break;
                    case "CreateJob":
                        this.userPrivileges.canCreateJob = true;
                        break;
                    case "DeleteJobs":
                        this.userPrivileges.canDeleteJobs = true;
                        break;
                    case "GroupJobAssign":
                        this.userPrivileges.canGroupJobAssign = true;
                        break;
                    case "IndividualJobAssign":
                        this.userPrivileges.canIndividualJobAssign = true;
                        break;
                    case "ManageAOI":
                        this.userPrivileges.canManageAOI = true;
                        break;
                    case "ManageAttachments":
                        this.userPrivileges.canManageAttachments = true;
                        break;
                    case "ManageDataWorkspace":
                        this.userPrivileges.canManageDataWorkspace = true;
                        break;
                    case "ManageExtendedProperties":
                        this.userPrivileges.canManageExtendedProperties = true;
                        break;
                    case "ManageHolds":
                        this.userPrivileges.canManageHolds = true;
                        break;
                    case "ManageLinkedProperties":
                        this.userPrivileges.canManageLinkedProperties = true;
                        break;
                    case "ManageVersion":
                        this.userPrivileges.canManageVersion = true;
                        break;
                    case "CanRecreateWorkflow":
                        this.userPrivileges.canRecreateWorkflow = true;
                        break;
                    case "CanReopenClosedJobs":
                        this.userPrivileges.canReopenClosedJobs = true;
                        break;
                    case "UpdateProperties":
                        this.userPrivileges.canUpdateProperties = true;
                        break;
                    case "AOIOverlapOverride":
                        this.userPrivileges.AOIOverlapOverride = true;
                        break;
                }
            }
        },

        getJobsByQueryID : function(queryID, reset) {
            var self = lang.hitch(this);
            //number of times it will try to retrieve results
            var queryTryTotal = 2;
            var queryTryCount = 0;

            this.currentQueryId = queryID;
            this.selectedQuery = this.savedQuery;
            //console.log("Query ID:", queryID);
            //if results aren't returned within 2 seconds it will show progress bar
            var progressTimer = setTimeout(function () { self.showProgress() }, 10000);

            //query function
            var queryById = function () {
                self.wmJobTask.queryJobsByID(queryID, self.user, lang.hitch(self, function (data) {  // execute “AllJobs” query
                    //hide progress bar when results are returned
                    self.hideProgress();
                    //clear progress timer so it wont show progress bar if it hasn't already
                    clearTimeout(progressTimer);
                    //clear timeout function so it stops retrying
                    clearInterval(queryTimeout);

                    console.log("queryJobsByID succeeded: ", data);

                    //first check jobIDInURL, if true then short circuit and only grab one job
                    //then check queryIDInURL, if true set it to false to avoid loop and call getjobsbyqueryid again
                    //otherwise continue as usual and get all jobs
                    if (self.jobIDInURL) {
                        self.selectedQuery = self.i18n_SearchResults;
                        self.getJobsByJobIDs([self.jobIDInURL]);
                        self.jobIDInURL = null;
                    } else if (self.queryIDInURL) {
                        self.setQueryNameFromId(self.queryIDInURL);
                        self.getJobsByQueryID(self.queryIDInURL);
                        self.queryIDInURL = null;
                    } else {
                        self.populateQueryResults(data);
                    }
                    if (reset) {
                        self.resetQueryLabel();
                    }

                }), function (error) {
                    //hide progress bar when results are returned
                    self.hideProgress();
                    //clear progress timer so it wont show progress bar if it hasn't already
                    clearTimeout(progressTimer);
                    //clear timeout function so it stops retrying
                    clearInterval(queryTimeout);

                    var errMsg = i18n.error.errorRunningQuery.replace("{0}", queryId);
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            }

            //create timeout function to be run every 10 seconds
            var queryTimeout = setInterval(function () {
                //run query if number of allowed tries hasn't been reached yet
                if (queryTryCount < queryTryTotal) {
                    queryById();
                    queryTryCount++;
                } else {
                    //clear timer if the max tries has been reached
                    clearInterval(queryTimeout);
                }
            }, 20000);

            queryById();

            // TODO Application should load with or without a query being selected
            // CLEAR LOADING SCREEN WHEN ALL THE INFORMATION IS RETRIEVED
            // remove loading screen
            if (this.loading) {
                this.clearLoadingScreen();
            }

            // Temporary sizing fix
            this.outer.resize();
        },

        getJobsByJobIDs : function(jobIDs) {//Array of job IDs
            var self = lang.hitch(this);
            var parameters = new JobQueryParameters();
            parameters.fields = "JTX_JOBS.JOB_ID,JTX_JOBS.JOB_NAME,JTX_JOB_TYPES.JOB_TYPE_NAME,JTX_JOBS.ASSIGNED_TO,JTX_JOBS.DUE_DATE,JTX_JOBS.DESCRIPTION";
            parameters.tables = "JTX_JOBS,JTX_JOB_TYPES";
            parameters.aliases = i18n.filter.queryFieldDescriptions;
            parameters.where = "JTX_JOB_TYPES.JOB_TYPE_ID=JTX_JOBS.JOB_TYPE_ID AND JTX_JOBS.JOB_ID IN (" + jobIDs.join(",") + ")";
            self.wmJobTask.queryJobsAdHoc(parameters, self.user, function(data) {
                self.populateQueryResults(data);
                self.hideProgress();
            }, function(error) {
                console.log("getJobsAdHoc (parameters " + parameters + ") failed: " + errMsg);
                var errMsg = i18n.error.errorFindingJobsById.replace("{0}", jobIDs.join());
                self.errorHandler(errMsg, error);
            });
        },

        populateQueryResults : function(data) {
            // populate the queryResults
            this.queryResults = data;
            this.populateGrid();
            this.populateChart();
        },

        populateGrid : function() {
            var columns = this.getColumns();
            var self = lang.hitch(this);
            var searchResultIds = [];
            var customColumns = [];
            var jobIdField = this.getJobIdColumnField(columns);

            // prepare the rows
            var rows = [];
            //just ids for feature layer query
            var rowIds = [];
            
            arrayUtil.forEach(this.queryResults.rows, function(row) {
                var newRow = {};
                for (var column in columns) {
                    newRow[columns[column].id] = row.shift();
                    //only add values from fields with key that matches "job_id"
                    if (columns[column].id == jobIdField) {
                        //add id value to rowIds array for feature layer query
                        rowIds.push(newRow[column]);
                        //////////////format job ids to number instead of string
                        //////////////newRow[column] = parseInt(newRow[column]);
                    };
                }
                rows.push(newRow);
            });

            //hardcode hide job id field
            columns[this.queryResults.fields[0].name].hidden = true;
            columns[this.queryResults.fields[0].name].unhidable = true;

            //populate statistics categorized and grouped by dropdown stores
            //casting columns object to array of objects and assigning index to be used as id in filtering selects
            var x = 0;
            for (var key in columns) {
                var obj = columns[key];
                customColumns[x] = obj;
                customColumns[x].index = x;
                x++;
            }

            //allow these to accessed elsewhere
            this.columns = columns;
            this.rows = rows;
            this.rowIds = rowIds;
            // apply store based on rows
            this.grid.content.numberJobs.innerHTML = this.i18n_NumberJobs.replace("{0}", rows.length);
            this.grid.content.setGridData(columns, rows, this.queryResults.fields[0].name);
            // populate filtering selects in statistics
            this.statisticsContainer.content.populateDropdowns(customColumns);

            //update the feature definition expression
            this.myMap.getUpdatedFeatures(rowIds);
        },
        
        getJobIdColumnField: function (columns) {
            
            for (var column in columns) {
                if (WMUtil.isField(column, "JTX_JOBS.JOB_ID"))
                {
                    return column;
                }
            }
            return null;
        },
        
        resetQueryLabel: function(){
            var self = lang.hitch(this);
            this.grid.content.numberJobs.innerHTML = this.i18n_NumberJobs.replace("{0}", this.rows.length);
            this.grid.content.selectedQueryName.innerHTML = this.savedQuery;
            this.selectedQuery = this.savedQuery;
        },

        //reset the filter after filterRow has been called
        resetRow: function () {
            if (this.columns && this.rows && this.queryResults) {
                this.columns[this.queryResults.fields[1].name].hidden = false;
                topic.publish(appTopics.chart.handleShape, this, {});
                this.grid.content.setGridData(this.columns, this.rows, this.queryResults.fields[0].name);
                this.columns[this.queryResults.fields[1].name].hidden = true;
                this.myMap.getUpdatedFeatures(this.rowIds);
                this.grid.content.numberJobs.innerHTML = this.i18n_NumberJobs.replace("{0}", this.rows.length);
                this.grid.content.selectedQueryName.innerHTML = this.selectedQuery;
            }
        },
        
        //filter the rows in a grid via the inputed field types, and there corresponding fields
        //also accounts for N/A
        filterRow: function(filterField1Type, filterField2Type, filterField1, filterField2) {
            filterRows = []
            this.columns[this.queryResults.fields[1].name].hidden = false;
            var rows = this.rows;
            var columns = this.columns;
            var jobIdField = this.getJobIdColumnField(columns);

            if (filterField1 == "N/A") {
                filterField1 = "";
            }
            if (filterField2 == "N/A") {
                filterField2 = "";
            }

            var rowIds = [];

            for(var key in rows) {
                var obj = rows[key];
                if(filterField2Type) {
                    if(obj[filterField1Type] == filterField1 && obj[filterField2Type] == filterField2) {
                        filterRows.push(obj);
                        rowIds.push(obj[columns[this.queryResults.fields[0].name].id]);
                    }

                } else {
                    if(obj[filterField1Type] == filterField1) {
                        filterRows.push(obj);
                        rowIds.push(obj[columns[this.queryResults.fields[0].name].id]);
                    }
                }
            }

            this.grid.content.numberJobs.innerHTML = this.i18n_NumberJobs.replace("{0}", filterRows.length);
            this.myMap.getUpdatedFeatures(rowIds);
            this.grid.content.setGridData(columns, filterRows, this.queryResults.fields[0].name);
            this.columns[this.queryResults.fields[1].name].hidden = true;
        },

        filterGrid : function(sender, args) {
            var self = lang.hitch(this);
            // search jobs by the text input value
            // returns all objects that contain the string
            var progressTimer = setTimeout(function() {
                self.showProgress()
            }, 2000);
            this.wmJobTask.searchJobs(args.value, this.user, function(data) {
                self.hideProgress();
                clearTimeout(progressTimer);
                self.selectedQuery = self.i18n_SearchResults;
                // populate the queryResults
                self.populateQueryResults(data);
            }, function(error) {
                self.hideProgress();
                clearTimeout(progressTimer);

                console.log("Search Jobs error: ", error);
            });
        },

        resetFilters : function() {
            var self = lang.hitch(this);
            this.filter.content.jobQueries.set("value", 1);
            this.filter.content.jobSearchInput.set("value", "");
        },

        populateChart : function() {
            if (this.grid.content.dataGrid.store == null)
                return;

            var self = lang.hitch(this);
            var intIndex = 0;
            var currentCategorizedByValue = this.getCategorizedValue();
            var currentGroupedByValue = this.getGroupedValue();

            // prepare data based on grid rows (store)
            var uniqueValues = new Array();
            var uniqueValuesKeys = new Array();
            arrayUtil.forEach(this.grid.content.dataGrid.store.data, function(row) {
                if (uniqueValues[row[self.queryResults.fields[currentCategorizedByValue].name]] === undefined) {
                    uniqueValues[row[self.queryResults.fields[currentCategorizedByValue].name]] = 0;
                    uniqueValuesKeys.push(row[self.queryResults.fields[currentCategorizedByValue].name]);
                }
                uniqueValues[row[self.queryResults.fields[currentCategorizedByValue].name]] += 1;
            });

            // if currentGroupedByValue is not 'none'}
            if (this.getGroupedValue() > 0) {// grouped by selected
                // prepare the charts (based on grouped by value)
                var uniqueGroupedByValues = new Array();
                var uniqueGroupedByValuesKeys = new Array();

                // gather and prepare the grouped data
                arrayUtil.forEach(this.grid.content.dataGrid.store.data, function(row) {
                    if (uniqueGroupedByValues[row[self.queryResults.fields[currentGroupedByValue].name]] === undefined) {
                        uniqueGroupedByValues[row[self.queryResults.fields[currentGroupedByValue].name]] = [];
                        uniqueGroupedByValuesKeys.push(row[self.queryResults.fields[currentGroupedByValue].name]);
                    }
                    if (uniqueGroupedByValues[row[self.queryResults.fields[currentGroupedByValue].name]][row[self.queryResults.fields[currentCategorizedByValue].name]] === undefined) {
                        uniqueGroupedByValues[row[self.queryResults.fields[currentGroupedByValue].name]][row[self.queryResults.fields[currentCategorizedByValue].name]] = 0;
                    }
                    uniqueGroupedByValues[row[self.queryResults.fields[currentGroupedByValue].name]][row[self.queryResults.fields[currentCategorizedByValue].name]] += 1;
                });
                console.log("Grouped by data gathering done.");

                // remove all previous pie charts (there isn't really one only but multiple that change quite drastically)
                this.statisticsContainer.content.clearGroupedByCharts();

                // apply data to pie charts
                arrayUtil.forEach(uniqueGroupedByValuesKeys, lang.hitch(this, function(key) {
                    this.statisticsContainer.content.addPieChart(key, uniqueValuesKeys, uniqueGroupedByValues[key]);
                }));
                // apply data to stacked bar chart
                this.statisticsContainer.content.statsStackedBarChart.prepareData(uniqueValuesKeys, uniqueGroupedByValuesKeys, uniqueGroupedByValues);
            } else {// no grouped by needed

                // apply data to bar chart
                this.statisticsContainer.content.statsBarChart.prepareData(uniqueValuesKeys, uniqueValues);
                // apply data to pie chart
                this.statisticsContainer.content.statsPieChart.prepareData(uniqueValuesKeys, uniqueValues);
            }

            // show the appropriate chart
            this.statisticsContainer.content.toggleCharts();
        },

        getCategorizedValue : function() {
            return this.statisticsContainer.content.chartCategorizedBy.value;
        },

        getGroupedValue : function() {
            return this.statisticsContainer.content.chartGroupedBy.value;
        },

        getColumns: function () {
            if (this.queryResults == null) {
                return null;
            }

            var columns = {};
            arrayUtil.forEach(this.queryResults.fields, function(column) {
                var c = {};
                c["label"] = column.alias;
                c["id"] = column.name;
                c["hidden"] = false;
                c["type"] = column.type;
                columns[column.name] = c;
            });
            return columns;
            //self.dataGrid.set("idProperty", data.fields[0].name);
        },

        getJobById : function(args) {
            var self = lang.hitch(this);

            // reset active hold
            //moved to update holds
            //self.jobHasActiveHold = false;

            // reset job dialog title while loading data
            self.jobDialog.set("title", "Loading");

            var progressTimer = setTimeout(function() {
                self.showProgress()
            }, 2000);

            this.wmJobTask.getJob(args.jobId, function(data) {
                console.log("Job info: ", data);
                //hide progress bar if showing
                self.hideProgress();
                //prevent progress bar from showing if it isnt already
                clearTimeout(progressTimer);

                loadingJob = false;
                self.currentJob = data;
                self.updateGridButtons();
                self.updateHolds();

                // populate dialog title
                self.jobDialog.set("title", data.name);

                // aoi privileges
                self.aoiPrivileges();

                // set map aoi
                topic.publish(appTopics.map.clearGraphics, null);
                self.setMapAoi(data.aoi, args.zoomToPolygon);

                //set draw tool buttons
                self.drawTool.drawButtonDeactivation();
                self.drawTool.drawButtonActivation(data.aoi.rings.length);

                //update job properties
                self.updateProperties();

                //check privileges
                //this should probably be moved to a .then for this function
                //self.checkPrivileges();

            }, function(error) {
                //hide progress bar if showing
                self.hideProgress();
                //prevent progress bar from showing if it isnt already
                clearTimeout(progressTimer);

                var errMsg = i18n.error.errorRetrievingJobWithJobId.replace("{0}", args.jobId);
                console.log(errMsg, error);
                self.errorHandler(errMsg, error);
            });
        },

        //sets and refreshes map aoi
        setMapAoi : function(aoi, zoomToPolygon) {
            var self = lang.hitch(this);

            if (aoi) {
                //set aoi
                self.myMap.drawAoi(aoi);
                if (zoomToPolygon) {
                    //zoom to aoi
                    self.myMap.zoomToPolygon(aoi);
                    //self.tabAoi.content.aoiMap.zoomToPolygon(aoi);
                }
            } else {
                this.wmJobTask.getJob(self.currentJob.id, function(data) {
                    self.myMap.zoomToPolygon(data.aoi);
                    //self.tabAoi.content.aoiMap.zoomToPolygon(data.aoi);
                }, function(error) {
                    console.log("Error retrieving jobs with job ID ", jobID);
                });
            }
        },

        updateGridButtons: function() {
            var self = lang.hitch(this);
            var canDelete = self.userPrivileges.canDeleteJobs;
            var canClose = self.userPrivileges.canCloseJob && self.currentJob.stage != Enum.JobStage.CLOSED;
            var canReopen = self.userPrivileges.canReopenClosedJobs && self.currentJob.stage == Enum.JobStage.CLOSED;
            
            if (Object.keys(self.grid.content.dataGrid.selection).length == 1) {
                // single job selected
                self.grid.content.setButtons(canDelete, canClose, canReopen);
            } else {
                // multiple jobs selected
                self.grid.content.resetButtons();
            } 
        },

        checkPrivileges : function() {
            /////////// call privilege funcs
            // call holds privileges
            this.holdsPrivilege();
            // notes privileges
            this.notesPrivileges();
            // history privileges
            this.historyPrivileges();
            // extended properties privileges
            this.extendedPropertiesPrivileges();
            // attachment privileges
            this.attachmentPrivileges();
        },

        gridPrivileges: function(){
            // Hides the close, reopen and delete buttons based on privileges
            var canDelete = this.userPrivileges.canDeleteJobs;
            var canClose = this.userPrivileges.canCloseJob;
            var canReopen = this.userPrivileges.canReopenClosedJobs;
            this.grid.content.setPrivileges(canDelete, canClose, canReopen);
        },

        extendedPropertiesPrivileges: function () {
            // extended properties are editable if:
            //  - job is not closed
            //  - job is not on hold
            //  - user has privilege to manage extended properties
            var editable = this.userPrivileges.canManageExtendedProperties && this.currentJob.stage != Enum.JobStage.CLOSED && !this.jobHasActiveHold;
            this.tabExtendedProperties.content.setEditable(editable);
        },

        holdsPrivilege : function() {
            var self = lang.hitch(this);

            // Holds are editable if:
            //  - job is not closed
            //  - user has privilege to manage holds
            //  - job is owned by or assigned to the current user
            if (self.currentJob.id && self.currentJob.stage != Enum.JobStage.CLOSED && self.userPrivileges.canManageHolds && (self.currentJob.ownedBy == self.user || (self.currentJob.assignedType == Enum.JobAssignmentType.ASSIGNED_TO_USER && self.currentJob.assignedTo == self.user))) {
                self.tabHolds.content.setEditable(true);
            } else {
                self.tabHolds.content.setEditable(false);
            }
        },

        notesPrivileges : function() {
            var self = lang.hitch(this);

            // Notes are editable if:
            //  - job is not closed
            //  - job has no active holds
            //  - job is unassigned, job is owned by current user, or job is assigned to the current user
            if (self.currentJob.id && (self.currentJob.stage != Enum.JobStage.CLOSED) && (!self.jobHasActiveHold) && (self.currentJob.assignedType == Enum.JobAssignmentType.UNASSIGNED || self.currentJob.ownedBy == self.user || (self.currentJob.assignedType == Enum.JobAssignmentType.ASSIGNED_TO_USER && self.currentJob.assignedTo == self.user))) {
                self.tabNotes.content.setEditable(true);
            } else {
                self.tabNotes.content.setEditable(false);
            }
        },

        historyPrivileges : function() {
            var self = lang.hitch(this);

            // Adding to job history allowed if:
            //  - job is not closed
            //  - job has no active holds
            //  - job is unassigned, job is owned by current user, or job is assigned to the current user
            if (self.currentJob.id && (self.currentJob.stage != Enum.JobStage.CLOSED) && (!self.jobHasActiveHold) && (self.currentJob.assignedType == Enum.JobAssignmentType.UNASSIGNED || self.currentJob.ownedBy == self.user || (self.currentJob.assignedType == Enum.JobAssignmentType.ASSIGNED_TO_USER && self.currentJob.assignedTo == self.user))) {
                self.tabHistory.content.setEditable(true);
            } else {
                self.tabHistory.content.setEditable(false);
            }
        },

        aoiPrivileges: function () {
            var self = lang.hitch(this);

            // AOI is editable if:
            //  - job is not closed
            //  - user has privilege to manage holds
            //  - job has no active holds
            //  - job is owned by current user, or job is assigned to the current user
            var hasAOIPermission = false;
            if (self.currentJob.id && self.currentJob.stage != Enum.JobStage.CLOSED && self.userPrivileges.canManageAOI && 
                (self.currentJob.ownedBy == self.user || (self.currentJob.assignedType == Enum.JobAssignmentType.ASSIGNED_TO_USER && self.currentJob.assignedTo == self.user))) {
                hasAOIPermission = true;
            };

            self.drawTool.hasAOIPermission = hasAOIPermission;
            self.drawTool.AOIOverlapOverride = self.userPrivileges.AOIOverlapOverride;
        },

        attachmentPrivileges: function()  {
            //handle all privileges concerning attachments
            //check the canManageAttachments
            //check the canAddAttachmentsToHeldJob
            //check if job is closed or held
            var properties = this.checkAttachmentPrivileges();
            this.tabAttachments.content.handlePrivileges(properties);
        },


        updateProperties : function() {
            var self = lang.hitch(this);
            self.tabProperties.content.setCurrentJob(self.currentJob, self.serviceInfo.configProperties.AUTOSTATUSASSIGN, {
                jobTypes : self.serviceInfo.jobTypes,
                jobStatuses : self.serviceInfo.jobStatuses,
                users : self.users,
                groups : self.groups,
                dataWorkspaces : self.serviceInfo.dataWorkspaces
            });
        },
        
        updateAttachments: function (jobID) {
            var self = lang.hitch(this);
            //stop double population
            if (!self.updatingAttachments) {
                self.updatingAttachments = true;
                //clear and reset the panes
                self.tabAttachments.content.resetAttachmentPanes();
                if (self.tabAttachments.content.fileListContainer.children.length > 0) {
                    console.log("clear attachments ran");
                    dojo.empty(self.tabAttachments.content.fileListContainer);
                }
                self.tabAttachments.content.updateNumberAttachments(true);
                //get atachment data and populate the tab
                var jobAttachments = [];
                self.wmJobTask.getAttachments(jobID, function (data) {
                    jobAttachments = data
                    if (jobAttachments.length > 0) {
                        console.log("Attachments for " + jobID + ": " + jobAttachments);
                        self.tabAttachments.content.populateAttachments(jobAttachments);
                    };
                    self.updatingAttachments = false;
                }, function (error) {
                    var errMsg = i18n.error.errorRetrievingAttachments;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                    self.updatingAttachments = false;
                });
            }
        },

        updateExtendedProperties: function(jobId){
            var self = lang.hitch(this);
            //stop double population
            if (!self.updatingExtendedProperties) {
                self.updatingExtendedProperties = true;
                //clear the tab
                console.log("clear extended properties ran");
                self.tabExtendedProperties.content.clearProperties();
                //populate the tab
                self.wmJobTask.getExtendedProperties(jobId, function (containers) {
                    console.log("Extended Properties for " + jobId);
                    self.tabExtendedProperties.content.populateExtendedProperties(containers);
                    self.updatingExtendedProperties = false;
                }, function (error) {
                    var errMsg = i18n.error.errorRetrievingExtendedProperties;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                    self.updatingExtendedProperties = false;
                });
            }
        },

        updateWorkflow : function() {
            var self = lang.hitch(this);

            self.tabWorkflow.content.initializeProperties({
                workflowTask : self.wmWorkflowTask,
                jobTask : self.wmJobTask,
                tokenTask : self.wmTokenTask,
                commentActivityType : self.commentActivityTypeId,
                currentUser : self.user,
                currentJob : self.currentJob,
                canRecreateWorkflow : self.userPrivileges.canRecreateWorkflow
            });
            self.tabWorkflow.content.initializeWorkflow();
        },

        updateNotes : function() {
            var self = lang.hitch(this);
            // populate notes
            this.wmJobTask.getNotes(this.currentJob.id, function(data) {
                self.tabNotes.content.setCurrentJobNotes(data);
            });
        },

        updateHistory : function() {
            var self = lang.hitch(this);
            var jobID = self.currentJob.id;

            // get history log
            var activityRecord = new Array();
            // Method not succeeding
            this.wmJobTask.getActivityLog(jobID, function(data) {
                var formattedArray = [];
                arrayUtil.forEach(data, function(row) {
                    // Set type to its description set in Activity Types
                    row.type = self.getActivityTypeName(row.type);
                    //row.date = locale.format(row.date, { formatLength: "short" });
                    formattedArray.push(row);
                });
                self.tabHistory.content.setGridData(formattedArray);
            }, function(error) {
                var errMsg = i18n.error.errorLoadingJobHistory;
                console.log(errMsg, error);
                self.errorHandler(errMsg, error);
            });
        },

        getActivityTypeName : function(activityTypeId) {
            var activityTypes = this.serviceInfo.activityTypes;
            if (activityTypes == null || activityTypes.length < 1)
                return "";

            for (var i = 0; i < activityTypes.length; i++) {
                var activityType = activityTypes[i];
                if (activityTypeId == activityType.id) {
                    return activityType.description;
                }
            }
            return "";
        },

        updateHolds: function () {
            var self = lang.hitch(this);
            var jobID = self.currentJob.id;

            //reset current hold
            this.jobHasActiveHold = false;

            // Get job holds
            this.wmJobTask.getHolds(jobID, function(data) {
                //console.log("Holds:", data);
                self.currentJobHolds = data;

                var formattedArray = [];
                arrayUtil.forEach(data, function(row) {
                    // Set type to its description set in Activity Types
                    //row.holdDate = locale.format(row.holdDate, { formatLength: "short" });
                    row.typeName = self.serviceInfo.holdTypes[self.findWithAttr(self.serviceInfo.holdTypes, "id", row.type)].name;
                    // add active property
                    if ((row.releaseDate == null) || (row.releaseDate == "")) {
                        row.isActive = true;
                        self.jobHasActiveHold = true;
                    } else {
                        row.isActive = false;
                    }
                    formattedArray.push(row);
                });
                self.checkPrivileges();
                self.tabHolds.content.setGridData(formattedArray);
                self.tabProperties.content.setJobHolds(formattedArray);

            }, function(error) {
                var errMsg = i18n.error.errorLoadingJobHolds;
                console.log(errMsg, error);
                self.errorHandler(errMsg, error);
            });
        },

        initLogin : function(user) {
            this.loginPage = new Login({
                controller : this,
                authenticationMode : this.authenticationMode,
                defaultUser : config.app.DefaultUser
            }, "loginContainer");
            this.loginPage.startup(user);
        },

        errorHandler : function(message, error) {
            this.hideProgress();
            Alert.show(i18n.error.title, message, error);
        },

        initFrameworkUI : function() {
            console.log("Starting initFrameworkUI");
            var self = lang.hitch(this);
            // job dialog and child initial dimensions
            var dialogWidth = window.innerWidth - 100;
            var dialogHeight = window.innerHeight - 100;
            var containerHeight = dialogHeight - 40;

            // Main Wrapper
            this.outer = new BorderContainer({
                id : "borderContainer",
                design : "headline",
                gutters : false,
                liveSplitters : false,
                style : "width: 100%; height: 100%; margin: 0;"
            }).placeAt(win.body());
            this.outer.startup();

            // Banner
            this.banner = new ContentPane({
                region : "top",
                style : "height: 45px; background: #0081C2;",
                content: new Header({ hasLogout: !this.isWindowsUser })
            }).placeAt(this.outer);
            this.banner.startup();

            // Filter
            this.filter = new ContentPane({
                region : "top",
                style : "height: 38px; padding: 4px 8px 4px 15px; border-bottom: 1px solid #ccc;",
                content : new Filter()
            }).placeAt(this.outer);
            this.filter.startup();

            this.inner = new BorderContainer({
                id : "contentContainer",
                design : "sidebar",
                gutters : false,
                liveSplitters : true,
                region : "center"
            }).placeAt(this.outer);
            this.inner.startup();

            this.top = new BorderContainer({
                id : "topContainer",
                design : "headline",
                gutters : false,
                liveSplitters : true,
                region : "top",
                style : "width: 100%; height: 60%; margin: 0;"
            }).placeAt(this.inner);
            this.top.startup();

            this.bottom = new BorderContainer({
                id : "bottomContainer",
                design : "headline",
                gutters : false,
                liveSplitters : true,
                region : "bottom",
                style : "width: 100%; height: 40%; margin: 0; border-top: 1px solid #ccc;"
            }).placeAt(this.inner);
            this.bottom.startup();

            this.grid = new ContentPane({
                id : "grid",
                region : "center",
                splitters : true,
                style : "width: 100%;",
                content : new Grid()
            }).placeAt(this.bottom);
            this.grid.startup();

            //set grid privileges
            this.gridPrivileges();

            this.statisticsContainer = new ContentPane({
                id : "statisticsContainer",
                region : "left",
                splitters : true,
                style : "width: 45%; padding: 0;",
                content : new Statistics()
            }).placeAt(this.top);
            this.statisticsContainer.startup();

            //Create dialog
            this.jobDialog = new Dialog({
                id : "jobDialog",
                style : "width: " + dialogWidth + "px; height: " + dialogHeight + "px;",
                isLayoutContainer : true,
                draggable : false,
                autofocus : false,
                onHide : function() {
                    if (self.tabs.selectedChildWidget.id == self.tabProperties.id) {
                        self.tabProperties.content.closingProps();
                    }
                    if (self.tabs.selectedChildWidget.id == self.tabExtendedProperties.id) {
                        self.tabExtendedProperties.content.closingExtendedProps();
                    }
                }
            });
            this.jobDialog.startup();

            this.jobTabsContainer = new BorderContainer({
                id : "jobTabsContainer",
                design : "headline",
                isLayoutContainer : true,
                style : "width: 100%; height: 100%; margin: 0;"
            }).placeAt(this.jobDialog.containerNode);
            this.jobTabsContainer.startup();

            // Warning label
            this.jobWarning = domConstruct.create("span", { class: "warning-label", innerHTML: "" });
            domConstruct.place(this.jobWarning, this.jobDialog.titleBar, 2);

            // Tabs
            this.tabs = new TabContainer({
                region : "left",
                id : "tabs",
                tabPosition : "left-h",
                tabStrip : true,
                style : "width: 100%; height: 100%;"
            }).placeAt(this.jobTabsContainer);
            this.tabs.startup();

            //fixes spacing issue
            dojo.byId("tabs_tablist").style.width = "160px";
            this.tabs.containerNode.style.left = "160px";

            this.tabProperties = new ContentPane({
                title : i18n.properties.title,
                content : new Properties(),
                id : "tabProperties",
                style : "padding-top: 0; padding-bottom: 0;"
            });
            this.tabs.addChild(this.tabProperties);
            this.tabProperties.startup();

            this.tabWorkflow = new ContentPane({
                title : i18n.workflow.title,
                content : new Workflow()
            });
            this.tabs.addChild(this.tabWorkflow);
            this.tabWorkflow.startup();

            this.tabHistory = new ContentPane({
                title : i18n.history.title,
                content : new History(),
                id : "tabHistory",
                onShow : function() {
                    self.tabHistory.content.historyGrid.resize();
                }
            });
            this.tabs.addChild(this.tabHistory);
            this.tabHistory.startup();

            //extended properties
            this.tabExtendedProperties = new ContentPane({
                title: i18n.extendedProperties.title,
                content: new ExtendedProperties(),
                id: "tabExtendedProperties",
                style: "padding-top: 0; padding-bottom: 0;"
            });
            this.tabs.addChild(this.tabExtendedProperties);
            this.tabExtendedProperties.startup();

            this.tabAttachments = new ContentPane({
                id : "tabAttachments",
                content : new Attachments(),
                title : i18n.attachments.title
            });
            this.tabs.addChild(this.tabAttachments);
            this.tabAttachments.startup();

            this.tabNotes = new ContentPane({
                title: i18n.notes.title,
                content : new Notes(),
                id : "tabNotes"
            });
            this.tabs.addChild(this.tabNotes);
            this.tabNotes.startup();

            this.tabHolds = new ContentPane({
                title : i18n.holds.title,
                content : new Holds(),
                id : "tabHolds",
                onShow : function() {
                    self.tabHolds.content.holdsGrid.resize();
                }
            });
            this.tabs.addChild(this.tabHolds);
            this.tabHolds.startup();

            // Map
            this.mapPanel = new ContentPane({
                region : "right",
                id : "map",
                style : "width: 55%; border-left: 1px solid #ccc;",
                content : mapTemplate
            }).placeAt(this.top);

            this.initMap();

            // Update job dialog size
            window.onresize = function() {
                dialogWidth = window.innerWidth - 100;
                dialogHeight = window.innerHeight - 100;
                self.jobDialog.set("style", "width: " + dialogWidth + "px; height: " + dialogHeight + "px;");
                self.grid.content.resizeGrid();
            };
        },

        initMap : function() {
            var self = lang.hitch(this);
            this.myMap = new EsriMap({
                mapConfig : config.map,
                aoiLayerID : config.app.jobAOILayer.AOILayerID,
                mapTopics : appTopics.map,
                mapId : self.mapPanel.id,
                controller : self
            });

            // TODO Is there a reason initWidgets is called during map onLoad?
            //this.myMap.map.on("load", self.initWidgets);
            this.myMap.startup();

            this.initWidgets();

            if (config.map.basemapGallery.isEnabled) {

                this.basemapGallery = new BasemapGallery({
                    map : this.myMap.map,
                    basemapConfig : config.map.basemapGallery,
                    customBasemapConfig: config.map.customBasemaps, 
                    galleryId : "myMapBasemapGallery"
                }, "basemapGalleryContainer");
                this.basemapGallery.startup();
                this.basemapGallery.selectBasemap(config.map.defaultBasemap);
            }

            if (config.map.legend.isEnabled) {
                this.legend = new EsriLegend({
                    map : this.myMap.map,
                    legendConfig : config.map.legend
                }, "esriLegendContainer");
                this.legend.startup();
            }

            if (config.map.coordinates.isEnabled) {
                this.coordinates = new Coordinates({
                    map : this.myMap.map,
                    coordinatesConfig : config.map.coordinates
                }, "coordinatesContainer");
                this.coordinates.startup();
            }

            //Draw tool
            if (config.map.drawTool.isEnabled) {
                this.drawTool = new DrawTool({
                    map : this.myMap.map,
                    drawConfig : config.map.drawTool
                }, "drawContainer");
                this.drawTool.startup();
            }
        },

        addAOIDynamicMapLayerToMap: function () {
            // Job AOI layer
            this.myMap.addAOIDynamicLayer(config.app.jobAOILayer, this.aoiMapServiceQueryLayerUrl);
        },

        initWidgets : function() {
            console.log("initWidgets called (map started)");
            this.initTopics();
            this.initConfig();
        },

        initTopics : function() {
            console.log("init topics called");
            var self = lang.hitch(this);
            this.selectedRowId = null;
            var selectedFilter = 1;
            
            //topic for updating Extended Properties
            topic.subscribe(appTopics.extendedProperties.updateExtendedProperties, function (sender, args) {
                self.wmJobTask.updateRecord(self.currentJob.id, args.record, self.user, function (success) {
                }, function (error) {
                    var errMsg = i18n.error.errorUpdatingExtendedProperties;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            }),

            topic.subscribe(appTopics.extendedProperties.getFieldValues, function (sender, args) {
                 self.wmJobTask.listFieldValues(self.currentJob.id, args.tableName, args.field, self.user, function (response) {
                     sender.setResponse(response);
                 }, function (error) {
                     var errMsg = i18n.error.errorGettingFieldValues;
                     console.log(errMsg, error);
                     self.errorHandler(errMsg, error);
                 });

             })

            //new topics for selecting bar/charts
            topic.subscribe(appTopics.manager.serviceConfigurationLoaded, function(sender, args) {
                console.log("Service configuration loaded", args);
                self.serviceInfo = args.serviceInfo;
                self.users = args.users;
                self.groups = args.groups;
                self.dataWorkspaceDetails = args.dataWorkspaceDetails;
                self.aoiJobIdField = args.aoiJobIdField;
                self.commentActivityTypeId = args.commentActivityTypeId;
                self.onServiceConfigurationLoaded();

                self.addAOIDynamicMapLayerToMap();
            });
            
            topic.subscribe(appTopics.filter.jobSearch, function(sender, args) {
                if (args.value == "") {
                    //Resets filter, defaults to All Jobs
                    self.getJobsByQueryID(selectedFilter);
                } else {
                    self.filterGrid(sender, args);
                };
            });

            topic.subscribe(appTopics.filter.jobQueriesChanged, function(sender, args) {
                self.grid.content.selectedQueryName.innerHTML = args.selectedQuery;
                self.savedQuery = args.selectedQuery;
                self.getJobsByQueryID(args.selectedId);
                selectedFilter = args.selectedId;
            });

            topic.subscribe(appTopics.statistics.chartCategorizedBy, function() {
                self.populateChart();
            });

            // Statistics: Grouped By dropdown list changed
            topic.subscribe(appTopics.statistics.chartGroupedBy, function(sender, args) {
                // args.id, args.item
                self.populateChart();
            });

            topic.subscribe(appTopics.grid.rowSelected, function(sender, args) {
                self.getJobById({
                    jobId : args.selectedId,
                    updateWorkflow : false,
                    zoomToPolygon : args.selectedFromGrid
                });
                self.selectedRowId = args.selectedId;

                //clear map job popup
                self.myMap.map.infoWindow.hide();
            });

            topic.subscribe(appTopics.filter.newJob, function(sender, args) {
                //add new job
                console.log("Creating jobs, args: ", args);
                self.showProgress();
                self.wmJobTask.createJob(args, self.user, function(data) {
                    self.hideProgress();

                    var jobIds = data;
                    self.selectedQuery = i18n.grid.newJob;
                    console.log("Jobs created successfully: ", jobIds);
                    self.getJobsByJobIDs(jobIds);
                }, function(error) {
                    self.hideProgress();

                    var errMsg = i18n.error.errorCreatingJob;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            });

            topic.subscribe(appTopics.map.draw.saveGraphics, function(sender, args) {
                console.log("draw graphics save clicked:", args);
                var progressTimer = setTimeout(function() {
                    self.showProgress()
                }, 2000);
                self.wmJobTask.updateAOI(self.currentJob.id, args.graphics.graphics[0].geometry, self.user, function(success) {
                    console.log("AOI updated successfully");
                    self.hideProgress();
                    clearTimeout(progressTimer);

                    //clear graphics
                    sender.clearGraphics();
                    self.drawTool.btnClearAoi.set("disabled", false);

                    //reload job
                    topic.publish(appTopics.grid.rowSelected, this, {
                        selectedId : self.selectedRowId,
                        selectedFromGrid : true
                    })

                    self.myMap.setMapExtent();
                    self.myMap.refreshLayers();
                }, function(error) {
                    self.hideProgress();
                    clearTimeout(progressTimer);

                    var errMsg = i18n.error.errorUpdatingJobAOI;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                    self.drawTool.graphics.clear();
                });
            });

            topic.subscribe(appTopics.grid.jobDialog, function(sender, args) {
                self.selectedRowId = args.selectedId;

                //select props tab on open
                self.tabs.selectChild(self.tabProperties);

                //hide and show popups
                self.myMap.map.infoWindow.hide();
                self.jobDialog.show();
            });

            topic.subscribe(appTopics.filter.clearSearch, function(sender) {
                self.filter.content.jobSearchInput.set("value", "");
                // TODO Fix this so that it uses the first job query.  Not all repositories have an "All Jobs" query
                self.filter.content.jobQueries.set("value", "All Jobs");
                self.getJobsByQueryID(selectedFilter);
            });

            // add hold
            topic.subscribe(appTopics.holds.addHold, function (sender, args) {
                if (args.holdType != "") {
                    self.wmJobTask.createHold(self.currentJob.id, args.holdType, args.comment, self.user, function () {
                        console.log("Hold added successfully");
                        self.tabHolds.content.holdAddedSuccess();
                        self.updateHolds();
                    }, function (error) {
                        var errMsg = i18n.error.errorAddingHold;
                        console.log(errMsg, error);
                        self.errorHandler(errMsg, error);
                    });
                } else {
                    var error = "";
                    var errMsg = i18n.error.errorMissingHoldType;
                    console.log(errMsg);
                    self.errorHandler(errMsg, error);
                }
            });

            // release hold
            topic.subscribe(appTopics.holds.releaseHold, function (sender, args) {
                self.wmJobTask.releaseHold(self.currentJob.id, args.holdID, args.comment, self.user, function () {
                    console.log("Hold released successfully");
                    self.tabHolds.content.holdAddedSuccess();
                    self.updateHolds();
                }, function (error) {
                    var errMsg = i18n.error.errorReleasingHold;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            });

            // assign job from grid
            topic.subscribe(appTopics.grid.assignJobs, function(sender, args) {
                self.assignJobs(args);
            });

            //reset current grid
            topic.subscribe(appTopics.grid.resetFilter, function (sender, args) {
                self.resetRow();
            });
            //filter current grid
            topic.subscribe(appTopics.grid.filter, function (sender, args) {
                self.filterRow(args.filterField1Type, args.filterField2Type, args.filterField1, args.filterField2);
            });
            
            // close job from grid
            topic.subscribe(appTopics.grid.closeJobs, function(sender, args) {
                self.wmJobTask.closeJobs(args.jobs, self.user, function (data) {
                    console.log("Jobs closed successfully: ", args.jobs);
                    self.getJobsByQueryID(self.currentQueryId, true);
                }, function (error) {
                    var errMsg = i18n.error.errorClosingJob;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            });
            // reopen closed job from grid
            topic.subscribe(appTopics.grid.reopenClosedJobs, function(sender, args) {
                self.wmJobTask.reopenClosedJobs(args.jobs, self.user, function (data) {
                    console.log("Jobs reopened successfully: ", args.jobs);
                    self.getJobsByQueryID(self.currentQueryId, true);
                }, function (error) {
                    var errMsg = i18n.error.errorReopeningClosedJobs;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            });
            // delete job from grid
            topic.subscribe(appTopics.grid.deleteJobs, function(sender, args) {
                self.wmJobTask.deleteJobs(args.jobs, true, self.user, function (data) {
                    console.log("Jobs deleted successfully: ", args.jobs);
                    self.getJobsByQueryID(self.currentQueryId, true);
                }, function (error) {
                    var errMsg = i18n.error.errorDeletingJob;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            });

            // update properties version from data workspace
            topic.subscribe(appTopics.properties.dataWorkspaceSelect, function(sender, args) {
                console.log(args);
                //get versions for the workspace with id args.id
            });

            topic.subscribe(appTopics.notes.noteUpdate, function(sender, args) {
                console.log(self.selectedRowId);
                self.wmJobTask.updateNotes(self.selectedRowId, args.noteValue, self.user, function(success) {
                    self.updateNotes();
                }, function(error) {
                    var errMsg = i18n.error.errorUpdatingJobNotes;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            });

            // Populate job type defaults
            topic.subscribe(appTopics.filter.jobTypeSelect, function(sender, args) {
                self.wmConfigurationTask.getJobTypeDetails(args.jobType, function(jobTypeDetails) {
                    self.filter.content.populateJobTypeDefaults(this, {
                        jobTypeDetails : jobTypeDetails,
                        dataWorkspaceDetails : self.dataWorkspaceDetails
                    });
                }, function(error) {
                    var errMsg = i18n.error.errorLoadingJobTypeDetails;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            });

            // Update job properties
            topic.subscribe(appTopics.properties.updateProperties, function(data) {
                self.showProgress();
                self.wmJobTask.updateJob(data, self.user, function() {
                    console.log("Properties updated successfully");
                    self.tabProperties.content.updateCallback(i18n.properties.updateSuccessful);
                    //retrieve updated job data
                    self.getJobById({
                        jobId : self.currentJob.id,
                        updateWorkflow : false,
                        zoomToPolygon : false
                    });
                    self.hideProgress();
                    self.switchTabs();
                }, function(error) {
                    self.hideProgress();
                    var errMsg = i18n.error.errorUpdatingJobProperties;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                    // TODO Is this still needed?
                    //self.tabProperties.content.updateCallback("There was a problem updating the properties");
                });
            });

            //adding Attachments
            topic.subscribe(appTopics.attachment.uploadAttachment, function (sender, args) {
                var jobId = self.currentJob.id;
                if (args.url) {
                    self.wmJobTask.addLinkedURLAttachment(jobId, args.url, self.user, function (attachmentId) {
                        self.updateAttachments(jobId);
                    });
                } else if (args.link) {
                    self.wmJobTask.addLinkedFileAttachment(jobId, args.link, self.user, function (attachmentId) {
                        self.updateAttachments(jobId);
                    });
                } else {
                    self.wmJobTask.addEmbeddedAttachment(self.user, jobId, args.form, function (attachmentId) {
                        self.updateAttachments(jobId);
                    }, function (error) {
                        console.log("Error Adding Attachment " + jobId + ' ' + error);
                        //With IE9, esri request will throw an error even though the request was successful.
                        //Refresh the attachments tab.
                        self.updateAttachments(jobId);
                    });
                }
                
            });

            //get content url and set the hyperlink
            topic.subscribe(appTopics.attachment.getContentURL, function (sender, args) {
                var jobId = self.currentJob.id;
                var attachmentId = args.attachmentId;
                var contentURL = self.wmJobTask.getAttachmentContentURL(jobId, attachmentId);
                //sender.attachmentLink.href = contentURL;
                sender.setContentURL(contentURL);
            });

            //remove attachments
            topic.subscribe(appTopics.attachment.removeAttachment, function (sender, args) {
                    console.log("recieved remove click: " + args.attachmentId);
                    self.tabAttachments.content.removeAttachment(args);
                    self.wmJobTask.deleteAttachment(self.currentJob.id, args.attachmentId, self.user, function (success) {
                        console.log("Attachment deleted successfully");
                    }, function (error) {
                        console.log("Error deleting attachment with id: " + args.attachmentId + " " + error);
                    });
            });

            // Log action for job
            // requires:
            // activity type (if no activity type is specified, comment activity type is used)
            // value for the log
            topic.subscribe(appTopics.manager.logAction, function(sender, args) {
                self.showProgress();
                
                var activityType = self.commentActivityTypeId;
                if (args.activityType != null)
                    activityType = args.activityType;

                self.wmJobTask.logAction(self.currentJob.id, activityType, args.value, self.user, function(success) {
                    console.log("Activity added successfully");
                    self.tabHistory.content.commentAddedSuccess();
                    self.updateHistory();
                    self.hideProgress();
                }, function(error) {
                    self.hideProgress();
                    var errMsg = i18n.error.errorAddingComment;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            });

            topic.subscribe(appTopics.map.draw.clear, function(sender) {
                self.clearAoiDialog = new AoiFunctionsTemplate();
                self.clearAoiDialog.startup();
            });

            topic.subscribe("clearAoiConfirmed", function() {
                var progressTimer = setTimeout(function() {
                    self.showProgress()
                }, 2000);
                self.wmJobTask.deleteAOI(self.currentJob.id, self.user, function(success) {
                    console.log("AOI successfully deleted");
                    self.hideProgress();
                    clearTimeout(progressTimer);

                    self.clearAoiDialog.aoiFunctionsDialog.hide();
                    self.drawTool.btnClearAoi.set("disabled", true);
                    self.myMap.graphicsLayer.clear();
                    self.myMap.map.infoWindow.hide();
                    self.myMap.setMapExtent();
                    self.myMap.refreshLayers();
                }, function(error) {
                    self.hideProgress();
                    clearTimeout(progressTimer);

                    var errMsg = i18n.error.errorDeletingJobAOI;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            });

            topic.subscribe(appTopics.map.draw.deactivateAll, function() {
                self.drawTool.drawButtonDeactivation();
            });

            // Progress indicator
            topic.subscribe(appTopics.manager.showProgress, function(sender) {
                self.showProgress();
            });

            topic.subscribe(appTopics.manager.hideProgress, function(sender) {
                self.hideProgress();
            });
            
            topic.subscribe(appTopics.map.layer.clearSelection, function(jobId) {
                // clear grid selection
                self.grid.content.dataGrid.clearSelection();
                // cancel drawTool
                self.drawTool.cancelDraw();
                // disable drawTool
                self.drawTool.drawButtonDeactivation();            
            });

            topic.subscribe(appTopics.map.layer.click, function(jobId) {
                //query for job data
                var progressTimer = setTimeout(function() {
                    self.showProgress()
                }, 2000);
                self.wmJobTask.getJob(jobId, function(data) {
                    self.hideProgress();
                    clearTimeout(progressTimer);
                    self.setMapAoi(self.currentJob.aoi, false);
                    topic.publish(appTopics.map.layer.jobQuery, data, self.serviceInfo.jobStatuses, self.serviceInfo.jobPriorities);
                }, function(error) {
                    self.hideProgress();
                    clearTimeout(progressTimer);

                    console.log("error retrieving job info for popup id:", jobId, error);
                });

                self.grid.content.dataGrid.clearSelection();
                self.grid.content.dataGrid.select(jobId);
                if (self.grid.content.dataGrid.row(jobId).element) {
                    //an error trips up the app if it tries to scroll to an element not in dom
                    self.grid.content.dataGrid.row(jobId).element.scrollIntoView();
                }
            });

            topic.subscribe("Properties/SaveDialog/Continue", function() {
                self.switchTabs();
            });

            console.log("done initTopics");
        },

        validateLogin : function(username, password) {
            var self = lang.hitch(this);
            self.user = username;

            if (self.authenticationMode == "token") {
                var webURL = document.URL;
                
                var tokenUrl = this.tokenServerUrl;
                if (!WMUtil.endsWith(tokenUrl, "/")) {
                    tokenUrl += "/";
                }
                var tokenRequest = esri.request({
                    url : tokenUrl + "generateToken",
                    content : {
                        f : "json",
                        username : username,
                        password : password,
                        clientid : "ref." + webURL,
                        expiration : 1440
                    },
                    callbackParamName : "callback",
                    preventCache: true,
                }, { usePost: true });  // Change to use POST since 10.3 doesn't allow username and password in the query string

                tokenRequest.then(function(data) {
                    // valid user login into server
                    self.setToken(data.token, data.expires);

                    // validate user against workflow manager
                    self.validateUser(self.user);
                    
                }, function(error) {
                    // handle an error condition
                    console.log("Unable to generate a security token.", error);
                    self.loginPage.invalidUser();
                });
            } else {
                self.validateUser(username);
            }
        },

        setToken : function(token, expiration) {
            this.token = token;
            this.tokenExpiration = expiration;
            this.wmAOILayerTask.token = token;
            this.wmConfigurationTask.token = token;
            this.wmJobTask.token = token;
            this.wmReportTask.token = token;
            this.wmTokenTask.token = token;
            this.wmWorkflowTask.token = token;
        },

        validateUser : function(username, password) {
            var self = lang.hitch(this);
            self.user = username;

            // validate user
            self.wmConfigurationTask.getUser(username, function(data) {
                //console.log("User details:", data);
                if (!data || !data.userName || data.userName == "") {

                    if (self.isWindowsUser) {
                        // show error
                        self.errorHandler(i18n.error.errorInvalidUsername.replace("{0}", username));
                    } else {
                        // show error on login screen
                        self.loginPage.invalidUser();
                    }
                } else {
                    // user details
                    self.user = data.userName;
                    // update username with correct case
                    self.userDetails = data;
                    // user privileges
                    self.initUserPrivileges(data.privileges);
                    // user queries
                    self.userQueries = data.userQueries;

                    // initialize UI framework
                    self.initFrameworkUI();
                }

            }, function(error) {
                var errMsg = i18n.error.errorRetrievingUser.replace("{0}", self.user);
                console.log(errMsg, error);
                if (self.isWindowsUser) {
                    self.errorHandler(errMsg, error);
                } else {
                    self.loginPage.invalidUser();
                }
            });
        },

        clearLoadingScreen : function() {
            var el = dom.byId("loading-outer");
            if (el)
                domStyle.set(el, "display", "none");

            this.grid.resize();
            //this.grid.content.resize();
            this.grid.content.dataGrid.resize();

            this.loading = false;
        },

        showProgress : function() {
            var el = dom.byId("processing-outer");
            if (el)
                domStyle.set(el, "display", "block");
        },

        hideProgress : function() {
            var el = dom.byId("processing-outer");
            if (el)
                domStyle.set(el, "display", "none");
        }
    };
}); 