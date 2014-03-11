define(function () {
    return {
        map: {
            loaded: "/map/loaded",
            zoom: {
                extent: "/map/zoom/extent"	
            },
            clearGraphics: "/map/clearGraphics",
            draw: {
                start: "/map/draw/start",
                end: "/map/draw/end",
                clear: "/map/draw/clear",
                deactivateAll: "/map/draw/deactivateAll"
            }
        },

        manager: {
            logAction: "/manager/logAction",
            showProgress: "/manager/showProgress",
            hideProgress: "/manager/hideProgress",
            serviceConfigurationLoaded: "/manager/serviceConfigurationLoaded"
        },

        filter: {
            clearSearch: "/filter/clearSearch",
            jobQueriesChanged: "/filter/jobQueriesChanged",
            jobSearch: "/filter/jobSearch",
            jobTypeSelect: "/filter/jobTypeSelect"    ,     
            newJob: "/filter/newJob"         
        },
        
        statistics: {
            chartCategorizedBy: "/statistics/chartCategorizedBy",
            chartGroupedBy: "/statistics/chartGroupedBy"
        },

        grid: {
            jobDialog: "/grid/jobDialog",
            rowSelected: "/grid/rowSelected",
            assignJobs: "/grid/assignJobs",
            closeJobs: "/grid/closeJobs",
            deleteJobs: "/grid/deleteJobs"
        },

        attachment: {
            removeAttachment: "/attachment/removeAttachment"
        },

        properties: {
            updateProperties: "/properties/updateProperties",
            dataWorkspaceSelect: "/properties/dataWorkspaceSelect"
        },

        history: {
            addComment: "/history/addComment",
            reloadGrid: "/history/reloadGrid"
        },

        holds: {
            addHold: "/holds/addHold"
        },

        notes: {
            noteUpdate: "/notes/noteUpdate"
        }
	};
});