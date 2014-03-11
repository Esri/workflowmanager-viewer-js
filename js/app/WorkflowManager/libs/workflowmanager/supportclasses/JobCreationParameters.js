define("workflowmanager/supportclasses/JobCreationParameters", [
    "dojo/_base/declare",
    "workflowmanager/Enum"
], function(declare, Enum) {
    return declare(null, {
        // instance properties
        jobTypeId: null,
        id: null,
        name: null,
        startDate: null,
        dueDate: null,
        priority: null,
        dataWorkspaceId: null,
        parentVersion: null,
        description: null,
        ownedBy: null,
        assignedType: Enum.JobAssignmentType.NONE,
        assignedTo: null,
        aoi: null,
        numJobs: null,
        autoCommitWorkflow: null,
        autoExecute: null
    });
});
