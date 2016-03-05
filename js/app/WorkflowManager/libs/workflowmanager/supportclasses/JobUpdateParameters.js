define("workflowmanager/supportclasses/JobUpdateParameters", [
    "dojo/_base/declare"
], function(declare) {
    return declare(null, {
        // instance properties
        aoi: null,
        assignedTo: null,
        assignedType: null,
        clearAOI: null,
        clearDueDate: null,
        clearStartDate: null,
        dataWorkspaceId: null,
        description: null,
        dueDate: null,
        jobId: null,
        loi: null,
        name: null,
        ownedBy: null,
        parentJobId: null,
        parentVersion: null,
        percent: null,
        priority: null,
        startDate: null,
        status: null,
        versionName: null
    });
});
