define("workflowmanager/Enum", [], function() {
    return {

        ChangeCondition: {
            ALL: 0,
            BEFORE: 1,
            AFTER: 2
        },
        ChangeRuleSearchType: {
            CONTAINS: "contain",
            EXACT: "exact",
            STARTS_WITH: "start",
            ENDS_WITH: "end"
        },
        ChangeType: {
            ADD: 1,
            MODIFY: 2,
            DELETE: 4,
            ALL: 7
        },
        CompareOperator: {
            EQUAL: 0,
            NOT_EQUAL: 1,
            GREATER_THAN: 2,
            GREATER_OR_EQUAL: 3,
            LESS_THAN: 4,
            LESS_OR_EQUAL: 5,
            CONTAINS: 6
        },
        ExtendedPropertyDisplayType: {
            DEFAULT: 0,
            TEXT: 1,
            DATE: 2,
            DOMAIN: 4,
            FILE: 5,
            GEO_FILE: 6,
            FOLDER: 7,
            LIST: 8,
            TABLE_LIST: 9,
            MULTI_LEVEL_TABLE_LIST: 10
        },
        FieldType: {
            SMALL_INTEGER: 0,
            INTEGER: 1,
            SINGLE: 2,
            DOUBLE: 3,
            STRING: 4,
            DATE: 5,
            OID: 6,
            GEOMETRY: 7,
            BLOB: 8,
            RASTER: 9,
            GUID: 10,
            GLOBAL_ID: 11,
            XML: 12
        },
        JobAssignmentType: {
            NONE: -1,
            UNASSIGNED: 0,
            ASSIGNED_TO_USER: 1,
            ASSIGNED_TO_GROUP: 2
        },        
        JobAttachmentType: {
            LINKED_FILE: 1,
            EMBEDDED: 2,
            LINKED_URL: 3
        },
        JobDependencyType: {
            STEP: 1,
            STAGE: 2,
            STATUS: 3
        },
        JobStage: {
            NONE: -1,
            CREATED: 1,
            READY_TO_WORK: 2,
            WORKING: 3,
            DONE_WORKING: 4,
            CLOSED: 5
        },
        JobTypeState: {
            DRAFT: 0,
            ACTIVE: 1,
            RETIRED: 2
        },
        StepDescriptionType: {
            NONE: 1,
            HTML: 2,
            LINK: 3
        },
        StepExecutionResult: {
            EXECUTED: 1,
            DEPENDENT_ON_STEP: 2,
            DEPENDENT_ON_STAGE: 3,
            DEPENDENT_ON_STATUS: 4,
            JOB_ON_HOLD: 5,
            STEP_DEPENDS_ON_STEP: 6,
            CHECK: 7,
            STEP_ASSIGNED_TO_OTHER_USER: 8,
            STEP_ASSIGNED_TO_OTHER_GROUP: 9,
            JOB_ASSIGNED_TO_OTHERS: 10,
            JOB_CLOSED: 11,
            INVALID_PLATFORM: 12,
            INVALID_STEP: 13,
            DEPENDENT_ON_JOB: 14,
            NOT_CURRENT_STEP: 15
        },
        StepExecutionType: {
            EXECUTABLE: 1,
            FUNCTION: 2,
            PROCEDURAL: 3,
            URL: 4,
            QUESTION: 5,
            FILE: 6
        },
        StepIndicatorType: {
            ROUNDED_RECTANGLE: 1,
            RECTANGLE: 2,
            OVAL: 3,
            DIAMOND: 4,
            PARALLELOGRAM: 5
        },
        StepPlatformType: {
            DESKTOP: 0,
            SERVER: 1,
            BOTH: 2
        },
        StepRunnableStatus: {
            CAN_RUN: 1,
            DEPENDENT_ON_STEP: 2,
            DEPENDENT_ON_STAGE: 3,
            DEPENDENT_ON_STATUS: 4,
            JOB_ON_HOLD: 5,
            STEP_DEPENDS_ON_STEP: 6,
            STEP_ASSIGNED_TO_OTHER_USER: 8,
            STEP_ASSIGNED_TO_OTHER_GROUP: 9,
            JOB_ASSIGNED_TO_OTHERS: 10,
            JOB_CLOSED: 11,
            INVALID_PLATFORM: 12,
            INVALID_STEP: 13,
            DEPENDENT_ON_JOB: 14,
            NOT_CURRENT_STEP: 15
        },
        TableRelationshipType: {
            ONE_TO_ONE: 1,
            ONE_TO_MANY: 2
        }
    };
});
