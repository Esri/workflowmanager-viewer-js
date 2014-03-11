define({
	root: ({
		loading: {
			loading: "loading...",
			username: "Username",
			password: "Password",
			login: "Login",
			loginAttempt: "Trying to login..."
		},

		header: {
			title: "ArcGIS Workflow Manager",
			subHeader: "Web Edition",
			logout: "Logout",
			welcome: "Welcome"
		},
		
		common: {
			loading: "Loading...",
			ok: "OK",
			cancel: "Cancel",
			error: "Error",
			update: "Update",
			selectOption: "Select an option"
		},

		filter: {
			initialQueryTitle: "Select Query",
			createNewJob: "Create New Job",
			createJob: "Create Job",
			findJob: "Find job",
			queries: "Queries",
			orFindJob: "or find job",
			loadingJobQueries: "Loading job queries...",
			noJobsForThisQuery: "No jobs for this query",
			queryFieldDescriptions: "ID,Name,Job Type,Assigned To,Due Date,Description",
			queryTypePublic: "Public Queries",
			queryTypeUser: "User Queries"
		},
		
		statistics: {
			title: "Statistics",
			assignedTo: "Assigned to",
			categorizedBy: "Categorized by",
			groupedBy: "Grouped by",
			jobType: "Job type",
			none: "None",
			barChart: "Bar",
			pieChart: "Pie"
		},
		
		properties: {
			title: "Properties",
			aoiDefined: "AOI defined",
			aoiUndefined: "AOI not defined",
			invalidAssignmentType: "Invalid assignment type",
			jobId: "Job ID",
			jobName: "Job Name",
			jobType: "Job Type",
			jobStatus: "Job Status",
			jobPercentComplete: "% Complete",
			jobAOI: "AOI",
			jobDataWorkspace: "Data Workspace",
			jobVersion: "Version",
			jobParentVersion: "Parent Version",
			jobAssignment: "Assignment",
			jobAssignmentUser: "User",
			jobAssignmentGroup: "Group",
			jobAssignmentUnassigned: "Unassigned",
			jobOwner: "Job Owner",
			jobPriority: "Priority",
			jobStartDate: "Start Date",
			jobDueDate: "Due Date",
			jobDescription: "Job Description",
			notApplicable: "n/a",
			noDataWorkspace: "No Data Workspace",
			noVersion: "No Version",
			numberOfJobs: "Number of jobs",
			updateSuccessful: "Properties updated successfully."
		},
		
		extendedProperties: {
			title: "Extended Properties"
		},
		
		notes: {
			title: "Notes",
			jobNote: "Job Note",
			saveNote: "Save Note"
		},
		
		workflow: {
			title: "Workflow",
			currentSteps: "Current Step(s)",
			executeStep: "Execute Step",
			markStepComplete: "Mark Step Complete",
			
			questionNotes: "Notes (Optional)",
			questionResponse: "Question Response: {0}",
			questionResponseWithNotes: "Question Response: {0} with Note: {1}",
			
			selectPrompt: "[Select]",
			selectCurrentStep: "Select Current Step",
			selectNextStep: "Select Next Step",
						
			executionComplete: "Execution Complete",
			
			executionResponses: {
				1: "The step executed successfully.",
				2: "Dependent on a step in another job.",
				3: "Dependent on a stage in another job.",
				4: "Dependent on a status in another job.",
				5: "Blocked by an active job hold.",
				6: "Dependent on a previous step in this job's workflow.",
				7: "The step was checked as complete.",
				8: "The step is assigned to another user.",
				9: "The step is assigned to another group."
			}
		},
		
		attachments: {
			title: "Attachments",
			noAttachments: "No attachments for this job"
		},

		attachmentItem: {
			noAttachmentType: "Unknown Attachment Type",
			noFilename: "No Filename",
			url: "URL",
			embedded: "Embedded",
			file: "File"
		},
		
		history: {
			title: "History",
			activityType: "Activity Type",
			date: "Date",
			message: "Message",
			noActivityForThisJob: "No activity for this job",
			enterComment: "Enter Comment",
			saveComment: "Save Comment",
			user: "User"
		},

		holds: {
			title: "Holds",
			comment: "Comment",
			holdDate: "Hold Date",
			holdType: "Hold Type",
			id: "ID",
			noHoldsForThisJob: "No holds for this job",
			releasedBy: "Released By",
			saveHold: "Add Hold",
			type: "Type"
		},

		error: {
			title: "Error",
			errorAddingComment: "Error adding comment",
			errorAddingHold: "Error adding hold",
			errorCreatingJob: "Unable to create job",
			errorDeletingJobAOI: "Error deleting job aoi",
			errorExecuteStep: "Unable to execute the workflow step.",
			errorInvalidUsername: "Invalid username {0}",
			errorFindingJobsById: "Unable to find job(s) {0}",
			errorLoadingDataWorkspaceDetails: "Unable to load data workspace details",
			errorLoadingGroups: "Unable to load groups",
			errorLoadingJobHistory: "Unable to load job history",
			errorLoadingJobHolds: "Unable to load job holds",
			errorLoadingJobIdField: "Unable to load job Id field",
			errorLoadingJobTypeDetails: "Unable to load job type details",
			errorLoadingServiceInfo: "Unable to load service info",
			errorLoadingUsers: "Unable to load users",
			errorLoadingWorkflowInfo: "Unable to load workflow info",
			errorMarkAsDone: "Unable to mark the workflow step as complete.",
			errorMoveNextStep: "Unable to advance to the next workflow step.",
			errorResolveConflict: "Unable to resolve the workflow conflict.",
			errorRetrievingJobWithJobId: "Error retrieving jobs with job ID {0}",
			errorRetrievingUser: "Error retrieving user {0}",
			errorRunningQuery: "Error running query {0}",
			errorStepNotWebEnabled: "The step is not configured to run on the web. You can execute the step on the desktop or contact your application administrator.",
			errorUpdatingJobAOI: "Error updating job aoi",
			errorUpdatingJobNotes: "Error updating job notes",
			errorUpdatingJobProperties: "Error updating job properties"
		}
	}),
	
	"de": true,
	'de-at': true,
	'es-ES': true
});