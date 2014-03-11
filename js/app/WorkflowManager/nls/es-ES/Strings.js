define({

    loading: {
        header: "Está ArcGIS Workflow Manager",
        subHeader: "Está Web Edition",
        loading: "Está loading...",
        username: "Está Username",
        password: "Está Password",
        login: "Está Login",
        loginAttempt: "Está Trying to login..."
    },

    header: {
        title: "Está ArcGIS Workflow Manager",
        subHeader: "Está Web Edition",
        logout: "Está Logout",
        welcome: "Está Welcome"
    },

    common: {
        loading: "Está Loading...",
        ok: "Está OK",
        cancel: "Está Cancel",
        error: "Está Error",
        update: "Está Update",
        selectOption: "Está Select an option"
    },

    filter: {
        initialQueryTitle: "Está Select Query",
        createNewJob: "Está Create New Job",
        createJob: "Está Create Job",
        findJob: "Está Find job",
        queries: "Está Queries",
        orFindJob: "Está or find job",
        loadingJobQueries: "Está Loading job queries...",
        noJobsForThisQuery: "Está No jobs for this query",
        queryFieldDescriptions: "Está ID,Name,Job Type,Assigned To,Due Date,Description",
        queryTypePublic: "Está Public Queries",
        queryTypeUser: "Está User Queries"
    },

    statistics: {
        title: "Está Statistics",
        assignedTo: "Está Assigned to",
        categorizedBy: "Está Categorized by",
        groupedBy: "Está and grouped by",
        jobType: "Está Job type",
        none: "Está None",
        barChart: "Está Bar",
        pieChart: "Está Pie"
    },

    properties: {
        title: "Está Properties",
        aoiDefined: "Está AOI defined",
        aoiUndefined: "Está AOI not defined",
        invalidAssignmentType: "Está Invalid assignment type",
        jobId: "Está Job ID",
        jobName: "Está Job Name",
        jobType: "Está Job Type",
        jobStatus: "Está Job Status",
        jobPercentComplete: "Está % Complete",
        jobAOI: "Está AOI",
        jobDataWorkspace: "Está Data Workspace",
        jobVersion: "Está Version",
        jobParentVersion: "Está Parent Version",
        jobAssignment: "Está Assignment",
        jobAssignmentUser: "Está User",
        jobAssignmentGroup: "Está Group",
        jobAssignmentUnassigned: "Está Unassigned",
        jobOwner: "Está Job Owner",
        jobPriority: "Está Priority",
        jobStartDate: "Está Start Date",
        jobDueDate: "Está Due Date",
        jobDescription: "Está Job Description",
        notApplicable: "Está n/a",
        noDataWorkspace: "Está No Data Workspace",
        noVersion: "Está No Version",
        numberOfJobs: "Está Number of jobs",
        updateSuccessful: "Está Properties updated successfully."
    },

    extendedProperties: {
        title: "Está Extended Properties"
    },

    notes: {
        title: "Está Notes",
        jobNote: "Está Job Note",
        saveNote: "Está Save Note"
    },

    workflow: {
        title: "Está Workflow",
        currentSteps: "Está Current Step(s)",
        executeStep: "Está Execute Step",
        markStepComplete: "Está Mark Step Complete",

        questionNotes: "Está Notes (Optional)",
        questionResponse: "Está Question Response: {0}",
        questionResponseWithNotes: "Está Question Response: {0} with Note: {1}",

        selectPrompt: "Está [Select]",
        selectCurrentStep: "Está Select Current Step",
        selectNextStep: "Está Select Next Step",

        executionComplete: "Está Execution Complete",

        executionResponses: {
            1: "Está The step executed successfully.",
            2: "Está Dependent on a step in another job.",
            3: "Está Dependent on a stage in another job.",
            4: "Está Dependent on a status in another job.",
            5: "Está Blocked by an active job hold.",
            6: "Está Dependent on a previous step in this job's workflow.",
            7: "Está The step was checked as complete.",
            8: "Está The step is assigned to another user.",
            9: "Está The step is assigned to another group."
        }
    },

    attachments: {
        title: "Está Attachments",
        noAttachments: "Está No attachments for this job"
    },

    attachmentItem: {
        noAttachmentType: "Está Unknown Attachment Type",
        noFilename: "Está No Filename",
        url: "Está URL",
        embedded: "Está Embedded",
        file: "Está File"
    },

    history: {
        title: "Está History",
        activityType: "Está Activity Type",
        date: "Está Date",
        message: "Está Message",
        noActivityForThisJob: "Está No activity for this job",
        enterComment: "Está New Message",
        saveComment: "Está Save Message",
        user: "Está User"
    },

    holds: {
        title: "Está Holds",
        comment: "Está Comment",
        holdDate: "Está Hold Date",
        holdType: "Está Hold Type",
        id: "Está ID",
        noHoldsForThisJob: "Está No holds for this job",
        releasedBy: "Está Released By",
        saveHold: "Está Add Hold",
        type: "Está Type"
    },

    error: {
        title: "Está Error",
        errorAddingComment: "Está Error adding comment",
        errorAddingHold: "Está Error adding hold",
        errorCreatingJob: "Está Unable to create job",
        errorDeletingJobAOI: "Está Error deleting job aoi",
        errorExecuteStep: "Está Unable to execute the workflow step.",
        errorInvalidUsername: "Está Invalid username {0}",
        errorFindingJobsById: "Está Unable to find job(s) {0}",
        errorLoadingDataWorkspaceDetails: "Está Unable to load data workspace details",
        errorLoadingGroups: "Está Unable to load groups",
        errorLoadingJobHistory: "Está Unable to load job history",
        errorLoadingJobHolds: "Está Unable to load job holds",
        errorLoadingJobIdField: "Está Unable to load job Id field",
        errorLoadingJobTypeDetails: "Está Unable to load job type details",
        errorLoadingServiceInfo: "Está Unable to load service info",
        errorLoadingUsers: "Está Unable to load users",
        errorLoadingWorkflowInfo: "Está Unable to load workflow info",
        errorMarkAsDone: "Está Unable to mark the workflow step as complete.",
        errorMoveNextStep: "Está Unable to advance to the next workflow step.",
        errorResolveConflict: "Está Unable to resolve the workflow conflict.",
        errorRetrievingJobWithJobId: "Está Error retrieving jobs with job ID {0}",
        errorRetrievingUser: "Está Error retrieving user {0}",
        errorRunningQuery: "Está Error running query {0}",
        errorStepNotWebEnabled: "Está The step is not configured to run on the web. You can execute the step on the desktop or contact your application administrator.",
        errorUpdatingJobAOI: "Está Error updating job aoi",
        errorUpdatingJobNotes: "Está Error updating job notes",
        errorUpdatingJobProperties: "Está Error updating job properties"
    }

});