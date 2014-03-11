define("workflowmanager/supportclasses/JobUpdateParameters", [
    "dojo/_base/declare"
], function(declare) {
    return declare(null, {
        // instance properties
        jobId: null,
        name: null,
        startDate: null,
        dueDate: null,
        clearStartDate: null,
        clearDueDate: null,
        priority: null,
        status: null,
        dataWorkspaceId: null,
        parentVersion: null,
        description: null,
        ownedBy: null,
        assignedType: null,
        assignedTo: null,
        percent: null
    });
});
