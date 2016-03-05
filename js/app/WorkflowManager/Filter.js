define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./templates/Filter.html",
    "dojo/i18n!./nls/Strings",
    "app/WorkflowManager/config/Topics",
    "app/WorkflowManager/config/AppConfig",
    
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/connect",
    "dojo/parser",
    "dojo/query",
    "dojo/on",
    "dojo/dom-style",
    "dojo/topic",
    "dijit/registry",
    
    "dojo/store/Memory",
    "dijit/tree/ObjectStoreModel",

    "workflowmanager/supportclasses/JobCreationParameters",
    "workflowmanager/Enum",
    
    "dijit/form/Button",
    "dijit/form/ComboBox",
    "dijit/form/DateTextBox",
    "dijit/form/DropDownButton",
    "dijit/TooltipDialog",
    "dijit/form/FilteringSelect",
    "dijit/form/NumberSpinner",
    "dijit/form/Textarea",
    "dijit/form/TextBox",
    "dijit/Tree"
    ],

function (
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, 
    template, i18n, appTopics, config,
    arrayUtil, lang, connect, parser, query, on, domStyle, topic, registry,
    Memory, ObjectStoreModel,
    JobCreationParameters, Enum,
    Button, ComboBox, DateTextBox, DropDownButton, TooltipDialog, FilteringSelect, NumberSpinner, Textarea, TextBox, Tree) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        
        templateString: template,
        widgetsInTemplate: true,
        
        // i18n
        i18n_Queries: i18n.filter.queries,
        i18n_OrFindJob: i18n.filter.orFindJob,
        i18n_Reports: i18n.filter.reports,
        i18n_CreateNewJob: i18n.filter.createNewJob,
        i18n_CreateJob: i18n.filter.createJob,
        i18n_Cancel: i18n.common.cancel,

        i18n_JobId: i18n.properties.jobId,
        i18n_JobName: i18n.properties.jobName,
        i18n_JobType: i18n.properties.jobType,
        i18n_JobStatus: i18n.properties.jobStatus,
        i18n_JobPercentComplete: i18n.properties.jobPercentComplete,
        i18n_JobAOI: i18n.properties.jobAOI,
        i18n_JobDataWorkspace: i18n.properties.jobDataWorkspace,
        i18n_JobVersion: i18n.properties.jobVersion,
        i18n_JobParentVersion: i18n.properties.jobParentVersion,
        i18n_JobAssignment: i18n.properties.jobAssignment,
        i18n_JobOwner: i18n.properties.jobOwner,
        i18n_JobPriority: i18n.properties.jobPriority,
        i18n_JobStartDate: i18n.properties.jobStartDate,
        i18n_JobDueDate: i18n.properties.jobDueDate,
        i18n_JobDescription: i18n.properties.jobDescription,
        i18n_JobNotes: i18n.properties.jobNotes,
        i18n_NotApplicable: i18n.properties.notApplicable,
        i18n_JobAssignmentUser: i18n.properties.jobAssignmentUser,
        i18n_JobAssignmentGroup: i18n.properties.jobAssignmentGroup,
        i18n_JobAssignmentUnassigned: i18n.properties.jobAssignmentUnassigned,
        i18n_NumberOfJobs: i18n.properties.numberOfJobs,

        i18n_QueryTypePublic: i18n.filter.queryTypePublic,
        i18n_QueryTypeUser: i18n.filter.queryTypeUser,

        userQueries: null,
        publicQueries: null,
        
        users: null,      // all users in the system
        groups: null,     // all groups in the system

        currentUser: null,
        currentUserDetails: null,
        currentUserPrivileges: null,
        currentJobTypeDetails: null,
        currentAssignedType: Enum.JobAssignmentType.NONE,
        
        constructor: function () {
            parser.parse();
        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.initUI();
            this.toggleAssignment();
            
            //this.dropdownDependencies;
            console.log("Filter started");
        },
        
        initUI: function() {
            var self = lang.hitch(this);
            this.queryName = i18n.filter.initialQueryTitle;
            this.reportName = i18n.filter.initialReportTitle;
            this.jobTypeName = i18n.filter.initialJobTypeTitle;

            //Tree store
            this.myStore = new Memory({
                data: [
                    { id: 'allQueries', name: 'All Queries', directory: true }
                ],
                getChildren: function (object) {
                    return this.query({ parent: object.id });
                }
            });

            this.reportStore = new Memory({
                data: [
                    { id: 'allReports', name: 'All Reports', directory: true }
                ],
                getChildren: function (object) {
                    return this.query({ parent: object.id });
                }
            });
            
            this.jobTypesStore = new Memory({
                data: [
                    { id: 'allJobTypes', name: 'All Job Types', directory: true }
                ],
                getChildren: function (object) {
                    return this.query({ parent: object.id });
                }
            });

            // Create the model
            this.myModel = new ObjectStoreModel({
                store: this.myStore,
                query: { id: 'allQueries' }
            });
            
            this.reportModel = new ObjectStoreModel({
                store: this.reportStore,
                query: { id: 'allReports' }
            });
            
            this.jobTypesModel = new ObjectStoreModel({
                store: this.jobTypesStore,
                query: { id: 'allJobTypes' }
            });

            this.tree = new Tree({
                model: self.myModel,
                style: "padding: 10px;",
                openOnClick: true,
                autoExpand: true, //all nodes expanded
                showRoot: false,
                getIconClass: function (item, opened) {
                    return item.directory ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "dijitLeaf";
                },
                onClick: function (item) {
                    if (item.directory == false) {
                        self.queryTreeButton.set("label", item.name);
                        self.queryTreeButton.set("title", item.name);
                        topic.publish(appTopics.filter.jobQueriesChanged, this, { selectedId: item.id, selectedQuery: item.name});
                        //hide drop down
                        self.queryTreeButton.closeDropDown();
                    }
                }
            });
            
            this.reportTree = new Tree({
                model: self.reportModel,
                style: "padding: 10px;",
                openOnClick: true,
                autoExpand: true, //all nodes expanded
                showRoot: false,
                getIconClass: function (item, opened) {
                    return item.directory ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "dijitLeaf";
                },
                onClick: function (item) {
                    if (item.directory == false) {
                        
                        topic.publish(appTopics.filter.generateReport, this, { reportID: item.id, title: item.name });
                        //hide drop down
                        self.reportTreeButton.closeDropDown();
                    }
                }
            });
            
            this.jobTypesTree = new Tree({
                model: self.jobTypesModel,
                style: "padding: 10px;",
                openOnClick: true,
                autoExpand: true, //all nodes expanded
                showRoot: false,
                getIconClass: function (item, opened) {
                    return item.directory ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "dijitLeaf";
                },
                onClick: function (item) {
                    if (item.directory == false) {
                        self.resetJobType(item.name, item.id);
                        
                        //hide drop down
                        self.jobTypesTreeButton.closeDropDown();
                    }
                }
            });

            this.queryTreePanel = new TooltipDialog({                
                content: self.tree,
                className: "tree-tooltipDialog"
            });

            this.reportTreePanel = new TooltipDialog({
                content: self.reportTree,
                className: "tree-tooltipDialog"
            });

            this.jobTypesPanel = new TooltipDialog({
                content: self.jobTypesTree,
                className: "tree-tooltipDialog"
            });
            
            this.queryTreeButton = new DropDownButton({
                label: self.queryName,
                title: self.queryName,
                className: "tree-dropDownButton",
                dropDown: self.queryTreePanel
            }).placeAt(this.queryTreeBtn);
            this.queryTreeButton.startup();

            this.reportTreeButton = new DropDownButton({
                label: self.reportName,
                title: self.reportName,
                className: "tree-dropDownButton",
                dropDown: self.reportTreePanel
            }).placeAt(this.reportTreeBtn);
            this.reportTreeButton.startup();
            
            this.jobTypesTreeButton = new DropDownButton({
                label: self.jobTypeName,
                title: self.jobTypeName,
                className: "tree-dropDownButton",
                dropDown: self.jobTypesPanel,
                disabled: true,
            }).placeAt(this.jobTypesBtn);
            this.jobTypesTreeButton.startup();
            
            //displayed none for testing query dropdown box with tree
            //should be deleted when tree is fully implemented
            this.jobQueries = new ComboBox({
                name: "jobQueries",
                style: "width:330px;",
                //searchAttr: "name",
                required: false,
                labelAttr: "name",
                onChange: function () {
                }
            }, this.cboJobQueries);
            this.jobQueries.startup();
            
            this.jobSearchInput = new TextBox({
                name: "txtJobSearch",
                value: "" /* no or empty value! */,
                placeHolder: i18n.filter.findJob,
                style: "width: 150px;",
                onChange: function () {
                //    self.clearSearchAct();
                }
            }, this.txtJobSearch);
            
            this.searchBtn = new Button({
                "class": "search-button dojo-btn-info",
                label: "<span class='icon-search'></span>",
                onClick: lang.hitch(this, function () {
                    this.jobSearchClicked();
                })
            }, this.btnJobSearch);

            // show create job dialog button
            this.createNewJobButton = new Button({
                style: "float: right;",
                label: i18n.filter.createNewJob,
                disabled: true,
                "class": "dojo-btn-success",
                onClick: lang.hitch(this, function() {
                    this.resetCreateNewJobForm();
                    this.initializeCreateJob();
                    this.createJobDialog.show();
                })
            }, this.btnCreateNewJob);
            
            // start date
            this.jobStartDateControl = new DateTextBox({
                id: "createJobStartDateControl",
                name: "createJobStartDateControl",
                style: "width:250px;",
                onChange: lang.hitch(this, function() {
                    var newStartDate = this.jobStartDateControl.get("value");
                    if (newStartDate > this.jobDueDateControl.get("value")) {
                        this.jobDueDateControl.set("value", newStartDate);
                    }
                    this.jobDueDateControl.constraints.min = newStartDate;
                })
            }, this.createJobStartDateControl);
            this.jobStartDateControl.startup();
            
            // due date
            this.jobDueDateControl = new DateTextBox({
                id: "createJobDueDateControl",
                name: "createJobDueDateControl",
                style: "width:250px;"
            }, this.createJobDueDateControl);
            this.jobDueDateControl.startup();
            
            // data workspaces
            this.jobDataWorkspacesSelect = new FilteringSelect({
                id: "createJobDataWorkspacesSelect",
                name: "createJobDataWorkspacesSelect",
                style: "width:250px;",
                required: false,
                disabled: true,
                onChange: function () {
                    //self.dropdownDependencies();
                }
            }, this.cboJobDataWorkspaces);
            this.jobDataWorkspacesSelect.startup();
            
            // parent version
            this.jobParentVersionSelect = new FilteringSelect({
                id: "createJobParentVersionSelect",
                name: "createJobParentVersionSelect",
                queryOptions: {ignoreCase: true},
                disabled: true,
                style: "width:250px;"
            }, this.cboJobParentVersion);
            this.jobParentVersionSelect.startup();

            // users
            this.assignmentUsersSelect = new FilteringSelect({
                id: "createAssignmentUsersSelect",
                name: "createAssignmentUsersSelect",
                style: "width:250px;",
                searchAttr: "fullName"
            }, this.cboAssignmentUsers);
            this.assignmentUsersSelect.startup();
            
            // groups
            this.assignmentGroupsSelect = new FilteringSelect({
                id: "createAssignmentGroupsSelect",
                name: "createAssignmentGroupsSelect",
                style: "width:250px;"
            }, this.cboAssignmentGroups);
            this.assignmentGroupsSelect.startup();

            // job priorities
            this.jobPrioritiesSelect = new FilteringSelect({
                id: "createJobPrioritiesSelect",
                name: "createJobPrioritiesSelect",
                style: "width:250px;"
            }, this.cboJobPriorities);
            this.jobPrioritiesSelect.startup();

            // job description
            this.jobDescriptionTextarea = new Textarea({
                id: "createJobDescriptionTextarea",
                name: "createJobDescriptionTextarea",
                style: "width: 400px; min-height: 100px; max-height:100px;"
            }, this.propertiesFormDescription);
            this.jobDescriptionTextarea.startup();

            on(this.jobSearchForm, "submit", lang.hitch(this, function (e) {
                e.preventDefault();
                e.stopPropagation();

                console.log("FORM SUBMITTED");
                self.jobSearchClicked();
            }));
        },
        
        initialize: function (args) {
            this.setUserProperties(args);
            this.users = args.users;
            this.groups = args.groups;
            
            //Job types
            var activeJobTypes = dojo.filter(args.jobTypes, function(item){
                return item.state == Enum.JobTypeState.ACTIVE;
            });
            if (activeJobTypes.length > 0) {
                this.setJobTypesStore(activeJobTypes);
                this.jobTypesTreeButton.set("disabled", false);
                this.btnCreateJob.set("disabled", false);
            }
            //Data workspaces 
            this.jobDataWorkspacesSelect.set("store", new Memory({ data: args.dataWorkspaces, idProperty: "id" }));
            this.jobDataWorkspacesSelect.set("value", "0");  // by default select "No Data Workspace" option
            //Priorities
            this.jobPrioritiesSelect.set("store", new Memory({ data: args.jobPriorities, idProperty: "value" }));
            if (args.jobPriorities && args.jobPriorities.length > 0) {
                this.jobPrioritiesSelect.set("value", args.jobPriorities[0].value);  // by default select first item
            }            
        },

        setUserProperties: function (args) {
            this.currentUser = args.user;
            this.currentUserDetails = args.userDetails;
            this.currentUserPrivileges = args.userPrivileges;
            
            if (this.currentUserPrivileges.canCreateJob)
                this.createNewJobButton.set("disabled", false);
            else
                this.createNewJobButton.set("disabled", true);
        },

        resetCreateNewJobForm: function () {
            var self = lang.hitch(this);
            //reset to first job type
            var store = this.jobTypesTree.model.store;
            if (store && store.data && store.data.length > 0) {
                arrayUtil.some(store.data, function(item) {
                    if (item.directory == false) {
                        self.resetJobType(item.name, item.id);
                        return true;   // found entry, break from the loop
                    }
                });
            }
        },
        
        resetJobType: function (jobTypeName, jobTypeId) {
            this.jobTypesTreeButton.set("label", jobTypeName);
            this.jobTypesTreeButton.set("title", jobTypeName);
            this.jobTypeChanged(jobTypeId);
        },
        
        setQueries: function (publicQueries, userQueries) {
            var sortedPublicQueries = this.formatQueryData(publicQueries);
            if (sortedPublicQueries.length > 0) {
                this.publicQueries = sortedPublicQueries;
                this.queryTypePublic.set("disabled", false);
            }
            var sortedUserQueries = this.formatQueryData(userQueries);
            if (sortedUserQueries.length > 0) {
                this.userQueries = sortedUserQueries;
                this.queryTypeUser.set("disabled", false);
            }

            this.setQueryStore(publicQueries, userQueries);
        },

        formatQueryData : function(queryData) {
            var queries = [];
            if (queryData) {
                var self = lang.hitch(this);
                self.addQueriesFromContainer(queryData, queries);
            }
            return queries;
        },

        addQueriesFromContainer : function(container, queries) {
            if (container) {
                var self = lang.hitch(this);
                //add each query
                var childQueries = container.queries;
                if (childQueries) {
                    childQueries.sort(function(query1, query2) {
                        return query1.name.localeCompare(query2.name);
                    });           
                    arrayUtil.forEach(childQueries, function(query) {
                        queries.push({
                            "name" : query.name,
                            "id" : query.id
                        });
                    });
                }
                //add queries from each container
                var childContainers = container.containers;
                if (childContainers) {
                    childContainers.sort(function(container1, container2) {
                        return container1.name.localeCompare(container2.name);
                    });           
                    arrayUtil.forEach(childContainers, function(item) {
                        self.addQueriesFromContainer(item, queries);
                    });
                }
            }
        },

        setQueryStore: function (publicQueries, userQueries) {
            console.log(publicQueries, userQueries);
            var self = lang.hitch(this);
            var levelCount = 0;
            //var to capture the first query in stack
            var isFirst = true;
            
            //parse to array
            if (publicQueries) {
                parseLevel(publicQueries, "allQueries");
            }
            if (userQueries) {
                parseLevel(userQueries, "allQueries");
            }

            function parseLevel(currentLevel, parentId) {
                var levelObject = {};
                levelObject.id = levelCount + "_" + currentLevel.id;
                levelObject.name = currentLevel.name;
                levelObject.directory = true;
                if (parentId) {
                    levelObject.parent = parentId;
                }

                self.myStore.put(levelObject);
                levelCount++;
                if (currentLevel.queries && currentLevel.queries.length > 0) {
                    arrayUtil.forEach(currentLevel.queries, function (value, index) {
                        parseQueries(value, levelObject.id);
                    });
                }
                if (currentLevel.containers && currentLevel.containers.length > 0) {
                    arrayUtil.forEach(currentLevel.containers, function(value, index) {
                        parseContainers(value, levelObject.id);
                    });
                }
            }
            
            function parseQueries(currentLevel, parentId) {
                var levelObject = {};
                levelObject.id = currentLevel.id;
                levelObject.name = currentLevel.name;
                levelObject.directory = false;
                levelObject.parent = parentId;
                
                self.myStore.put(levelObject);

                if (isFirst) {
                    isFirst = false;
                    self.initialQueryId = levelObject.id;
                    self.initialQueryName = levelObject.name;
                }
            }

            function parseContainers(currentLevel, parentId) {
                var levelObject = {};
                levelObject.id = levelCount + "_" + currentLevel.id;
                levelObject.name = currentLevel.name;
                levelObject.directory = true;
                levelObject.parent = parentId;
                
                self.myStore.put(levelObject);

                if (currentLevel.queries.length > 0) {
                    arrayUtil.forEach(currentLevel.queries, function (value, index) {
                        parseQueries(value, levelObject.id);
                    });
                }

                if (currentLevel.containers.length > 0) {
                    arrayUtil.forEach(currentLevel.containers, function (value, index) {
                        parseLevel(value, levelObject.id);
                    });
                }
            }

            //refresh tree rendering
            // Completely delete every node from the dijit.Tree     
            this.tree._itemNodesMap = {};
            this.tree.rootNode.state = "UNCHECKED";
            this.tree.model.root.children = null;

            // Destroy the widget
            this.tree.rootNode.destroyRecursive();

            // Recreate the model, (with the model again)
            this.tree.model.constructor(this.tree.model);

            // Rebuild the tree
            this.tree.postMixInProperties();
            this.tree._load();


            if (config.app.DefaultQuery) {
                var defaultQuery = config.app.DefaultQuery.split("\\");
                var queryCon = null;
                if (defaultQuery[0].toLowerCase() == publicQueries.name.toLowerCase()) {
                    queryCon = publicQueries;
                } else if (defaultQuery[0].toLowerCase() == userQueries.name.toLowerCase()) {
                    queryCon = userQueries;
                }
                var i = 1;
                var bConFound = true;
                for (i = 1; i < defaultQuery.length - 1 && bConFound; i++) {
                    bConFound = false;
                    queryCon = queryCon.containers;
                    var targetCon = defaultQuery[i].toLowerCase();
                    for (var j = 0; j < queryCon.length; j++)
                        if (queryCon[j].name.toLowerCase() == targetCon) {
                            queryCon = queryCon[j];
                            bConFound = true;
                            break;
                        }
                }
                if (bConFound) {
                    queryCon = queryCon.queries;
                    for (var j = 0; j < queryCon.length; j++)
                        if (queryCon[j].name.toLowerCase() == defaultQuery[i].toLowerCase()) {
                            self.initialQueryId = queryCon[j].id;
                            self.initialQueryName = queryCon[j].name;
                            break;
                        }
                }
            }

            //set query title
            this.queryTreeButton.set("label", (self.initialQueryName != undefined ? self.initialQueryName : self.queryName));
            this.queryTreeButton.set("title", (self.initialQueryName != undefined ? self.initialQueryName : self.queryName));

            //publish query
            topic.publish(appTopics.filter.jobQueriesChanged, this, { selectedId: self.initialQueryId, selectedQuery: self.initialQueryName });
        },
        
        setQueryNameFromId: function(queryId) {
            var self = lang.hitch(this);
            var queryName;
            arrayUtil.some(this.publicQueries, function(query) {
                if (query.id == queryId) {
                    queryName = query.name;
                    return true;   // found entry, break from the loop
                }
            });
            if (!queryName) 
            {
                arrayUtil.some(this.userQueries, function (query) {
                    if (query.id == queryId) {
                        queryName = query.name;
                        return true;   // found entry, break from the loop
                    }
                });
            }
            if (queryName) {
                this.queryTreeButton.set("label", queryName);
                this.queryTreeButton.set("title", queryName);
            }
            return queryName;
        },
        
        setReportStore: function (reports) {
            var self = lang.hitch(this);
            var parents = [];
           
            arrayUtil.forEach(reports, function (data, index) {
                handleParent(data.hierarchy);
                var obj = {};
                obj.id = data.id;
                obj.name = data.name;
                obj.directory = false;
                obj.parent = data.hierarchy;
                self.reportStore.put(obj);
            });
            
            function handleParent(parent) {
                if (parents.indexOf(parent) >= 0)
                    return;
                parents.push(parent);
                var obj = {};
                obj.id = parent;
                obj.name = parent;
                obj.directory = true;
                obj.parent = 'allReports';
                self.reportStore.put(obj);
            }

            //refresh tree rendering
            // Completely delete every node from the dijit.Tree     
            this.reportTree._itemNodesMap = {};
            this.reportTree.rootNode.state = "UNCHECKED";
            this.reportTree.model.root.children = null;

            // Destroy the widget
            this.reportTree.rootNode.destroyRecursive();

            // Recreate the model, (with the model again)
            this.reportTree.model.constructor(this.reportTree.model);

            // Rebuild the tree
            this.reportTree.postMixInProperties();
            this.reportTree._load();
        },
        
        setJobTypesStore: function (jobTypes) {
            var self = lang.hitch(this);
            var parents = [];
            var uncategorized = i18n.filter.uncategorized;
            //var to capture the first job type in stack
            var isFirst = true;
            
            var sortedJobTypes = jobTypes.sort(function(jobType1, jobType2) {
                if (jobType1.category == "")
                    jobType1.category = uncategorized;
                if (jobType2.category == "")
                    jobType2.category = uncategorized;
                
                if (jobType1.category.localeCompare(jobType2.category) == 0)
                    return jobType1.name.localeCompare(jobType2.name);
                else
                    return jobType1.category.localeCompare(jobType2.category);
            });           
           
            arrayUtil.forEach(sortedJobTypes, function (data, index) {
                if (data.category == "")
                    data.category = uncategorized;
                
                handleParent(data.category);
                var obj = {};
                obj.id = data.id;
                obj.name = data.name;
                obj.directory = false;
                obj.parent = data.category;
                self.jobTypesStore.put(obj);
                
                if (isFirst) {
                    isFirst = false;
                    self.initialJobTypeId = obj.id;
                    self.initialJobTypeName = obj.name;
                }
            });
            
            function handleParent(parent) {
                if (parents.indexOf(parent) >= 0)
                    return;
                parents.push(parent);
                var obj = {};
                obj.id = parent;
                obj.name = parent;
                obj.directory = true;
                obj.parent = 'allJobTypes';
                self.jobTypesStore.put(obj);
            }

            //refresh tree rendering
            // Completely delete every node from the dijit.Tree     
            this.jobTypesTree._itemNodesMap = {};
            this.jobTypesTree.rootNode.state = "UNCHECKED";
            this.jobTypesTree.model.root.children = null;

            // Destroy the widget
            this.jobTypesTree.rootNode.destroyRecursive();

            // Recreate the model, (with the model again)
            this.jobTypesTree.model.constructor(this.jobTypesTree.model);

            // Rebuild the tree
            this.jobTypesTree.postMixInProperties();
            this.jobTypesTree._load();
            
            // Set job type title
            var jobTypeName = self.initialJobTypeName != undefined ? self.initialJobTypeName : self.jobTypeName;
            if (this.initialJobTypeId) {
                this.resetJobType(jobTypeName, this.initialJobTypeId);                
            }
            else {
                // No intial job type, so just update the label
                this.jobTypesTreeButton.set("label", jobTypeName);
                this.jobTypesTreeButton.set("title", jobTypeName);
            }
        },
        
        jobSearchClicked: function() {
            var inputValue = this.jobSearchInput.get("value");
            console.log("Filter::jobSearchClicked: " + inputValue);
            topic.publish(appTopics.filter.jobSearch, this, { value: inputValue });
        },
        
        initializeCreateJob: function() {
            //Job assignable
            this.jobAssignable = this.currentUserPrivileges.canAssignAnyJob
                    || this.currentUserPrivileges.canGroupJobAssign
                    || this.currentUserPrivileges.canIndividualJobAssign;
            if (this.jobAssignable) {
                // radio buttons
                this.assignmentTypeUser.set("disabled", false);
                this.assignmentTypeGroup.set("disabled", false);
                this.assignmentTypeUnassigned.set("disabled", false);
                // drop downs
                this.assignmentUsersSelect.set("disabled", false);
                this.assignmentGroupsSelect.set("disabled", false);
            } else {
                // radio buttons
                this.assignmentTypeUser.set("disabled", true);
                this.assignmentTypeGroup.set("disabled", true);
                this.assignmentTypeUnassigned.set("disabled", true);
                // drop downs
                this.assignmentUsersSelect.set("disabled", true);
                this.assignmentGroupsSelect.set("disabled", true);
            }
            
            // populate drop down of assignable users
            this.populateAssignableUsers();
            // populate drop down of assignable groups
            this.populateAssignableGroups();
        },
        
        createNewJob: function() {
            console.log("Create new job clicked");
            var self = lang.hitch(this);
            var para = new JobCreationParameters();

            //Properties that don't have editable fields
            para.id = null,
            para.name = null,
            para.aoi = null;
            para.autoCommitWorkflow = null;
            para.autoExecute = null;

            //Job type
            para.jobTypeId = this.jobTypesTree.selectedItem != null ? this.jobTypesTree.selectedItem.id : this.initialJobTypeId;

            //Start date
            var startDate = self.jobStartDateControl.get("value");
            if (startDate != "") {
                var startDateFix = Date.parse(startDate) + 43200000;
                para.startDate = new Date(startDateFix);
            } else {
                para.clearStartDate = true;
            }

            //Due date
            var dueDate = self.jobDueDateControl.get("value");
            if (dueDate != "") {
                var dueDateFix = Date.parse(dueDate) + 43200000;
                para.dueDate = new Date(dueDateFix);
            } else {
                para.clearDueDate = true;
            }

            //Priority
            para.priority = self.jobPrioritiesSelect.get("value");

            //Data workspace
            var dataWorkspace = self.jobDataWorkspacesSelect.get("value");
            if (dataWorkspace != "0" && dataWorkspace != "") {
                para.dataWorkspaceId = dataWorkspace;
            }

            //Parent Version
            var parentVersion = self.jobParentVersionSelect.get("value");
            if (parentVersion != i18n.properties.noVersion && parentVersion != ""){
                para.parentVersion = parentVersion;
            }
            
            //Description
            para.description = self.jobDescriptionTextarea.get("value");

            //Owner
            para.ownedBy = this.currentUser;
            
            //Assigned type / assigned to
            if (this.assignmentTypeUser.checked == true) {
                para.assignedType = Enum.JobAssignmentType.ASSIGNED_TO_USER;
                para.assignedTo = self.assignmentUsersSelect.get("value");
            } else if (this.assignmentTypeGroup.checked == true) {
                para.assignedType = Enum.JobAssignmentType.ASSIGNED_TO_GROUP;
                para.assignedTo = self.assignmentGroupsSelect.get("value");
            } else if (this.assignmentTypeUnassigned.checked == true) {
                para.assignedType = Enum.JobAssignmentType.UNASSIGNED;
                para.assignedTo = "";
            } else {
                // unknown option
                topic.publish(appTopics.error.popup, i18n.properties.invalidAssignmentType);
                return;
            }

            //Number of jobs
            para.numJobs = self.propertiesFormNumbersOfJobs.get("value");

            topic.publish(appTopics.filter.newJob, this, para);
        },

        clearSearchAct: function () {
            if ((this.jobSearchInput.value != "") || (this.jobQueries.value != "All Jobs")) {
                domStyle.set(this.clearSearch.domNode, "display", "initial");
            } else {
                domStyle.set(this.clearSearch.domNode, "display", "none");
            };
        },

        toggleAssignment: function () {
            var checkedButtons = dojo.query('[name=assignmentType]').filter(function (radio) {
                return radio.checked;
            });
            if (checkedButtons[0].value == "user") {
                this.assignmentTypeWrapper.style.visibility = "visible";
                this.assignmentTypeUserWrapper.style.display = "inline";
                this.assignmentTypeGroupWrapper.style.display = "none";
                this.currentAssignedType = Enum.JobAssignmentType.ASSIGNED_TO_USER;
            } else if (checkedButtons[0].value == "group") {
                this.assignmentTypeWrapper.style.visibility = "visible";
                this.assignmentTypeUserWrapper.style.display = "none";
                this.assignmentTypeGroupWrapper.style.display = "inline";
                this.currentAssignedType = Enum.JobAssignmentType.ASSIGNED_TO_GROUP;
            } else {
                this.assignmentTypeWrapper.style.visibility = "hidden";
                this.currentAssignedType = Enum.JobAssignmentType.UNASSIGNED;
            }
        },

        toggleQueryType: function () {
            var self = lang.hitch(this);
            var checkedButtons = dojo.query('[name=queryType]').filter(function (radio) {
                return radio.checked;
            });

            if (checkedButtons[0].value == "publicQuery") {
                //set store to public
                var publicQueries = self.publicQueries;
                this.jobQueries.set("store", new Memory({ data: publicQueries }));
                if (publicQueries.length > 0)
                    this.jobQueries.set("value", publicQueries[0].name);
            } else {
                //set store to user
                var userQueries = self.userQueries;
                this.jobQueries.set("store", new Memory({ data: userQueries }));
                if (userQueries.length > 0)
                    this.jobQueries.set("value", userQueries[0].name);
            }
        },

        // Calls function in controller to pre populate dropdowns based on the type of job
        jobTypeChanged: function (jobTypeId) {
            topic.publish(appTopics.filter.jobTypeSelect, this, { jobType: parseInt(jobTypeId) });
        },
        
        populateAssignableUsers: function() {
            var assignableUsers = [];
            if (this.users && this.users.length > 0) {
                assignableUsers = dojo.filter(this.users, lang.hitch(this, function(item, index) {
                    if (this.currentUserPrivileges.canAssignAnyJob) {
                        return true;
                    }
                    if (this.currentJobTypeDetails) {
                        if (this.currentJobTypeDetails.defaultAssignedType == Enum.JobAssignmentType.ASSIGNED_TO_USER
                        && this.currentJobTypeDetails.defaultAssignedTo == item.userName) {
                            return true;
                        }
                    }
                    if (this.currentUserPrivileges.canGroupJobAssign) {
                        if (this.isUserInMyGroups(item.userName)) {
                            return true;
                        }
                    }
                    if (this.currentUserPrivileges.canIndividualJobAssign)
                    {
                        if (item.userName == this.currentUser) {
                            return true;
                        }
                    }
                    return false;
                }));
            }           
            this.assignmentUsersSelect.set("store", new Memory({ data: assignableUsers, idProperty: "userName" }));            
            if (assignableUsers && assignableUsers.length > 0) {
                this.assignmentUsersSelect.set("value", assignableUsers[0].userName);  // by default select first item
            }
        },
        
        //Determines if the specified username belongs to any group of the current user.
        isUserInMyGroups: function(usernameToFind) {
            var currentUserGroups = this.currentUserDetails.groups;
            if (currentUserGroups == null || currentUserGroups.length < 1)
                return false;
            
            for (var i = 0; i < currentUserGroups.length; i++) {
                var usersInGroup = currentUserGroups[i].users;
                for (var j = 0; j < usersInGroup.length; j++) {
                    var userInGroup = usersInGroup[j];
                    if (usernameToFind == userInGroup) {
                        return true;
                    }
                }
            }
            return false;
        },
        
        populateAssignableGroups: function() {
            var assignableGroups = [];
            if (this.groups && this.groups.length > 0) {
                assignableGroups = dojo.filter(this.groups, lang.hitch(this, function(item, index) {
                    if (this.currentUserPrivileges.canAssignAnyJob) {
                        return true;
                    }
                    if (this.currentJobTypeDetails) {
                        if (this.currentJobTypeDetails.defaultAssignedType == Enum.JobAssignmentType.ASSIGNED_TO_GROUP
                            && this.currentJobTypeDetails.defaultAssignedTo == item.name) {
                            return true;
                        }
                    }
                    var currentUserGroups = this.currentUserDetails.groups;
                    for (var i = 0; i < currentUserGroups.length; i++) {
                        var group = currentUserGroups[i];
                        if (item.id == group.id)
                        {
                            return true;
                        }
                    }
                    return false;
                }));
            }
            this.assignmentGroupsSelect.set("store", new Memory({ data: assignableGroups, idProperty: "name" }));
            this.assignmentGroupsSelect.set("placeHolder", "");
            if (assignableGroups && assignableGroups.length > 0) {
                this.assignmentGroupsSelect.set("value", assignableGroups[0].name);  // by default select first item
            }
        },
        
        populateJobTypeDefaults: function (sender, args) {
            this.currentJobTypeDetails = args.jobTypeDetails;
            var jobTypeDetails = args.jobTypeDetails;
            
            //Job assignment
            var assignedTo = jobTypeDetails.defaultAssignedTo;
            switch (jobTypeDetails.defaultAssignedType) {
                case Enum.JobAssignmentType.ASSIGNED_TO_USER:
                    this.assignmentTypeUser.set("checked", true);
                    if (assignedTo && assignedTo != ""){
                        if (assignedTo == "[SYS:CUR_LOGIN]") {
                            assignedTo = this.currentUser;
                        }
                        this.assignmentUsersSelect.set("value", assignedTo);
                    }
                    break;
                case Enum.JobAssignmentType.ASSIGNED_TO_GROUP:
                    this.assignmentTypeGroup.set("checked", true);
                    if (assignedTo && assignedTo != "") {
                        this.assignmentGroupsSelect.set("value", assignedTo);
                    }
                    break;
                default:
                    this.assignmentTypeUnassigned.set("checked", true);
                    break;
            }
            this.toggleAssignment();
            
            //Start date
            var defaultStartDate = jobTypeDetails.defaultStartDate;
            if (defaultStartDate && defaultStartDate != "") {
                this.jobStartDateControl.set("value", defaultStartDate);
            } else {
                this.jobStartDateControl.set("value", new Date());
            }
            
            //Due date
            var defaultDueDate = jobTypeDetails.defaultDueDate;
            var defaultJobDuration = jobTypeDetails.defaultJobDuration;
            if (defaultDueDate) {    // Due date specified
                if (defaultDueDate < defaultStartDate) {
                    this.jobDueDateControl.set("value", defaultStartDate);
                } else {
                    this.jobDueDateControl.set("value", defaultDueDate);
                }               
            } else if (defaultJobDuration > 0) {   //Job duration specified
                var calculatedDueDate = new Date(defaultStartDate.getTime());
                calculatedDueDate.setDate(calculatedDueDate.getDate() + defaultJobDuration);
                this.jobDueDateControl.set("value", calculatedDueDate);
            } else {  //No due date or job duration specified, set to current date
                this.jobDueDateControl.set("value", new Date());
            }
            this.jobDueDateControl.constraints.min = this.jobStartDateControl.get("value");
            
            //Data workspace
            var defaultDataWorkspaceId = jobTypeDetails.defaultDataWorkspaceId;
            if (defaultDataWorkspaceId && defaultDataWorkspaceId != "") {
                this.jobDataWorkspacesSelect.set("value", defaultDataWorkspaceId);
            } else {
                this.jobDataWorkspacesSelect.set("value", "0");
            }
            
            //Parent Version
            this.dataWorkspaceDetails = args.dataWorkspaceDetails;
            var versions = this.getVersions(defaultDataWorkspaceId);            
            this.jobParentVersionSelect.set("store", new Memory({ data: versions, idProperty: "name" }));
            this.jobParentVersionSelect.set("value", i18n.properties.noVersion);    // set to "No Version" by default
            var defaultParentVersion = jobTypeDetails.defaultParentVersionName;
            if (defaultParentVersion && defaultParentVersion != "") {                
                var versionStore = this.jobParentVersionSelect.store;
                //Find the matching version
                var result = versionStore.query(function(object){
                    return object.name.toUpperCase() == defaultParentVersion.toUpperCase();
                });
                if (result && result.length > 0) {
                    this.jobParentVersionSelect.set("value", result[0].name);
                }
            }
            
            //Priority
            this.jobPrioritiesSelect.set("value", jobTypeDetails.defaultPriority);

            //Description
            this.jobDescriptionTextarea.set("value", jobTypeDetails.defaultDescription);
            
            //Job owner
            this.cboUsers.innerHTML = this.currentUserDetails.fullName;
        },
        
        getVersions: function(dataWorkspaceId) {
            var versions = [];
            if (dataWorkspaceId != null && dataWorkspaceId != "") {
                for (var i = 0; i < this.dataWorkspaceDetails.length; i++) {
                    var dataWorkspaceDetail = this.dataWorkspaceDetails[i];
                    if (dataWorkspaceDetail && dataWorkspaceDetail.id == dataWorkspaceId) {
                        versions = dataWorkspaceDetail.versions;
                        break;
                    }
                }                
            }
            var noVersion = { name: i18n.properties.noVersion };
            versions.unshift(noVersion);
            return versions;
        }
    });
});