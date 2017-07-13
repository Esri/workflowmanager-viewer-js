define([
    
    // dojo
    "dojo/topic", 
    "dojo/dom",
    "dojo/on",
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
    "dojo/store/Memory",

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
    
    //esri
    "esri/config",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/tasks/GeometryService",

     // Identity
    "esri/identity/ServerInfo",
    "esri/portal/Portal",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",

    // WM API
    "esri/tasks/workflow/LOILayerTask",
    "esri/tasks/workflow/ConfigurationTask",
    "esri/tasks/workflow/JobTask",
    "esri/tasks/workflow/ReportTask",
    "esri/tasks/workflow/TokenTask",
    "esri/tasks/workflow/WorkflowTask",

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

    // TODO No support in 4.x currently
    //"widget/gis/BasemapGallery", 
    //"widget/gis/DrawTool",

    "widget/Login",
    "widget/gis/EsriSearchDropDown",
    
    // Utils
    "utils/Expander",
    
    // i18n
    "dojo/i18n!./WorkflowManager/nls/Strings",
    
    // App configuration
    "./WorkflowManager/config/AppConfig",
    
    // Workflow configuration
    "./WorkflowManager/WorkflowConfiguration",

    // Constants
    "./WorkflowManager/Constants"

], function (
    topic, dom, on, domStyle, domConstruct, domClass, domGeom, arrayUtil, lang, win, json, connect, string, when, aspect, coreFx, baseFx, locale, query, Memory,
    registry, Dialog, BorderContainer, TabContainer, ContentPane, FilteringSelect, TextBox, Button, DropDownButton, ComboBox, RadioButton,
    esriConfig, QueryTask, Query, GeometryService,
    ServerInfo, ArcGISPortal, ArcGISOAuthInfo, IdentityManager,
    LOILayerTask, ConfigurationTask, JobTask, ReportTask, TokenTask, WorkflowTask,
    appTopics, Alert, Header, Filter, Grid, Statistics, Properties, ExtendedProperties, Notes, Workflow, Attachments, AttachmentItem, History, Aoi, Holds, mapTemplate, AoiFunctionsTemplate,
    MapUtil, WMUtil,
    EsriMap, EsriLegend, Coordinates, Login, EsriSearchDropDown,
    Expander,
    i18n,
    config, WorkflowConfiguration, Constants
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
        wmPOILayerTask : null,
        wmConfigurationTask : null,
        wmJobTask : null,
        wmReportTask : null,
        wmTokenTask : null,
        wmWorkflowTask : null,
        
        // AOI query layer objects
        aoiMapServiceUrl : null,
        aoiMapServiceLayerID : 0,
        aoiMapServiceQueryLayerUrl : null,
        aoiDynamicLayerDefinitions : null,

        poiMapServiceLayerID : 0,
        poiMapServiceQueryLayerUrl : null,

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
        userQueries : null,

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
        jobIdInURL : null,
        queryIdInURL : null,

        // Current query results
        initialQueryResultsLoaded : false,
        queryResultsThreshold : 300,
        queryResults : null,
        currentQueryId : null,
        selectedQuery : null,
        savedQuery : null,
        
        // Grid Array
        gridArr : null,
        gridArrPos : null,
        fromGrid : null,
        curJobDialogID : null,
        navigating : null,
        zoomToFeature : null,

        //i18n
        i18n_SearchResults : i18n.filter.results,
        i18n_NumberJobs : i18n.grid.numberJobs,

        // Assignment group
        currentAssignmentGroup : null,

        // Updating locks
        updatingAttachments : null,
        updatingExtendedProperties : null,
       
        handleURL : function() {
            //grab url and parse it,
            //pass the appropriate id to the correct variable
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
                        this.jobIdInURL = idNumber;
                    } else if (paramName == "QUERYID") {
                        this.queryIdInURL = idNumber;
                    }
                }
            }
        },

        startup : function(args) {
            var self = lang.hitch(this);
            
            //handle the url and any flags passed with it
            this.handleURL();
           
            //loading screen strings
            dom.byId("loadingAppTitle").innerHTML = i18n.header.title;
            dom.byId("loadingAppSubTitle").innerHTML = i18n.header.subHeader;
            dom.byId("loadingMessage").innerHTML = i18n.loading.loading;

            this.wmServerUrl = config.app.ServiceRoot;
            
            // AOI
            this.aoiMapServiceUrl = config.app.jobLOILayer.url;
            this.aoiMapServiceLayerID = config.app.jobLOILayer.AOILayerID != null ? config.app.jobLOILayer.AOILayerID : 0;
            this.aoiMapServiceQueryLayerUrl = this.aoiMapServiceUrl + "/" + this.aoiMapServiceLayerID;
            this.aoiDynamicLayerDefinitions = MapUtil.formatLayerDefinitions([
                    MapUtil.getLayerDefinition(this.aoiMapServiceLayerID, "1=0")
                ]);            
            // POI
            if (config.app.jobLOILayer.POILayerID !== undefined) {
                this.poiMapServiceLayerID = config.app.jobLOILayer.POILayerID;
                this.poiMapServiceQueryLayerUrl = this.aoiMapServiceUrl + "/" + this.poiMapServiceLayerID;
            }
            
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
                    } else {
                        this.errorHandler(i18n.error.errorRetrievingWindowsUser);
                    }
                    break;
                case "token" :
                    this.initLogin();
                    break;
                case "portal" :
					this.isPortalUser = true;
                    this.signInToPortal();
                    break;
                case "none" :
                case null :
                    if (config.app.AutoLogin == false || config.app.Reloaded) {
                        this.initLogin(null);
                    } else if (config.app.AutoLogin) {
                        this.initLogin(config.app.DefaultUser);
                    }
                    break;  
                default:
                    var errMsg = i18n.error.errorInvalidAuthenticationMode.replace("{0}", this.authenticationMode);
                    this.errorHandler(errMsg);
                    break;
            }
        },
        
        signInToPortal : function() {
            esriConfig.portalUrl = config.app.PortalURL;
            this.portalUrl = config.app.PortalURL;
            
            var info = new ArcGISOAuthInfo({
                appId : config.app.AppId,
                // Uncomment this line to prevent the user's signed in state from being shared
                // with other apps on the same domain with the same authNamespace value.
                authNamespace : "portal_oauth_inline",
                popup : false,
                portalUrl : this.portalUrl
            });
            IdentityManager.registerOAuthInfos([info]);
            
            afterSignIn = lang.hitch(this, function(portalUser) {
                console.log("Signed in to the portal: ", portalUser);
                this.initLogin(portalUser.username);
				this.portalUsername = portalUser.username;
				
				var token = null;
				var expires = null;
				if (portalUser.credential) {
                    token = portalUser.credential.token;
                    expires = portalUser.credential.expires;	    
				}
				// For portal authenticated requests, this is only really needed for URLs that 
				// the API constructs itself.  Requests using esri.request will already have the
				// token appended to it by IdentityManager
				this.setToken(token, expires);
            });
            signIn = lang.hitch(this, function() {
                var portal = new ArcGISPortal();
                // Setting authMode to immediate signs the user in once loaded
                portal.authMode = "immediate";
                // Once portal is loaded, user is signed in
                portal.load().then(afterSignIn);
            });
			IdentityManager.getCredential(this.portalUrl + "/sharing/");
			IdentityManager.checkSignInStatus(this.portalUrl + "/sharing/").then(signIn).otherwise(function(error) {
			    console.log("Error occurred while signing in: ", error);
			});
        },
		
		logoutUser : function(reload) {
			if (this.isPortalUser) {
				var credential = IdentityManager.findCredential(this.portalUrl, this.portalUsername);
				if (credential)
					credential.destroy();
				this.portalUsername = null;
			}
			
			if (this.isPortalUser || reload)
				location.reload();
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
            esriConfig.request.proxyUrl = config.proxy.url;
            esriConfig.request.forceProxy = config.proxy.alwaysUseProxy;

            // geometry service
            this.geometryService = new GeometryService(config.geometryServiceURL);

            this.wmAOILayerTask = new LOILayerTask(this.aoiMapServiceQueryLayerUrl);
            if (this.poiMapServiceQueryLayerUrl != null)
                this.wmPOILayerTask = new LOILayerTask(this.poiMapServiceQueryLayerUrl);
            this.wmConfigurationTask = new ConfigurationTask(this.wmServerUrl);
            this.wmReportTask = new ReportTask(this.wmServerUrl);
            this.wmJobTask = new JobTask(this.wmServerUrl);
            this.wmWorkflowTask = new WorkflowTask(this.wmServerUrl);
            this.wmTokenTask = new TokenTask(this.wmServerUrl);
        },
        
        initConfig : function() {
            console.log("initConfig called");
            var self = lang.hitch(this);

            self.banner.content.setUserName(self.userDetails.fullName);

            //load general information
            console.log("Loading WM service info");
            self.showProgress();
            var wmConfig = new WorkflowConfiguration();
            wmConfig.loadServiceConfiguration({
                user : this.user,
                aoiLayerTask : this.wmAOILayerTask,
                poiLayerTask : this.wmPOILayerTask,
                configurationTask : this.wmConfigurationTask
            });
        },

        onServiceConfigurationLoaded : function() {
            var self = lang.hitch(this);
            console.log("Populating components with service configuration");

            // Populate queries
            //console.log("Populating queries");
            self.filter.content.setQueries(self.serviceInfo.publicQueries, self.userQueries);

            // Get reports
            self.wmReportTask.getAllReports().then(function(reports) {
                self.filter.content.setReportStore(reports);
            }, function(error) {
                var errMsg = i18n.error.errorGettingReports;
                console.log(errMsg, error);
                self.errorHandler(errMsg, error);
            });

            //Add no workspace option
            var noDataWorkspace = {
                id : "0",
                name : i18n.properties.noDataWorkspace
            };
            self.serviceInfo.dataWorkspaces.unshift(noDataWorkspace);

            // Initialize properties
            //console.log("Initializing job properties...");
            self.tabProperties.content.initialize({
                user : self.user,
                userDetails : self.userDetails,
                userPrivileges : self.userPrivileges,
                users : self.users,
                groups : self.groups,
                jobTypes : self.serviceInfo.jobTypes,
                jobStatuses : self.serviceInfo.jobStatuses,
                dataWorkspaces : self.serviceInfo.dataWorkspaces,
                jobPriorities : self.serviceInfo.jobPriorities,
            });

            // populate holds dropdown
            //console.log("Populating holds tab");
            self.tabHolds.content.populateDropdowns({
                holdTypes : self.serviceInfo.holdTypes
            });

            // Initialize filter
            //console.log("Initializing filter...");
            self.filter.content.initialize({
                user : self.user,
                userDetails : self.userDetails,
                userPrivileges : self.userPrivileges,
                users : self.users,
                groups : self.groups,
                jobTypes : self.visibleJobTypes,
                dataWorkspaces : self.serviceInfo.dataWorkspaces,
                jobPriorities : self.serviceInfo.jobPriorities
            });

            //console.log("Populating map aoiJobIdField");
            self.myMap.jobIdField = self.aoiJobIdField;
            if (self.poiJobIdField != null)
                self.myMap.poiJobIdField = self.poiJobIdField;

            aspect.around(this.tabs, "selectChild", function(selectChild) {
                return function(page) {
                    var oldVal = self.tabs.get("selectedChildWidget");
                    var newVal = arguments[0];
                    self.curJobDialogID = newVal.id;
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
                            zoomToFeature : false
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
                            zoomToFeature : false
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

        checkAttachmentPrivileges : function() {
            //check for user privileges and job properites
            var jobHold = this.jobHasActiveHold;
            var canAddHeld = this.userPrivileges.canAddAttachesForHeldJobs;
            var canManageAttach = this.userPrivileges.canManageAttachments;
            var jobClosed = (this.currentJob.stage == Constants.JobStage.CLOSED);
            if (jobHold) {
                this.jobWarning.innerHTML = i18n.header.onHold;
            } else if (jobClosed) {
                this.jobWarning.innerHTML = i18n.header.closed;
            } else {
                this.jobWarning.innerHTML = "";
            }
            return {
                jobHold : jobHold,
                canAddHeld : canAddHeld,
                canManageAttach : canManageAttach,
                jobClosed : jobClosed
            };
        },

        switchTabs : function() {
            var self = lang.hitch(this);
            this.doSelectChild.apply(this.selectChildObject, this.selectChildArgs);
        },

        initVisibleJobTypes : function(username) {
            var self = lang.hitch(this);
            this.wmConfigurationTask.getVisibleJobTypes(username).then(function(response) {
                self.visibleJobTypes = response;
                // init framework
                self.initFrameworkUI();
            }, function (error) {
                // init framework
                self.initFrameworkUI();
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

        getJobsByQueryId : function(queryId, reset) {
            var self = lang.hitch(this);
            //number of times it will try to retrieve results
            var queryTryTotal = 2;
            var queryTryCount = 0;

            if (self.queryIdInURL) {
                var queryName = self.filter.content.setQueryNameFromId(self.queryIdInURL);
                if (queryName) {
                    self.savedQuery = queryName;
                    queryId = self.queryIdInURL;
                }
                self.queryIdInURL = null;
            }

            this.currentQueryId = queryId;
            this.selectedQuery = self.savedQuery;
            //console.log("Query Id:", queryId);
            //if results aren't returned within 2 seconds it will show progress bar
            var progressTimer = setTimeout(function() {
                self.showProgress();
            }, 10000);

            //query function
            var queryById = function() {
                var params = {
                    queryId: queryId,
                    user: self.user
                };
                self.wmJobTask.queryJobs(params).then(lang.hitch(self, function(data) { // execute “AllJobs” query
                    //hide progress bar when results are returned
                    self.hideProgress();
                    //clear progress timer so it wont show progress bar if it hasn't already
                    clearTimeout(progressTimer);
                    //clear timeout function so it stops retrying
                    clearInterval(queryTimeout);

                    console.log("queryJobs succeeded: ", data);

                    //first check jobIdInURL, if true then short circuit and only grab one job
                    //then check queryIdInURL, if true set it to false to avoid loop and call getjobsbyqueryid again
                    //otherwise continue as usual and get all jobs
                    
                    self.populateQueryResults(data);
                    
                    if (reset) {
                        self.resetQueryLabel();
                    }

                }), function(error) {
                    //hide progress bar when results are returned
                    self.hideProgress();
                    //clear progress timer so it wont show progress bar if it hasn't already
                    clearTimeout(progressTimer);
                    //clear timeout function so it stops retrying
                    clearInterval(queryTimeout);

                    var errMsg = i18n.error.errorRunningQuery.replace("{0}", self.currentQueryId);
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            };

            //create timeout function to be run every 10 seconds
            var queryTimeout = setInterval(function() {
                //run query if number of allowed tries hasn't been reached yet
                if (queryTryCount < queryTryTotal) {
                    queryById();
                    queryTryCount++;
                } else {
                    //clear timer if the max tries has been reached
                    clearInterval(queryTimeout);
                }
            }, 20000);

            if (self.jobIdInURL) {
                clearInterval(queryTimeout);
                self.selectedQuery = self.i18n_SearchResults;
                self.getJobsByJobIds([self.jobIdInURL]);
                clearTimeout(progressTimer);
                self.jobIdInURL = null;
            } else {
                queryById();
            }

            // TODO Application should load with or without a query being selected
            // CLEAR LOADING SCREEN WHEN ALL THE INFORMATION IS RETRIEVED
            // remove loading screen
            if (this.loading) {
                this.clearLoadingScreen();
            }

            // Temporary sizing fix
            this.outer.resize();
        },

        getJobsByJobIds : function(jobIds) {//Array of job Ids
            var self = lang.hitch(this);
            var params = {
                fields: "JTX_JOBS.JOB_ID,JTX_JOBS.JOB_NAME,JTX_JOB_TYPES.JOB_TYPE_NAME,JTX_JOBS.ASSIGNED_TO,JTX_JOBS.DUE_DATE,JTX_JOBS.DESCRIPTION",
                tables: "JTX_JOBS,JTX_JOB_TYPES",
                aliases: i18n.filter.queryFieldDescriptions,
                where: "JTX_JOB_TYPES.JOB_TYPE_ID=JTX_JOBS.JOB_TYPE_ID AND JTX_JOBS.JOB_ID IN (" + jobIds.join(",") + ")",
                user: self.user
            };
            self.wmJobTask.queryJobsAdHoc(params).then(function(data) {
                self.populateQueryResults(data);
                self.hideProgress();
            }, function(error) {
                console.log("getJobsAdHoc (params " + params + ") failed: " + errMsg);
                var errMsg = i18n.error.errorFindingJobsById.replace("{0}", jobIds.join());
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
            var numRows = (rows.length) ? rows.length : 0;
            if (!this.initialQueryResultsLoaded) {
                // If this is the first time we're processing query results (loading the app)
                // and if the number of results are great than the threshold value, then do not
                // prepopulate the categorized by values
                this.initialQueryResultsLoaded = true;
                if (numRows > this.queryResultsThreshold) {
                    this.statisticsContainer.content.populateDropdowns(customColumns, false);
                } else {
                    this.statisticsContainer.content.populateDropdowns(customColumns, true);
                }
            } else {
                this.statisticsContainer.content.populateDropdowns(customColumns, true);
            }

            //update the feature definition expression
            this.myMap.getUpdatedFeatures(rowIds);
        },
        
        getJobIdColumnField : function(columns) {
            
            for (var column in columns) {
                if (WMUtil.isField(column, "JTX_JOBS.JOB_ID")) {
                    return column;
                }
            }
            return null;
        },
        
        resetQueryLabel : function() {
            var self = lang.hitch(this);
            this.grid.content.numberJobs.innerHTML = this.i18n_NumberJobs.replace("{0}", this.rows.length);
            this.grid.content.selectedQueryName.innerHTML = this.savedQuery;
            this.selectedQuery = this.savedQuery;
        },

        //reset the filter after filterRow has been called
        resetRow : function() {
            if (this.columns && this.rows && this.queryResults) {
                topic.publish(appTopics.chart.handleShape, this, {});
                this.grid.content.setGridData(this.columns, this.rows, this.queryResults.fields[0].name);
                this.myMap.getUpdatedFeatures(this.rowIds);
                this.grid.content.numberJobs.innerHTML = this.i18n_NumberJobs.replace("{0}", this.rows.length);
                this.grid.content.selectedQueryName.innerHTML = this.selectedQuery;
            }
        },
        
        //filter the rows in a grid via the inputed field types, and there corresponding fields
        //also accounts for N/A
        filterRow : function(filterField1, filterField2) {
            filterRows = [];
            var rows = this.rows;
            var columns = this.columns;
            var jobIdField = this.getJobIdColumnField(columns);
            var filterField1Type = null;
            var filterField2Type = null;

            if (filterField1) {
                var filterField1Type = this.statisticsContainer.content.chartCategorizedBy.item.id;
                if (filterField2)
                    filterField2Type = this.statisticsContainer.content.chartGroupedBy.item.id;
            } else {
                var filterField1Type = this.statisticsContainer.content.chartGroupedBy.item.id;
                filterField1 = filterField2;
            }

            if (filterField1 == "N/A") {
                filterField1 = "";
            }
            if (filterField2 == "N/A") {
                filterField2 = "";
            }

            var rowIds = [];

            for (var key in rows) {
                var obj = rows[key];
                if (filterField2Type) {
                    if (obj[filterField1Type] == filterField1 && obj[filterField2Type] == filterField2) {
                        filterRows.push(obj);
                        rowIds.push(obj[columns[this.queryResults.fields[0].name].id]);
                    }

                } else {
                    if (obj[filterField1Type] == filterField1) {
                        filterRows.push(obj);
                        rowIds.push(obj[columns[this.queryResults.fields[0].name].id]);
                    }
                }
            }

            this.grid.content.numberJobs.innerHTML = this.i18n_NumberJobs.replace("{0}", filterRows.length);
            this.myMap.getUpdatedFeatures(rowIds);
            this.grid.content.setGridData(columns, filterRows, this.queryResults.fields[0].name);
        },

        filterGrid : function(sender, args) {
            var self = lang.hitch(this);
            // search jobs by the text input value
            // returns all objects that contain the string
            var progressTimer = setTimeout(function() {
                self.showProgress();
            }, 2000);
            var params = {
                text: args.value,
                user: this.user
            };
            this.wmJobTask.searchJobs(params).then(function(data) {
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
            if (this.grid.content.dataGrid.collection == null)
                return;
                
            var self = lang.hitch(this);
            var intIndex = 0;
            var currentCategorizedByValue = this.getCategorizedValue();
            var currentGroupedByValue = this.getGroupedValue();
            
            if (currentCategorizedByValue < 0) {
                // Clear grouped by selection
                this.statisticsContainer.content.clearGroupedBySelection();
                // Reset data in bar chart
                this.statisticsContainer.content.statsBarChart.prepareData(new Array(), new Array());
                // Reset data in pie chart
                this.statisticsContainer.content.statsPieChart.prepareData(new Array(), new Array());
                
            } else {
                
                // prepare data based on grid rows (store)
                var uniqueValues = new Array();
                var uniqueValuesKeys = new Array();
                arrayUtil.forEach(this.grid.content.dataGrid.collection.data, function(row) {
                    if (uniqueValues[row[self.queryResults.fields[currentCategorizedByValue].name]] === undefined) {
                        uniqueValues[row[self.queryResults.fields[currentCategorizedByValue].name]] = 0;
                        uniqueValuesKeys.push(row[self.queryResults.fields[currentCategorizedByValue].name]);
                    }
                    uniqueValues[row[self.queryResults.fields[currentCategorizedByValue].name]] += 1;
                });
            
                // if currentGroupedByValue is not 'none'}    
                if (currentGroupedByValue > 0) {// grouped by selected
                    // prepare the charts (based on grouped by value)
                    var uniqueGroupedByValues = new Array();
                    var uniqueGroupedByValuesKeys = new Array();
    
                    // gather and prepare the grouped data
                    arrayUtil.forEach(this.grid.content.dataGrid.collection.data, function(row) {
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

        getColumns : function() {
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
                self.showProgress();
            }, 2000);

            this.wmJobTask.getJob(args.jobId).then(function(data) {
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
                var loi = data.loi;
                self.selectJobLOI(args.jobId, loi, args.zoomToFeature);

                //set draw tool buttons
                if (self.drawTool) {
                    self.drawTool.drawButtonDeactivation();
                    self.drawTool.drawButtonActivation(loi);
                }

                // execute alternative function
                // if not execute update properties
                if (args.thenFunction)
                    args.thenFunction();
                else
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
        selectJobLOI : function(jobId, loi, zoomToFeature) {
            var self = lang.hitch(this);
            if (loi) {
                //set loi
                self.myMap.drawLoi(jobId, loi, zoomToFeature);
            } 
        },

        updateGridButtons : function() {
            var self = lang.hitch(this);
            var canDelete = self.userPrivileges.canDeleteJobs;
            var canClose = self.userPrivileges.canCloseJob && self.currentJob.stage != Constants.JobStage.CLOSED;
            var canReopen = self.userPrivileges.canReopenClosedJobs && self.currentJob.stage == Constants.JobStage.CLOSED;
            
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

        gridPrivileges : function() {
            // Hides the close, reopen and delete buttons based on privileges
            var canDelete = this.userPrivileges.canDeleteJobs;
            var canClose = this.userPrivileges.canCloseJob;
            var canReopen = this.userPrivileges.canReopenClosedJobs;
            this.grid.content.setPrivileges(canDelete, canClose, canReopen);
        },

        extendedPropertiesPrivileges : function() {
            // extended properties are editable if:
            //  - job is not closed
            //  - job is not on hold
            //  - user has privilege to manage extended properties
            var editable = this.userPrivileges.canManageExtendedProperties && this.currentJob.stage != Constants.JobStage.CLOSED && !this.jobHasActiveHold;
            this.tabExtendedProperties.content.setEditable(editable);
        },

        holdsPrivilege : function() {
            var self = lang.hitch(this);

            // Holds are editable if:
            //  - job is not closed
            //  - user has privilege to manage holds
            //  - job is owned by or assigned to the current user
            if (self.currentJob.id && self.currentJob.stage != Constants.JobStage.CLOSED && self.userPrivileges.canManageHolds &&
                (self.currentJob.ownedBy == self.user || (self.currentJob.assignedType == Constants.JobAssignmentType.ASSIGNED_TO_USER && self.currentJob.assignedTo == self.user))) {
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
            if (self.currentJob.id && (self.currentJob.stage != Constants.JobStage.CLOSED) && (!self.jobHasActiveHold) &&
                (self.currentJob.assignedType == Constants.JobAssignmentType.UNASSIGNED || self.currentJob.ownedBy == self.user || (self.currentJob.assignedType == Constants.JobAssignmentType.ASSIGNED_TO_USER && self.currentJob.assignedTo == self.user))) {
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
            if (self.currentJob.id && (self.currentJob.stage != Constants.JobStage.CLOSED) && (!self.jobHasActiveHold) &&
                (self.currentJob.assignedType == Constants.JobAssignmentType.UNASSIGNED || self.currentJob.ownedBy == self.user || (self.currentJob.assignedType == Constants.JobAssignmentType.ASSIGNED_TO_USER && self.currentJob.assignedTo == self.user))) {
                self.tabHistory.content.setEditable(true);
            } else {
                self.tabHistory.content.setEditable(false);
            }
        },

        aoiPrivileges : function() {
            var self = lang.hitch(this);

            // AOI is editable if:
            //  - job is not closed
            //  - user has privilege to manage holds
            //  - job has no active holds
            //  - job is owned by current user, or job is assigned to the current user
            var hasAOIPermission = false;
            if (self.currentJob.id && self.currentJob.stage != Constants.JobStage.CLOSED && self.userPrivileges.canManageAOI &&
                (self.currentJob.ownedBy == self.user || (self.currentJob.assignedType == Constants.JobAssignmentType.ASSIGNED_TO_USER && self.currentJob.assignedTo == self.user))) {
                hasAOIPermission = true;
            };

            if (self.drawTool) {
                self.drawTool.hasAOIPermission = hasAOIPermission;
                self.drawTool.AOIOverlapOverride = self.userPrivileges.AOIOverlapOverride;
            }
        },

        attachmentPrivileges : function() {
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
        
        updateAttachments : function(jobId) {
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
                self.wmJobTask.getAttachments(jobId).then(function(data) {
                    jobAttachments = data;
                    if (jobAttachments.length > 0) {
                        console.log("Attachments for " + jobId + ": " + jobAttachments);
                        self.tabAttachments.content.populateAttachments(jobAttachments);
                    };
                    self.updatingAttachments = false;
                }, function(error) {
                    var errMsg = i18n.error.errorRetrievingAttachments;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                    self.updatingAttachments = false;
                });
            }
        },

        updateExtendedProperties : function(jobId) {
            var self = lang.hitch(this);
            //stop double population
            if (!self.updatingExtendedProperties) {
                self.updatingExtendedProperties = true;
                //clear the tab
                console.log("clear extended properties ran");
                self.tabExtendedProperties.content.clearProperties();
                //populate the tab
                self.wmJobTask.getExtendedProperties(jobId).then(function(containers) {
                    console.log("Extended Properties for " + jobId);
                    self.tabExtendedProperties.content.populateExtendedProperties(containers);
                    self.updatingExtendedProperties = false;
                }, function(error) {
                    var errMsg = i18n.error.errorRetrievingExtendedProperties;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                    self.updatingExtendedProperties = false;
                });
            }
        },

        updateWorkflow : function() {
            var self = lang.hitch(this);
            var canUserRecreateThisWorkflow = self.userPrivileges.canRecreateWorkflow && self.currentJob.stage != Constants.JobStage.CLOSED;
            self.tabWorkflow.content.initializeProperties({
                workflowTask : self.wmWorkflowTask,
                jobTask : self.wmJobTask,
                tokenTask : self.wmTokenTask,
                commentActivityType : self.commentActivityTypeId,
                currentUser : self.user,
                currentJob : self.currentJob,
                canRecreateWorkflow : canUserRecreateThisWorkflow
            });
            self.tabWorkflow.content.initializeWorkflow();
        },

        updateNotes : function() {
            var self = lang.hitch(this);
            // populate notes
            this.wmJobTask.getNotes(this.currentJob.id).then(function(data) {
                self.tabNotes.content.setCurrentJobNotes(data);
            });
        },

        updateHistory : function() {
            var self = lang.hitch(this);
            var jobId = self.currentJob.id;

            // get history log
            var activityRecord = new Array();
            // Method not succeeding
            this.wmJobTask.getActivityLog(jobId).then(function(data) {
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

        updateHolds : function() {
            var self = lang.hitch(this);
            var jobId = self.currentJob.id;

            //reset current hold
            this.jobHasActiveHold = false;

            // Get job holds
            this.wmJobTask.getHolds(jobId).then(function(data) {
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
                content : new Header({
                    hasLogout : !this.isWindowsUser
                })
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

            //create report dialog
            this.reportDialog = new Dialog({
                id : "reportDialog",
                style : "min-height: 100px",
                isLayoutContainer : true,
                draggable : false,
                autofocus : false,
            });
            this.reportDialog.startup();
            this.reportDialogContent = domConstruct.create("div");
            domConstruct.place(this.reportDialogContent, this.reportDialog.containerNode, 0);
            this.reportURL = domConstruct.create("a", {
                class : "report-URL",
                href : "#",
                target : "_blank",
                innerHTML : i18n.filter.reportWindow
            });
            domConstruct.place(this.reportURL, this.reportDialog.titleBar, 2);

            //Create dialog
            this.jobDialog = new Dialog({
                id : "jobDialog",
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
            this.jobWarning = domConstruct.create("span", {
                class : "warning-label",
                innerHTML : ""
            });
            domConstruct.place(this.jobWarning, this.jobDialog.titleBar, 2);
            this.jobDialogRight = domConstruct.create("span", {
                class : "jobDialogRightButton",
                innerHTML : ">"
            });
            domConstruct.place(this.jobDialogRight, this.jobDialog.titleBar, 3);
            this.jobDialogLeft = domConstruct.create("span", {
                class : "jobDialogLeftButton",
                innerHTML : "<"
            });
            domConstruct.place(this.jobDialogLeft, this.jobDialog.titleBar, 3);

            this.navInfo = domConstruct.create("span", {
                class : "jobDialogNavInfo",
                innerHTML : ""
            });
            domConstruct.place(this.navInfo, this.jobDialog.titleBar, 3);

            on(this.jobDialogRight, 'mouseenter', function(e) {
                self.jobDialogRight.style.opacity = '1';
            });
            on(this.jobDialogRight, 'mouseleave', function(e) {
                self.jobDialogRight.style.opacity = '0.65';
            });

            on(this.jobDialogLeft, 'mouseenter', function(e) {
                self.jobDialogLeft.style.opacity = '1';
            });

            on(this.jobDialogLeft, 'mouseleave', function(e) {
                self.jobDialogLeft.style.opacity = '0.65';
            });

            on(this.jobDialogRight, 'click', function(e) {
                //code to move traverse forward
                self.gridArrPos++;
                if (self.fromGrid) {
                    if (self.gridArrPos == (self.gridArr.length - 1))
                        self.gridArrPos = 1;
                } else {
                    if (self.gridArrPos > self.gridArr.length)
                        self.gridArrPos = 1;
                }
                self.updateJobDialog();
            });

            on(this.jobDialogLeft, 'click', function(e) {
                //code to traverse back ward
                self.gridArrPos--;
                if (self.gridArrPos == 0) {
                    if (self.fromGrid) {
                        self.gridArrPos = self.gridArr.length - 2;
                    } else {
                        self.gridArrPos = self.gridArr.length;
                    }
                }
                self.updateJobDialog();
            });

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
            dojo.byId("tabs_tablist").style.width = "200px";
            this.tabs.containerNode.style.left = "200px";

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
                id : "tabWorkflow",
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
                title : i18n.extendedProperties.title,
                content : new ExtendedProperties(),
                id : "tabExtendedProperties",
                style : "padding-top: 0; padding-bottom: 0;"
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
                title : i18n.notes.title,
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
                self.tabWorkflow.content.resize();
                self.tabExtendedProperties.content.resize();
                self.myMap.resize();
            };
        },

        updateNavInfo : function() {
            if (this.fromGrid)
                this.navInfo.innerHTML = i18n.header.navInfo.replace("{0}", this.gridArrPos).replace("{1}", (this.gridArr.length - 2));
            else
                this.navInfo.innerHTML = i18n.header.navInfo.replace("{0}", this.gridArrPos).replace("{1}", (this.gridArr.length));
        },

        updateJobDialog : function() {
            this.updateNavInfo();
            var jobId = this.gridArrPosToJobId(this.gridArr, this.gridArrPos);
            this.navigating = true;
            this.grid.content.dataGrid.clearSelection();
            this.grid.content.dataGrid.select(jobId);
            this.grid.content.dataGrid.row(jobId).element.scrollIntoView();

            this.reloadJobDialog(jobId);
            this.navigating = false;
        },

        gridArrPosToJobId : function(gridArr, gridArrPos) {
            var jobId;
            if (this.fromGrid)
                jobId = gridArr[gridArrPos].firstChild.firstChild.firstChild.innerText;
            else
                jobId = gridArr[gridArrPos - 1];
            return jobId;
        },

        reloadJobDialog : function(jobId) {
            var self = lang.hitch(this);
            
            var thenFunction = null;
            switch (self.curJobDialogID) {
                case self.tabProperties.id:
                    //refresh job data
                    //temp clear update properties notification
                    self.tabProperties.content.updateCallback("");
                    break;
                case self.tabWorkflow.id:
                    //refresh job data
                thenFunction = function() {
                        self.updateWorkflow();
                    };
                    break;
                case self.tabHistory.id:
                    //update tab
                thenFunction = function() {
                        self.updateHistory();
                    };
                    break;
                case self.tabNotes.id:
                    //update tab
                thenFunction = function() {
                        self.updateNotes();
                    };
                    break;
                case self.tabHolds.id:
                    //update tab
                thenFunction = function() {
                        self.updateHolds();
                    };
                    break;
                case self.tabExtendedProperties.id:
                    //update tab
                thenFunction = function() {
                        // Do nothing and Skip update properties
                    };
                self.updateExtendedProperties(jobId);
                    break;
                case self.tabAttachments.id:
                thenFunction = function() {
                        // Do nothing and Skip update properties
                    };
                self.updateAttachments(jobId);
                    break;
                default:
                    break;

            }
            self.getJobById({
                jobId : jobId,
                updateWorkflow : false,
                zoomToFeature : self.zoomToFeature,
                thenFunction : thenFunction
            });
        },

        initMap : function() {
            var self = lang.hitch(this);
            this.myMap = new EsriMap({
                mapConfig : config.map,
                poiLayerID : config.app.jobLOILayer.POILayerID,
                aoiLayerID : config.app.jobLOILayer.AOILayerID,
                mapTopics : appTopics.map,
                mapId : self.mapPanel.id,
                controller : self
            });

            // TODO Is there a reason initWidgets is called during map onLoad?
            //this.myMap.map.on("load", self.initWidgets);
            this.myMap.startup();

            this.initWidgets();

            // TODO No support in 4.x currently
            // BasemapGallery
            //  if (config.map.basemapGallery.isEnabled) {

            //  this.basemapGallery = new BasemapGallery({
            //     map : this.myMap.map,
            //     basemapConfig : config.map.basemapGallery,
            //     customBasemapConfig : config.map.customBasemaps,
            //     galleryId : "myMapBasemapGallery"
            //  }, "basemapGalleryContainer");
            //     this.basemapGallery.startup();
            //     this.basemapGallery.selectBasemap(config.map.defaultBasemap);
            //  }

            // TODO Reconfigure this to work with 4.x
            // if (config.map.legend.isEnabled) {
            //     this.legend = new EsriLegend({
            //         map : this.myMap.map,
            //         legendConfig : config.map.legend
            //     }, "esriLegendContainer");
            //     this.legend.startup();
            // }

            // TODO Reconfigure this to work with 4.x
            // if (config.map.coordinates.isEnabled) {
            //     this.coordinates = new Coordinates({
            //         map : this.myMap.map,
            //         coordinatesConfig : config.map.coordinates
            //     }, "coordinatesContainer");
            //     this.coordinates.startup();
            // }

            // TODO No support in 4.x currently
            // if (config.map.drawTool.isEnabled) {
            //     this.drawTool = new DrawTool({
            //     map : this.myMap.map,
            //     drawConfig : config.map.drawTool
            // }, "drawContainer");
            //     this.drawTool.startup();
            // }

            this.searchTool = new EsriSearchDropDown({
                map : this.myMap.map,
                customSources : config.map.search.customSources,
                sources : config.map.search.locatorSources
            }, "searchContainer");
            this.searchTool.startup();
        },

        addLOIDynamicMapLayersToMap : function() {
            // Job LOI layers
            this.myMap.addLOIDynamicLayers({
                layerConfig : config.app.jobLOILayer,
                aoiQueryLayerUrl : this.aoiMapServiceQueryLayerUrl,
                poiQueryLayerUrl : this.poiMapServiceQueryLayerUrl
            });
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
            
            //topic for logging out a user
            topic.subscribe(appTopics.manager.logoutUser, function(sender, args) {
                self.logoutUser(true);
            });
            
            //topic for updating Extended Properties
            topic.subscribe(appTopics.extendedProperties.updateExtendedProperties, function(sender, args) {
                var params = {
                    jobId: self.currentJob.id,
                    record: args.record,
                    user: self.user
                };
                self.wmJobTask.updateRecord(params).then(function (success) {
                    console.log("");  // LNL TEMP
                }, function(error) {
                    var errMsg = i18n.error.errorUpdatingExtendedProperties;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            });

            topic.subscribe(appTopics.extendedProperties.getFieldValues, function(sender, args) {
                var params = {
                    jobId: self.currentJob.id,
                    tableName: args.tableName,
                    field: args.field,
                    user: self.user
                };
                self.wmJobTask.listFieldValues(params).then(function (response) {
                    args.callback(sender, response);
                }, function(error) {
                     var errMsg = i18n.error.errorGettingFieldValues;
                     console.log(errMsg, error);
                     self.errorHandler(errMsg, error);
                 });

             });

            topic.subscribe(appTopics.extendedProperties.getMultiListValues, function(sender, args) {
                var params = {
                    field: args.field,
                    user: self.user
                };
                self.wmJobTask.queryMultiLevelSelectedValues(params).then(function (response) {
                    args.callback(sender, response);
                }, function(error) {
                    var errMsg = i18n.error.errorGettingMultiFieldValues;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });

            });

            topic.subscribe(appTopics.extendedProperties.getMultiListStores, function(sender, args) {
                var params = {
                    field: args.field,
                    previousSelectedValues: args.curSelectedValues,
                    user: self.user
                };
                self.wmJobTask.listMultiLevelFieldValues(params).then(function (response) {
                    args.callback(sender, response, args.storeLevel);
                }, function(error) {
                    var errMsg = i18n.error.errorGettingMultiFieldValues;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });

            });

            //new topics for selecting bar/charts
            topic.subscribe(appTopics.manager.serviceConfigurationLoaded, function(sender, args) {
                console.log("Service configuration loaded", args);
                self.serviceInfo = args.serviceInfo;
                self.users = args.users;
                self.groups = args.groups;
                self.dataWorkspaceDetails = args.dataWorkspaceDetails;
                self.aoiJobIdField = args.aoiJobIdField;
                self.poiJobIdField = args.poiJobIdField;
                self.commentActivityTypeId = args.commentActivityTypeId;
                self.onServiceConfigurationLoaded();

                self.addLOIDynamicMapLayersToMap();
                topic.publish(appTopics.map.setup, {
                    jobPriorities : args.serviceInfo.jobPriorities,
                    jobStatuses : args.serviceInfo.jobStatuses
                });
            });

            topic.subscribe(appTopics.filter.generateReport, function(sender, args) {
                var params = {
                    reportId: args.reportId,
                    user: self.user
                };
                self.wmReportTask.generateReport(params).then(function(data) {
                    self.reportDialogContent.innerHTML = data;
                    if (data.search("margin") == -1) {
                        self.reportURL.style.display = "none";
                        self.errorHandler(data);
                        return;
                    } else {
                        self.reportURL.style.display = "";
                    }
                    self.reportDialog.set("title", (args.title + "    "));
                    self.reportURL.href = self.wmReportTask.getReportContentUrl(params);
                    self.reportDialog.show();
                }, function(error) {
                    var errMsg = i18n.error.errorGeneratingReport;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            });

            topic.subscribe(appTopics.filter.jobSearch, function(sender, args) {
                if (args.value == "") {
                    //Resets filter, defaults to All Jobs
                    self.getJobsByQueryId(selectedFilter);
                } else {
                    self.filterGrid(sender, args);
                };
            });

            topic.subscribe(appTopics.filter.jobQueriesChanged, function(sender, args) {
                self.grid.content.selectedQueryName.innerHTML = args.selectedQuery;
                self.savedQuery = args.selectedQuery;
                self.getJobsByQueryId(args.selectedId);
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
                if (!self.navigating) {
                    self.fromGrid = true;
                    self.gridArr = args.gridArr;
                    self.gridArrPos = args.gridArrPos;
                    if (self.gridArr)
                        self.updateNavInfo();

                    self.getJobById({
                        jobId : args.selectedId,
                        updateWorkflow : false,
                        zoomToFeature : args.zoomToFeature
                    });
                }
                self.selectedRowId = args.selectedId;
                self.zoomToFeature = args.zoomToFeature;

                // TODO Fix this
                //clear map job popup
                //self.myMap.map.infoWindow.hide();
            });

            topic.subscribe(appTopics.filter.newJob, function(sender, args) {
                //add new job
                console.log("Creating jobs, args: ", args);
                self.showProgress();
                args.user = self.user;  // add user to list of arguments
                self.wmJobTask.createJobs(args).then(function (data) {
                    self.hideProgress();

                    var jobIds = data;
                    self.selectedQuery = i18n.grid.newJob;
                    console.log("Jobs created successfully: ", jobIds);
                    self.getJobsByJobIds(jobIds);
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
                    self.showProgress();
                }, 2000);
                
                var currentGraphic = args.graphics.graphics[0];
                currentGraphic.geometry.spatialReference = self.myMap.map.spatialReference;

                if (currentGraphic.geometry.type == "polygon") {
                // simplify the polygon to remove any self-intersecting rings
                    self.geometryService.simplify([currentGraphic.geometry]).then(updateLOI, errorUpdatingLOI);
                } else {
                    updateLOI([currentGraphic.geometry]);
                }

                function updateLOI(geometries) {
                    currentGraphic.setGeometry(geometries[0]);
                    var jobId = self.currentJob.id;
                    var loi = currentGraphic.geometry;
        
                    var params = {
                        jobId: jobId,
                        loi: loi,
                        user: self.user
                    };
                    self.wmJobTask.updateJob(params).then(function(data) {
                        console.log("LOI updated successfully");
                            self.hideProgress();
                            clearTimeout(progressTimer);
                            
                            if (data.error) {
                            errorUpdatingLOI(error);
                            }
                              
                            //clear graphics
                            sender.clearGraphics();
                            if (self.drawTool) {
                                self.drawTool.btnClearLoi.set("disabled", false);
                            }

                            //reload job
                            topic.publish(appTopics.grid.rowSelected, this, {
                                selectedId : self.selectedRowId,
                                selectedFromGrid : true,
                            zoomToFeature : false
                            });
        
                            self.myMap.setMapExtent();
                            self.myMap.refreshLayers();
                            
                    }, errorUpdatingLOI);
                }
                
                function errorUpdatingLOI(error) {
                    self.hideProgress();
                    clearTimeout(progressTimer);
                    
                    var errMsg = i18n.error.errorUpdatingJobLOI;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                    if (self.drawTool) {
                       self.drawTool.graphics.clear();
                    }
                }

            });

            topic.subscribe(appTopics.grid.jobDialog, function(sender, args) {
                self.selectedRowId = args.selectedId;
                if (args.gridArr) {
                    self.fromGrid = false;
                    self.gridArr = args.gridArr;
                    self.gridArrPos = args.gridArrPos;
                    self.updateNavInfo();
                }
                //select props tab on open
                self.tabs.selectChild(self.tabProperties);

                // TODO Fix this
                //hide and show popups
                //self.myMap.map.infoWindow.hide();
                self.jobDialog.show();
            });

            // add hold
            topic.subscribe(appTopics.holds.addHold, function(sender, args) {
                if (args.holdType != "") {
                    var params = {
                        jobId: self.currentJob.id,
                        holdTypeId: args.holdType,
                        comments: args.comment,
                        user: self.user
                    };
                    self.wmJobTask.createHold(params).then(function() {
                        console.log("Hold added successfully");
                        self.tabHolds.content.holdAddedSuccess();
                        self.updateHolds();
                    }, function(error) {
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
            topic.subscribe(appTopics.holds.releaseHold, function(sender, args) {
                var params = {
                    jobId: self.currentJob.id,
                    holdId: args.holdId,
                    comments: args.comment,
                    user: self.user
                };
                self.wmJobTask.releaseHold(params).then(function() {
                    console.log("Hold released successfully");
                    self.tabHolds.content.holdAddedSuccess();
                    self.updateHolds();
                }, function(error) {
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
            topic.subscribe(appTopics.grid.resetFilter, function(sender, args) {
                self.resetRow();
            });
            //filter current grid
            topic.subscribe(appTopics.grid.filter, function(sender, args) {
                self.filterRow(args.filterField1, args.filterField2);
            });
            
            // close job from grid
            topic.subscribe(appTopics.grid.closeJobs, function(sender, args) {
                var params = {
                    jobIds: args.jobs,
                    user: self.user
                };
                self.wmJobTask.closeJobs(params).then(function(data) {
                    console.log("Jobs closed successfully: ", args.jobs);
                    self.getJobsByQueryId(self.currentQueryId, true);
                }, function(error) {
                    var errMsg = i18n.error.errorClosingJob;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            });
            // reopen closed job from grid
            topic.subscribe(appTopics.grid.reopenClosedJobs, function(sender, args) {
                var params = {
                    jobIds: args.jobs,
                    user: self.user
                };
                self.wmJobTask.reopenClosedJobs(params).then(function(data) {
                    console.log("Jobs reopened successfully: ", args.jobs);
                    self.getJobsByQueryId(self.currentQueryId, true);
                }, function(error) {
                    var errMsg = i18n.error.errorReopeningClosedJobs;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            });
            // delete job from grid
            topic.subscribe(appTopics.grid.deleteJobs, function(sender, args) {
                var params = {
                    jobIds: args.jobs,
                    deleteHistory: true,
                    user: self.user
                };
                self.wmJobTask.deleteJobs(params).then(function(data) {
                    console.log("Jobs deleted successfully: ", args.jobs);
                    self.getJobsByQueryId(self.currentQueryId, true);
                    self.myMap.graphicsLayer.removeAll();
                    // TODO Fix this
                    //self.myMap.map.infoWindow.hide();
                }, function(error) {
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
                var params = {
                    jobId: self.selectedRowId,
                    notes: args.noteValue,
                    user: self.user
                };
                self.wmJobTask.updateNotes(params, function(success) {
                    self.updateNotes();
                }, function(error) {
                    var errMsg = i18n.error.errorUpdatingJobNotes;
                    console.log(errMsg, error);
                    self.errorHandler(errMsg, error);
                });
            });

            // Populate job type defaults
            topic.subscribe(appTopics.filter.jobTypeSelect, function(sender, args) {
                self.wmConfigurationTask.getJobTypeDetails(args.jobType).then(function(jobTypeDetails) {
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
            topic.subscribe(appTopics.properties.updateProperties, function(args) {
                self.showProgress();
                args.user = self.user;  // include user in argument list
                self.wmJobTask.updateJob(args).then(function() {
                    console.log("Properties updated successfully");
                    self.tabProperties.content.updateCallback(i18n.properties.updateSuccessful);
                    //retrieve updated job data
                    self.getJobById({
                        jobId : self.currentJob.id,
                        updateWorkflow : false,
                        zoomToFeature : false
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
            topic.subscribe(appTopics.attachment.uploadAttachment, function(sender, args) {
                var jobId = self.currentJob.id;
                if (args.url) {
                    var params = {
                        jobId: jobId,
                        attachmentType: "url",
                        path: args.url,
                        user: self.user
                    };
                    self.wmJobTask.addLinkedAttachment(params).then(function(attachmentId) {
                        self.updateAttachments(jobId);
                    }, function(error) {
                        console.log("Error adding url attachment " + jobId + ' ' + error);
                        //With IE9, esri request will throw an error even though the request was successful.
                        //Refresh the attachments tab.
                        self.updateAttachments(jobId);
                    });
                } else if (args.link) {
                    var params = {
                        jobId: jobId,
                        attachmentType: "linked-file",
                        path: args.link,
                        user: self.user
                    };
                    self.wmJobTask.addLinkedAttachment(params).then(function(attachmentId) {
                        self.updateAttachments(jobId);
                    }, function(error) {
                        console.log("Error adding linked file attachment " + jobId + ' ' + error);
                        //With IE9, esri request will throw an error even though the request was successful.
                        //Refresh the attachments tab.
                        self.updateAttachments(jobId);
                    });
                } else {
                    var params = {
                        jobId: jobId,
                        form: args.form,
                        user: self.user
                    };
                    self.wmJobTask.addEmbeddedAttachment(params).then(function(attachmentId) {
                        self.updateAttachments(jobId);
                    }, function(error) {
                        console.log("Error adding embedded attachment " + jobId + ' ' + error);
                        //With IE9, esri request will throw an error even though the request was successful.
                        //Refresh the attachments tab.
                        self.updateAttachments(jobId);
                    });
                }
                
            });

            //get content url and set the hyperlink
            topic.subscribe(appTopics.attachment.getContentURL, function(sender, args) {
                var params = {
                    jobId: self.currentJob.id,
                    attachmentId: args.attachmentId
                };
                var contentURL = self.wmJobTask.getAttachmentContentUrl(params);
                //sender.attachmentLink.href = contentURL;
                sender.setContentURL(contentURL);
            });

            //remove attachments
            topic.subscribe(appTopics.attachment.removeAttachment, function(sender, args) {
                    console.log("recieved remove click: " + args.attachmentId);
                    self.tabAttachments.content.removeAttachment(args);
                    var params = {
                        jobId: self.currentJob.id,
                        attachmentId: args.attachmentId,
                        user: self.user
                    };
                    self.wmJobTask.deleteAttachment(params).then(function(success) {
                        console.log("Attachment deleted successfully");
                }, function(error) {
                        console.log("Error deleting attachment with id: " + args.attachmentId + " " + error);
                    });
            });

            // topic for job status change during workflow execution
            topic.subscribe(appTopics.workflow.errorExecutingJobStatusChanged, lang.hitch(this, function(args) {
                // Only update the job status if it hasn't already been updated
                if (this.jobWarning.innerHTML == '') {
                    if (args.jobHold) {
                        this.jobWarning.innerHTML = i18n.header.onHold;
                    } else if (args.jobClosed) {
                        this.jobWarning.innerHTML = i18n.header.closed;
                    }
                }
            }));

            // Log action for job
            // requires:
            // activity type (if no activity type is specified, comment activity type is used)
            // value for the log
            topic.subscribe(appTopics.manager.logAction, function(sender, args) {
                self.showProgress();
                
                var activityType = self.commentActivityTypeId;
                if (args.activityType != null)
                    activityType = args.activityType;

                var params = {
                    jobId: self.currentJob.id,
                    activityTypeId: activityType,
                    comments: args.value,
                    user: self.user
                };
                self.wmJobTask.logAction(params).then(function(success) {
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
                    self.showProgress();
                }, 2000);
                var params = {
                    jobId: self.currentJob.id,
                    loi: null,
                    user: self.user
                };
                self.wmJobTask.updateJob(params).then(function(success) {
                    console.log("AOI successfully deleted");
                    self.hideProgress();
                    clearTimeout(progressTimer);

                    self.clearAoiDialog.aoiFunctionsDialog.hide();
                    if (self.drawTool) {
                        self.drawTool.btnClearLoi.set("disabled", true);
                    }
                    self.myMap.graphicsLayer.removeAll();
                    // TODO Fix this - no infoWindow support
                    //self.myMap.map.infoWindow.hide();
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
                if (self.drawTool) {
                   self.drawTool.drawButtonDeactivation(); 
                }
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
                if (self.drawTool) {
                    // cancel drawTool
                    self.drawTool.cancelDraw();
                    // disable drawTool
                    self.drawTool.drawButtonDeactivation();
                }
            });

            topic.subscribe(appTopics.map.layer.click, function(jobId) {
                //query for job data
                var progressTimer = setTimeout(function() {
                    self.showProgress();
                }, 2000);
                self.wmJobTask.getJob(jobId).then(function(data) {
                    self.hideProgress();
                    clearTimeout(progressTimer);
                    var loi = data.loi;
                    self.selectJobLOI(jobId, loi, false);
                    topic.publish(appTopics.map.layer.jobQuery, data);
                }, function(error) {
                    self.hideProgress();
                    clearTimeout(progressTimer);

                    console.log("error retrieving job info for popup id:", jobId, error);
                });

                self.navigating = true;
                self.grid.content.dataGrid.clearSelection();
                self.grid.content.dataGrid.select(jobId);
                if (self.grid.content.dataGrid.row(jobId).element) {
                    //an error trips up the app if it tries to scroll to an element not in dom
                    self.grid.content.dataGrid.row(jobId).element.scrollIntoView();
                }
                self.navigating = false;
            });

            topic.subscribe(appTopics.map.layer.multiClick, function(jobIds, loi) {
                //query for job data
                var progressTimer = setTimeout(function() {
                    self.showProgress();
                }, 2000);
                var params = {
                    fields: "JTX_JOBS.JOB_ID,JTX_JOBS.JOB_NAME,JTX_JOBS.CREATED_BY,JTX_JOBS.ASSIGNED_TO,JTX_JOBS.PRIORITY,JTX_JOBS.STATUS",
                    tables: "JTX_JOBS",
                    aliases: "ID,Name,Created_By,Assigned_To,Priority,Status",
                    where: "JTX_JOBS.JOB_ID IN (" + jobIds.join(",") + ")",
                    user: self.user
                };
                self.wmJobTask.queryJobsAdHoc(params).then(function(data) {
                    self.hideProgress();
                    clearTimeout(progressTimer);
                    self.selectJobLOI(jobIds[0], loi, false);
                    topic.publish(appTopics.map.layer.multiJobQuery, data);
                    }, function(error) {
                    self.hideProgress();
                    clearTimeout(progressTimer);

                    console.log("getJobsAdHoc (parameters " + parameters + ") failed: " + errMsg);
                    var errMsg = i18n.error.errorFindingJobsById.replace("{0}", jobIds.join());
                    self.errorHandler(errMsg, error);
                });

                self.navigating = true;
                self.grid.content.dataGrid.clearSelection();
                self.grid.content.dataGrid.select(jobIds[0]);
                if (self.grid.content.dataGrid.row(jobIds[0]).element) {
                    //an error trips up the app if it tries to scroll to an element not in dom
                    self.grid.content.dataGrid.row(jobIds[0]).element.scrollIntoView();
                }
                self.navigating = false;
            });

            topic.subscribe(appTopics.map.layer.select, function(jobId, loi) {
                topic.publish(appTopics.map.clearGraphics, null);
                self.selectJobLOI(jobId, loi, false);

                self.navigating = true;
                self.grid.content.dataGrid.clearSelection();
                self.grid.content.dataGrid.select(jobId);
                if (self.grid.content.dataGrid.row(jobId).element) {
                    //an error trips up the app if it tries to scroll to an element not in dom
                    self.grid.content.dataGrid.row(jobId).element.scrollIntoView();
            }
                self.navigating = false;
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
                
                var serverUrl = WMUtil.removeFromEnd(this.tokenServerUrl, "/tokens");
                var tokenUrl = this.tokenServerUrl;
                if (!WMUtil.endsWith(tokenUrl, "/")) {
                    tokenUrl += "/";
                }
                tokenUrl = tokenUrl + "generateToken";

                var serverInfo = new ServerInfo();
                serverInfo.server = serverUrl;
                serverInfo.tokenServiceUrl = tokenUrl;
                IdentityManager.registerServers([serverInfo]);
                
                var userInfo = new Object;
                userInfo.username = username;
                userInfo.password = password;

                // Request short lived tokens
                var timer = null;
                afterSignIn = lang.hitch(this, function(data) {
                    // valid user login into server
                    self.setToken(data.token, data.expires);

                    // validate user against workflow manager
                    self.validateUser(self.user);
                    
                    // clear previous timer
                    if (timer != null)
                        clearInterval(timer);
                    
                    // set new timer
                    // token validity is in minutes, set the timeout to be 1 minute before it expires
                    var timeout = (data.validity > 1) ? data.validity - 1 : data.validity;
                    timeout = timeout * 60 * 1000;  // convert to milliseconds
                    timer = setInterval(signIn, timeout);
                });
                
                errorSignIn = lang.hitch(this, function(error) {
                    // handle an error condition
                    console.log("Unable to generate a security token.", error);
                    if (self.loading) {
                    self.loginPage.invalidUser();
                    } else {
                        IdentityManager.signIn(self.wmServerUrl, serverInfo).then(afterSignIn, errorSignIn);
                    }
                });    

                signIn = lang.hitch(this, function() {
                    IdentityManager.generateToken(serverInfo, userInfo).then(afterSignIn, errorSignIn);
                });
                signIn();
                
            } else {
                self.validateUser(username);
            }
        },

        setToken : function(token, expiration) {
            this.token = token;
            this.tokenExpiration = expiration;
            var requestOptions = {
                query: {
                    token: token
                }
            };
            this.wmAOILayerTask.requestOptions = requestOptions;
            if (this.wmPOILayerTask)
                this.wmPOILayerTask.requestOptions = requestOptions;
            this.wmConfigurationTask.requestOptions = requestOptions;
            this.wmJobTask.requestOptions = requestOptions;
            this.wmReportTask.requestOptions = requestOptions;
            this.wmTokenTask.requestOptions = requestOptions;
            this.wmWorkflowTask.requestOptions = requestOptions;
        },

        validateUser : function(username, password) {
            var self = lang.hitch(this);
            self.user = username;

            // validate user
            self.wmConfigurationTask.getUser(username).then(function(data) {
                //console.log("User details:", data);
                if (!data || !data.userName || data.userName == "") {

                    if (self.isWindowsUser) {
                        // show error
                        self.errorHandler(i18n.error.errorInvalidUsername.replace("{0}", username));
                    } else {
                        // show error on login screen
                        self.loginPage.invalidUser();
						self.logoutUser();
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
                    //Load Visible Job Types and then initialize UI framework afterward
                    self.initVisibleJobTypes(data.userName);
                }

            }, function(error) {
                var errMsg = i18n.error.errorRetrievingUser.replace("{0}", self.user);
                console.log(errMsg, error);
                if (self.isWindowsUser) {
                    self.errorHandler(errMsg, error);
                } else {
                    self.loginPage.invalidUser();
					self.logoutUser();
                }
            });
        },

        clearLoadingScreen : function() {
            var el = dom.byId("loading-outer");
            if (el)
                domStyle.set(el, "display", "none");

            if (this.grid) {
            this.grid.resize();
            //this.grid.content.resize();
            this.grid.content.dataGrid.resize();
            }

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