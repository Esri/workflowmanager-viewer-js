define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./templates/Properties.html",
    "dojo/i18n!./nls/Strings",
    
    "dojo/topic",
    "dojo/_base/lang",
    "dojo/_base/connect",
    "dojo/_base/array",
    "dojo/parser",
    "dojo/query",
    "dojo/on",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dijit/registry",
    "dojo/store/Memory",
    "./config/Topics",
    
    "workflowmanager/supportclasses/JobUpdateParameters",
    "workflowmanager/Enum",

    "./widgets/SaveProps",

    "dijit/form/FilteringSelect",
    "dijit/form/Select",
    "dijit/form/TextBox",
    "dijit/form/Textarea",
    "dijit/form/Button",
    "dijit/form/DropDownButton",
    "dijit/form/ComboBox",
    "dijit/form/RadioButton",
    "dijit/form/DateTextBox",
    "dijit/Dialog",

    "./Attachments",
    "./AttachmentItem",
    ],

function (
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, 
    template, i18n,
    topic, lang, connect, arrayUtil, parser, query, on, domStyle, domConstruct, registry, Memory, appTopics,
    JobUpdateParameters, Enum,
    SaveProps,
    FilteringSelect, Select, TextBox, Textarea, Button, DropDownButton, ComboBox, RadioButton, DateTextBox, Dialog,
    Attachments, AttachmentItem) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        
        templateString: template,
        widgetsInTemplate: true,
        
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
        i18n_NotApplicable: i18n.properties.notApplicable,
        i18n_JobAssignmentUser: i18n.properties.jobAssignmentUser,
        i18n_JobAssignmentGroup: i18n.properties.jobAssignmentGroup,
        i18n_JobAssignmentUnassigned: i18n.properties.jobAssignmentUnassigned,
        i18n_JobAssignmentUnknownUser: i18n.properties.jobAssignmentUnknownUser,
        i18n_AoiDefined: i18n.properties.aoiDefined,
        i18n_AoiUndefined: i18n.properties.aoiUndefined,
        i18n_Update: i18n.common.update,

        currentUser: null,
        currentUserDetails: null,
        currentUserPrivileges: null,
        
        assignableUsers: null,
        assignableGroups: null,

        currentJob: null,
        jobHasActiveHolds: false,
        autoStatusAssign: false,

        canChangeOwner: false,
        canChangeAssignment: false,
        canChangeDataWorkspace: false,
        canChangeProperties: false,
        canChangeStatus: false,
        
        constructor: function () {

        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.initUI();
            console.log("Properties started");
        },
        
        initUI: function () {
            var self = lang.hitch(this);
            // assignment radio buttons
            this.jobAssignmentTypeUser.set("disabled", true);
            this.jobAssignmentTypeGroup.set("disabled", true);
            this.jobAssignmentTypeUnassigned.set("disabled", true);
            
            // users
            this.assignmentUsersSelect = new FilteringSelect({
                placeHolder: i18n.common.loading,
                id: "assignmentUsersSelect",
                name: "assignmentUsersSelect",
                disabled: true,
                style: "width:250px;",
                searchAttr: "fullName",
                onChange: function () {
                    self.activateUpdateBtn();
                }
            }, this.cboAssignmentUsers);
            this.assignmentUsersSelect.startup();
            
            // groups
            this.assignmentGroupsSelect = new FilteringSelect({
                placeHolder: i18n.common.loading,
                id: "assignmentGroupsSelect",
                name: "assignmentGroupsSelect",
                disabled: true,
                style: "width:250px;",
                onChange: function () {
                    self.activateUpdateBtn();
                }
            }, this.cboAssignmentGroups);
            this.assignmentGroupsSelect.startup();
            
            // job priorities
            this.jobPrioritiesSelect = new FilteringSelect({
                placeHolder: i18n.common.loading,
                id: "jobPrioritiesSelect",
                name: "jobPrioritiesSelect",
                disabled: true,
                style: "width:250px;",
                onChange: function () {
                    self.activateUpdateBtn();
                }
            }, this.cboJobPriorities);
            this.jobPrioritiesSelect.startup();
            
            // start date
            this.jobStartDateControl = new DateTextBox({
                id: "jobPropertiesStartDateControl",
                name: "jobPropertiesStartDateControl",
                style: "width:250px;",
                disabled: true,
                onChange: lang.hitch(this, function() {
                    var newStartDate = this.jobStartDateControl.get("value");
                    if ((newStartDate > this.jobDueDateControl.get("value")) && (this.jobDueDateControl.get("value"))) {
                        this.jobDueDateControl.set("value", newStartDate);
                    }
                    this.jobDueDateControl.constraints.min = newStartDate;
                    this.activateUpdateBtn();
                })
            }, this.jobPropertiesStartDateControl);
            this.jobStartDateControl.startup();
            
            // due date
            this.jobDueDateControl = new DateTextBox({
                id: "jobPropertiesDueDateControl",
                name: "jobPropertiesDueDateControl",
                style: "width:250px;",
                disabled: true,
                onChange: lang.hitch(this, function() {
                    this.activateUpdateBtn();
                })
            }, this.jobPropertiesDueDateControl);
            this.jobDueDateControl.startup();

            // job description
            this.jobDescriptionTextarea = new Textarea({
                placeHolder: i18n.common.loading,
                id: "jobDescriptionTextarea",
                name: "jobDescriptionTextarea",
                value: i18n.properties.notApplicable,
                disabled: true,
                style: "width: 400px; min-height: 100px; max-height:100px;",
                onChange: function () {
                    self.activateUpdateBtn();
                }
            }, this.propertiesFormDescription);
            this.jobDescriptionTextarea.startup();
        },

        setUserProperties: function (args) {
            this.currentUser = args.user;
            this.currentUserDetails = args.userDetails;
            this.currentUserPrivileges = args.userPrivileges;
        },
        
        setCurrentJob: function (job, autoStatusAssign, serviceInfo) {
            var self = lang.hitch(this);
            // Set initial values
            this.currentJob = job;
            
            // Check if job is assignable            
            if (this.canAssignJob()) {
                this.canChangeAssignment = true;
            } else {
                this.canChangeAssignment = false;
            }
            
            if (autoStatusAssign == "TRUE")
                this.autoStatusAssign = true;
            else
                this.autoStatusAssign = false;
            
            // set form content
            this.propertiesFormJobID.innerHTML = job.id;
            this.propertiesFormJobName.innerHTML = job.name;
            this.propertiesFormJobType.innerHTML = serviceInfo.jobTypes[this.findWithAttr(serviceInfo.jobTypes, "id", job.jobTypeId)].name;                  //serviceInfo.jobTypes[job.jobTypeId -= 1].name;                   //job.jobTypeId;    //this.jobTypesSelect.set("value", job.jobTypeId);
            this.propertiesFormJobStatus.innerHTML = serviceInfo.jobStatuses[this.findWithAttr(serviceInfo.jobStatuses, "id", job.status)].name;                         //serviceInfo.jobStatuses[job.status -= 1].name;               //job.status;        //this.jobStatusesSelect.set("value", job.status);        
            this.propertiesFormPercentComplete.innerHTML = job.percentageComplete + "%";
            
            //TODO fix start/due dates
            this.jobStartDateControl.set("value", job.startDate);
            this.jobDueDateControl.set("value", job.dueDate);

            if (job.aoi.rings.length > 0) {
                this.propertiesFormAOI.innerHTML = this.i18n_AoiDefined;
            } else {
                this.propertiesFormAOI.innerHTML = this.i18n_AoiUndefined;
            };

            // Populate Version if versionExist = true
            if (job.versionExists) {
                this.propertiesFormVersion.innerHTML = job.versionInfo[job.versionInfo.length - 1].name;
            } else {
                this.propertiesFormVersion.innerHTML = i18n.properties.noVersion;
            };

            // Populate Parent Version if versionExist = true
            if (job.parentVersion != "") {
                this.propertiesFormParentVersion.innerHTML = job.parentVersion;
            } else {
                this.propertiesFormParentVersion.innerHTML = i18n.properties.noVersion;
            };

            // Assignment            
            this.populateAssignmentUsers();
            this.populateAssignmentGroups();
            switch (job.assignedType) {
                case 1:
                    this.jobAssignmentTypeUser.set("checked", true);
                    this.assignmentUsersSelect.set("value", job.assignedTo);
                    // If no user was selected, the user does not exist so display Unknown User
                    if (this.assignmentUsersSelect.item == null)
                        this.assignmentUsersSelect.set("displayedValue", this.i18n_JobAssignmentUnknownUser);
                    break;
                case 2:
                    this.jobAssignmentTypeGroup.set("checked", true);
                    this.assignmentGroupsSelect.set("value", job.assignedTo);
                    break;
                default:
                    this.jobAssignmentTypeUnassigned.set("checked", true);
            }
            this.toggleAssignment();
            
            // Ownedby
            //get owner full name
            var ownerFullName;
            dojo.some(serviceInfo.users, function (item, index) {
                if (item.userName == job.ownedBy) {
                    ownerFullName = item.fullName;
                    return true;   // found entry, break from the loop
                }
            });
            if (!ownerFullName)
                ownerFullName = this.i18n_JobAssignmentUnknownUser;
            this.cboUsers.innerHTML = ownerFullName;
            
            // Priority
            this.jobPrioritiesSelect.set("value", job.priority);            //this.propertiesFormPriority.innerHTML = job.priority;
            
            // DataWorkspace
            if (job.dataWorkspaceId != "") {
                //query workspaces with id
                var workspaceName = serviceInfo.dataWorkspaces[this.findWithAttr(serviceInfo.dataWorkspaces, "id", job.dataWorkspaceId)].name;
                this.cboJobDataWorkspaces.innerHTML = workspaceName;
            } else {
                this.cboJobDataWorkspaces.innerHTML = i18n.properties.noDataWorkspace;
            }
            
            // Description
            this.jobDescriptionTextarea.set("value", job.description);

            // reset button to disabled
            this.btnUpdateProperties.set("disabled", true);
            // reset changes made var
            this.changesMade = false;

            // update properties based on user privileges
            this.updatePrivileges();
        },
        
        updatePrivileges: function () {
            this.canChangeOwner = false;
            this.canChangeDataWorkspace = false;
            this.canChangeProperties = false;
            this.canChangeStatus = false;
            
            // Job owner is editable if:
            //  - job is not closed
            //  - user has privilege to change job owner 
            if (this.currentJob.stage != Enum.JobStage.CLOSED && this.currentUserPrivileges.canChangeJobOwner) {
                this.canChangeOwner = true;
            }

            // Data workspace is editable if:
            //  - job is not closed
            //  - user has privilege to manage data workspaces
            //  - job is unassigned, job is owned by current user, or job is assigned to the current user    
            if (this.currentJob.stage != Enum.JobStage.CLOSED
                && this.currentUserPrivileges.canManageDataWorkspace
                && (this.currentJob.assignedType == Enum.JobAssignmentType.UNASSIGNED
                    || this.currentJob.ownedBy == this.currentUser 
                    || (this.currentJob.assignedType == Enum.JobAssignmentType.ASSIGNED_TO_USER && this.currentJob.assignedTo == this.currentUser))) {
                this.canChangeDataWorkspace = true;
            } 

            // Job properties are editable if:
            //  - job is not closed
            //  - user has privilege to update job properties
            //  - job has no active holds, or user has privilege to update properties of held jobs
            //  - job is unassigned, job is owned by current user, or job is assigned to the current user    
            if (this.currentJob.stage != Enum.JobStage.CLOSED
                && this.currentUserPrivileges.canUpdateProperties
                && (!this.jobHasActiveHolds || this.currentUserPrivileges.canUpdatePropsForHeldJobs)
                && (this.currentJob.assignedType == Enum.JobAssignmentType.UNASSIGNED
                    || this.currentJob.ownedBy == this.currentUser 
                    || (this.currentJob.assignedType == Enum.JobAssignmentType.ASSIGNED_TO_USER && this.currentJob.assignedTo == this.currentUser))) {
                this.canChangeProperties = true;
            } 
            
            // Job status is editable if:
            //  - job properties are editable
            //  - workflow configuration is not set to auto status assign
            if (this.canChangeProperties && this.autoStatusAssign == false) {
                this.canChangeStatus = true;
            } 
            
            // Enable or disable tab properties content 
            this.changesAllowed();
        },
        
        setJobHolds: function(jobHolds) {
            var oldValue = this.jobHasActiveHolds;
            if (jobHolds && jobHolds.length > 0)
                this.jobHasActiveHolds = true;
            else
                this.jobHasActiveHolds = false;

            if (oldValue != this.jobHasActiveHolds)             
                this.updatePrivileges();
        },
        
        populateDropdowns: function(args) { 
            this.jobPrioritiesSelect.set("store", new Memory({ data: args.jobPriorities, idProperty: "value" }));
            this.jobPrioritiesSelect.set("placeHolder", "");
        },
        
        populateUsers: function (users) {
            this.users = users;
        },
        
        populateGroups: function (groups) {
            this.groups = groups;
        },
        
        populateAssignableUsers: function() {
            var assignableUsers = [];
            if (this.users && this.users.length > 0) {
                assignableUsers = dojo.filter(this.users, lang.hitch(this, function(item, index) {
                    if (this.currentUserPrivileges.canAssignAnyJob) {
                        return true;
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
            this.assignableUsers = assignableUsers;
        },
        
        populateAssignmentUsers: function() {
            var assignableUsers = [];
            if (this.users && this.users.length > 0) {
                if (this.canChangeAssignment) {
                    assignableUsers = this.assignableUsers;
                } else {
                    // If user cannot change job assignment, use the full list of users
                    // since the assignment cannot be changed anyway.
                    assignableUsers = this.users;
                }
            }
            this.assignmentUsersSelect.set("store", new Memory({ data: assignableUsers, idProperty: "userName" }));         
            this.assignmentUsersSelect.set("placeHolder", "");
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
            if (this.users && this.users.length > 0) {
                assignableGroups = dojo.filter(this.groups, lang.hitch(this, function(item, index) {
                    if (this.currentUserPrivileges.canAssignAnyJob) {
                        return true;
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
            this.assignableGroups = assignableGroups;
        },
        
        populateAssignmentGroups: function() {
            var assignableGroups = [];
            if (this.groups && this.groups.length > 0) {
                if (this.canChangeAssignment) {
                    assignableGroups = this.assignableGroups;
                } else {
                    // If user cannot change job assignment, use the full list of groups
                    // since the assignment cannot be changed anyway.
                    assignableGroups = this.groups;
                }
            }
            this.assignmentGroupsSelect.set("store", new Memory({ data: assignableGroups, idProperty: "name" }));
            this.assignmentGroupsSelect.set("placeHolder", "");
            if (assignableGroups && assignableGroups.length > 0) {
                this.assignmentGroupsSelect.set("value", assignableGroups[0].name);  // by default select first item
            }            
        },
        
        toggleAssignment: function () {
            var checkedButtons = dojo.query('[name=jobAssignmentType]').filter(function (radio) {
                return radio.checked;
            });
            
            if (checkedButtons[0].value == "user") {
                this.jobAssignmentTypeWrapper.style.visibility = "visible";
                this.jobAssignmentTypeUserWrapper.style.display = "inline";
                this.jobAssignmentTypeGroupWrapper.style.display = "none";
                this.initAssignmentType = Enum.JobAssignmentType.ASSIGNED_TO_USER;
                //set a type var for detecting change
                this.userAssignedType = 1;
            } else if (checkedButtons[0].value == "group") {
                this.jobAssignmentTypeWrapper.style.visibility = "visible";
                this.jobAssignmentTypeUserWrapper.style.display = "none";
                this.jobAssignmentTypeGroupWrapper.style.display = "inline";
                this.initAssignmentType = Enum.JobAssignmentType.ASSIGNED_TO_GROUP;
                //set a type var for detecting change
                this.userAssignedType = 2;
            } else {
                this.jobAssignmentTypeWrapper.style.visibility = "hidden";
                this.initAssignmentType = Enum.JobAssignmentType.UNASSIGNED;
                //set a type var for detecting change
                this.userAssignedType = 0;
            }

            this.activateUpdateBtn();
        },
        
        canAssignJob: function() {
            if (this.currentJob.stage == Enum.JobStage.CLOSED) {
                return false;
            }
            if (this.currentUserPrivileges.canAssignAnyJob) {
                this.populateAssignableUsers();
                this.populateAssignableGroups();
                return true;
            }
            if (this.currentUserPrivileges.canGroupJobAssign || this.currentUserPrivileges.canIndividualJobAssign) {
                // populate assignable users and groups based on current job assignment
                this.populateAssignableUsers();
                this.populateAssignableGroups();
                
                // The job is assignable if any of the following are true:
                //   - assigned to the current user
                //   - assigned to any group of the current user
                //   - assigned to any user within any group of the current user (only if canGroupJobAssign)
                if (this.currentJob.assignedType == Enum.JobAssignmentType.ASSIGNED_TO_USER) {
                    if (this.currentJob.assignedTo == this.currentUserDetails.userName) {
                        return true;
                    }
                    if (this.currentUserPrivileges.canGroupJobAssign) {
                        // Check if assigned to any user within any group of the current user
                        var assignableUsers = this.assignableUsers;
                        for (var i = 0; i < assignableUsers.length; i++) {
                            var user = assignableUsers[i];    
                            if (user.userName == this.currentJob.assignedTo) {
                                return true;
                            }
                        }
                    }
                }
                if (this.currentJob.assignedType == Enum.JobAssignmentType.ASSIGNED_TO_GROUP) {
                    // Check if assigned to any group of the current user
                    var assignableGroups = this.assignableGroups;
                    for (var i = 0; i < assignableGroups.length; i++) {
                        var group = assignableGroups[i];
                        if (group.name == this.currentJob.assignedTo) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        changesAllowed: function () {
            if (this.canChangeAssignment) {
                // assignment radio btns
                this.jobAssignmentTypeUser.set("disabled", false);
                this.jobAssignmentTypeGroup.set("disabled", false);
                this.jobAssignmentTypeUnassigned.set("disabled", false);
                // assignment drop downs
                this.assignmentUsersSelect.set("disabled", false);
                this.assignmentGroupsSelect.set("disabled", false);
            } else {
                // assignment radio btns
                this.jobAssignmentTypeUser.set("disabled", true);
                this.jobAssignmentTypeGroup.set("disabled", true);
                this.jobAssignmentTypeUnassigned.set("disabled", true);
                // assignment drop downs
                this.assignmentUsersSelect.set("disabled", true);
                this.assignmentGroupsSelect.set("disabled", true);
            }
            if (this.canChangeProperties) {
                // job priorities
                this.jobPrioritiesSelect.set("disabled", false);
                // start date
                this.jobStartDateControl.set("disabled", false);
                // due date
                this.jobDueDateControl.set("disabled", false);
                // job description
                this.jobDescriptionTextarea.set("disabled", false);
            } else {
                // job priorities
                this.jobPrioritiesSelect.set("disabled", true);
                // start date
                this.jobStartDateControl.set("disabled", true);
                // due date
                this.jobDueDateControl.set("disabled", true);
                // job description
                this.jobDescriptionTextarea.set("disabled", true);
            }
        },

        activateUpdateBtn: function () {
            // call this when the user is navigating away
            // tests if the fields are different from the vals set by job

            //set assigned to
            switch (this.userAssignedType) {
                case 0:
                    this.userAssignedTo = "";
                    break;
                case 1:
                    this.userAssignedTo = this.assignmentUsersSelect.get("value");
                    break;
                case 2:
                    this.userAssignedTo = this.assignmentGroupsSelect.get("value");
                    break;
            }

            //date fix
            if (this.currentJob.startDate) {
                this.serverStartDate = (this.currentJob.startDate).setHours(12);
            } else {
                this.serverStartDate = null;
            }
            if (this.currentJob.dueDate) {
                this.serverDueDate = (this.currentJob.dueDate).setHours(12);
            } else {
                this.serverDueDate = null;
            }

            if (this.jobStartDateControl.get("value") > 72000000) {
                this.userStartDate = (this.jobStartDateControl.get("value")).setHours(12);
            } else {
                this.userStartDate = null;
            }
            if (this.jobDueDateControl.get("value") > 72000000) {
                this.userDueDate = (this.jobDueDateControl.get("value")).setHours(12);
            } else {
                this.userDueDate = null;
            }

            this.serverVals = {
                assignedType: this.currentJob.assignedType,
                assignedTo: this.currentJob.assignedTo,
                priority: this.currentJob.priority,
                startDate: this.serverStartDate,
                dueDate: this.serverDueDate,
                description: this.currentJob.description
            };
            this.userVals = {
                assignedType: this.userAssignedType,
                assignedTo: this.userAssignedTo,
                priority: parseInt(this.jobPrioritiesSelect.get("value")),
                startDate: this.userStartDate,
                dueDate: this.userDueDate,
                description: this.jobDescriptionTextarea.get("value")
            };

            //console.log(this.serverVals);
            //console.log(this.userVals);

            //changes made if
            if ((this.serverVals.assignedType != this.userVals.assignedType)
                || (this.serverVals.assignedTo != this.userVals.assignedTo)
                || (this.serverVals.priority != this.userVals.priority)
                || (this.serverVals.startDate != this.userVals.startDate)
                || (this.serverVals.dueDate != this.userVals.dueDate)
                || (this.serverVals.description != this.userVals.description)) {
                this.errorContainer.innerHTML = "";
                this.btnUpdateProperties.set("disabled", false);
                this.changesMade = true;
            } else {
                this.btnUpdateProperties.set("disabled", true);
                this.changesMade = false;
            }
        },

        closingProps: function () {
            //called when the jobDialog is closed or if tabcontainer selectedChild oldVal == tabProperties

            //test if updateBtn is active
            if (this.changesMade) {
                //launch save widget
                var saveWidget = new SaveProps({ controller: this });
                saveWidget.startup();
            } else {
                //clear prop fields
                this.clearProps();
                topic.publish("Properties/SaveDialog/Continue");
            }
        },
        
        clearProps: function() {
            // clear form content
            this.propertiesFormJobID.innerHTML = "";
            this.propertiesFormJobName.innerHTML = "";
            this.propertiesFormJobType.innerHTML = "";
            this.propertiesFormJobStatus.innerHTML = "";
            this.propertiesFormPercentComplete.innerHTML = "";
            this.jobStartDateControl.set("value", "");
            this.jobDueDateControl.set("value", "");
            this.propertiesFormAOI.innerHTML = "";
            this.propertiesFormVersion.innerHTML = "";
            this.propertiesFormParentVersion.innerHTML = "";

            this.jobAssignmentTypeUnassigned.set("checked", true);
            this.toggleAssignment();

            this.cboUsers.innerHTML = "";

            this.jobPrioritiesSelect.set("value", "");
            this.cboJobDataWorkspaces.innerHTML = "";

            this.jobDescriptionTextarea.set("value", "");
        },
        
        updateProperties: function () {
            console.log("update properties button clicked");
            var self = lang.hitch(this);
            var para = new JobUpdateParameters;
            
            //Properties that don't have editable fields
            para.jobId = this.currentJob.id;
            para.name = this.currentJob.name;
            para.status = this.currentJob.status;
            para.percent = this.currentJob.percentageComplete;

            //Data workspace
            para.dataWorkspaceId = this.currentJob.dataWorkspaceId;
            
            //Parent version
            para.parentVersion = this.currentJob.parentVersion;
            
            //Version
            para.version = this.currentJob.version;

            //Assigned type / assigned to
            if (this.jobAssignmentTypeUser.checked == true) {
                para.assignedType = Enum.JobAssignmentType.ASSIGNED_TO_USER;
                para.assignedTo = self.assignmentUsersSelect.get("value");
            } else if (this.jobAssignmentTypeGroup.checked == true) {
                para.assignedType = Enum.JobAssignmentType.ASSIGNED_TO_GROUP;
                para.assignedTo = self.assignmentGroupsSelect.get("value");
            } else if (this.jobAssignmentTypeUnassigned.checked == true) {
                para.assignedType = Enum.JobAssignmentType.UNASSIGNED;
                para.assignedTo = "";
            } else {
                // unknown option
                topic.publish(appTopics.error.popup, i18n.properties.invalidAssignmentType);
                return;
            }

            //Owner
            para.ownedBy = this.currentJob.ownedBy;
            
            //Start Date
            var startDate = self.jobStartDateControl.get("value");
            if (startDate != "") {
                var startDateFix = Date.parse(startDate) + 43200000;
                para.startDate = new Date(startDateFix);
            } else {
                para.clearStartDate = true;
            }

            //Due Date
            var dueDate = self.jobDueDateControl.get("value");
            if (dueDate != "") {
                var dueDateFix = Date.parse(dueDate) + 43200000;
                para.dueDate = new Date(dueDateFix);
            } else {
                para.clearDueDate = true;
            }

            //AOI
            if ((this.currentJob.aoi != this.propertiesFormAOI.innerHTML) && (this.propertiesFormAOI.innerHTML == "")) {
                para.clearAOI = true;
            };

            //Priority
            para.priority = self.jobPrioritiesSelect.get("value");

            //Description
            para.description = self.jobDescriptionTextarea.get("value");

            //Send to controller to update job
            topic.publish(appTopics.properties.updateProperties, para);

            //reset changes made var
            this.changesMade = false;
        },

        updateCallback: function (callback) {
            console.log(callback);
            this.errorContainer.innerHTML = callback;
        },

        findWithAttr: function (array, attr, value) {
            //if array is defined
            if (array) {
                for (var i = 0; i < array.length; i += 1) {
                    if (array[i][attr] === value) {
                        return i;
                    }
                }
            }
        }
    });
});