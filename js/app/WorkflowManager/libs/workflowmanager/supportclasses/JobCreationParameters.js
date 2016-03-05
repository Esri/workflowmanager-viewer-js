define("workflowmanager/supportclasses/JobCreationParameters", [
    "dojo/_base/declare",
    "workflowmanager/Enum"
], function(declare, Enum) {
    return declare(null, {
        // instance properties
        aoi: null,
        assignedTo: null,
        assignedType: null,
        autoCommitWorkflow: null,
        autoExecute: null,
        dataWorkspaceId: null,
        description: null,
        dueDate: null,
        id: null,
        jobTypeId: null,
        loi: null,
        name: null,
        numJobs: null,
        ownedBy: null,
        parentJobId: null,
        parentVersion: null,
        priority: null,
        startDate: null
    });
});
