define([], function() {
    return {
        ExtendedPropertyDisplayType : {
            DEFAULT : "default",
            TEXT : "text",
            DATE : "date",
            DOMAIN : "domain",
            FILE : "file",
            GEO_FILE : "geo-file",
            FOLDER : "folder",
            LIST : "list",
            TABLE_LIST : "table-list",
            MULTI_LEVEL_TABLE_LIST : "multi-level-table-list"
        },

        FieldType : {
            SMALL_INTEGER : "small-integer",
            INTEGER : "integer",
            SINGLE : "single",
            DOUBLE : "double",
            STRING : "string",
            DATE : "date",
            OID : "oid",
            GEOMETRY : "geometry",
            BLOB : "blob",
            RASTER : "raster",
            GUID : "guid",
            GLOBAL_ID : "global-id",
            XML : "xml"
        },

        GeometryType: {
            POINT: "point",
            MULTIPOINT: "multipoint",
            POLYGON: "polygon",
        },

        JobAssignmentType : {
            NONE : "none",
            UNASSIGNED : "unassigned",
            ASSIGNED_TO_USER : "user",
            ASSIGNED_TO_GROUP : "group"
        },

        JobAttachmentType : {
            FILE : "linked-file",
            EMBEDDED : "embedded",
            URL : "url"
        },

         JobStage: {
            NONE: "none",
            CREATED: "created",
            READY_TO_WORK: "ready",
            WORKING: "working",
            DONE_WORKING: "done",
            CLOSED: "closed"
         },

         JobTypeState: {
            DRAFT: "draft",
            ACTIVE: "active",
            RETIRED: "retired"             
         },

        StepExecutionType : {
            EXECUTABLE : "executable",
            FUNCTION : "function",
            PROCEDURAL : "procedural",
            URL : "url",
            QUESTION : "question",
            FILE : "file"
        },
        
        StepExecutionResultType : {
          EXECUTED : "executed",
          DEPENDENT_ON_STEP : "dependent-on-step",
          DEPENDENT_ON_STAGE : "dependent-on-stage",
          DEPENDENT_ON_STATUS : "dependent-on-status",
          JOB_ON_HOLD : "job-on-hold",
          STEP_DEPENDS_ON_STEP : "step-depends-on-step",
          CHECK : "check",
          STEP_ASSIGNED_TO_OTHER_USER : "step-assigned-to-other-user",
          STEP_ASSIGNED_TO_OTHER_GROUP : "step-assigned-to-other-group",
          STEP_ASSIGNED_TO_OTHERS : "job-assigned-to-others",
          JOB_CLOSED : "job-closed",
          INVALID_PLATFORM : "invalid-platform",
          INVALID_STEP : "invalid-step",
          DEPENDENT_ON_JOB : "dependent-on-job",
          NOT_CURRENT_STEP : "not-current-step"
        },

         StepPlatformType: {
            DESKTOP: "desktop",
            SERVER: "server",
            BOTH: "both"             
         },

         StepRunnableStatus: {
            CAN_RUN: "can-run",
            DEPENDENT_ON_STEP: "dependent-on-step",
            DEPENDENT_ON_STAGE: "dependent-on-stage",
            DEPENDENT_ON_STATUS: "dependent-on-status",
            JOB_ON_HOLD: "job-on-hold",
            STEP_DEPENDS_ON_STEP: "step-depends-on-step",
            STEP_ASSIGNED_TO_OTHER_USER: "step-assigned-to-other-user",
            STEP_ASSIGNED_TO_OTHER_GROUP: "step-assigned-to-other-group",
            JOB_ASSIGNED_TO_OTHERS: "job-assigned-to-others",
            JOB_CLOSED: "job-closed",
            INVALID_PLATFORM: "invalid-platform",
            INVALID_STEP: "invalid-step",
            DEPENDENT_ON_JOB: "dependent-on-job",
            NOT_CURRENT_STEP: "not-current-step"
         },
         
         TableRelationshipType: {
           ONE_TO_ONE: "one-to-one",
           ONE_TO_MANY: "one-to-many"
         }
    };
});
