define(function () {
    return {

        chart: {
            handleShape: "/chart/handleShape",
            redoShape: "/chart/redoShape"
        },

        map: {
            loaded: "/map/loaded",
            zoom: {
                extent: "/map/zoom/extent"	
            },
            clearGraphics: "/map/clearGraphics",
            layer : {
                click: "/map/layer/click",
                jobQuery: "/map/layer/jobQuery",                
            },
            draw: {
                start: "/map/draw/start",
                end: "/map/draw/end",
                clear: "/map/draw/clear",
                saveGraphics: "/map/draw/saveGraphics",
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
            resetFilter: "grid/resetFilter",
            filter: "grid/filter",
            jobDialog: "/grid/jobDialog",
            rowSelected: "/grid/rowSelected",
            assignJobs: "/grid/assignJobs",
            closeJobs: "/grid/closeJobs",
            deleteJobs: "/grid/deleteJobs"
        },

        attachment: {
            uploadAttachment: "/attachment/uploadAttachment",
            getContentURL: "/attachment/getContentURL",
            populateAttachment: "/attachment/populateAttachment",
            removeAttachment: "/attachment/removeAttachment",
            updateAttacments: "/attachment/updateAttachments"
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
        },

        extendedProperties: {
            enableButton: "/extendedProperties/enableButton",
            updateExtendedProperties: "/extendedProperties/updateExtendedProperties",
            getFieldValues: "/extendedProperties/getFieldValues",
            invalidUpdate: "/extendedProperties/invalidUpdate",
            errorUpdating: "/extendedProperties/errorUpdating"
        }
	};
});