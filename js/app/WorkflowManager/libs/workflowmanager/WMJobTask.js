define("workflowmanager/WMJobTask", [
    "dojo/_base/declare",
    "dojo/dom",
    "workflowmanager/_BaseTask",
    "workflowmanager/_Util",
    "workflowmanager/Enum",
    "esri/geometry/Multipoint"
], function(declare, dom, BaseTask, Util, Enum, Multipoint) {
    return declare([BaseTask], {
        
        constructor: function (url) {
            this.url = url;
            this.disableClientCaching = true;
        },
        getAllJobIds: function (successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "/jobs", function (response) {
                successCallBack(response.jobIds);
            }, errorCallBack);
        },
        getJob: function (jobId, successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "/jobs/" + jobId, function (response) {
                var util = new Util();
                response.createdDate = util.convertToDate(response.createdDate);
                response.startDate = util.convertToDate(response.startDate);
                response.startedDate = util.convertToDate(response.startedDate);
                response.dueDate = util.convertToDate(response.dueDate);
                if (response.aoi) {
                    response.aoi = new esri.geometry.Polygon(response.aoi);
                    response.loi = new esri.geometry.Polygon(response.aoi);
                }
                if (response.poi) {
                    response.loi = new esri.geometry.Multipoint(response.poi);
                    delete response.poi;    // response should not include the poi, just loi
                }
                successCallBack(response);
            }, errorCallBack);
        },
        searchJobs: function (text, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.text = text;        
            this.sendRequest(params, "/jobs/search", successCallBack, errorCallBack);
        },
        queryJobsByID: function (queryId, user, successCallBack, errorCallBack) {
            var params = {};
            params.id = queryId;
            if (user != null && user != "") {
                params.user = this.formatDomainUsername(user);
            }
            this.sendRequest(params, "/jobs/query", successCallBack, errorCallBack);
        },
        queryJobsAdHoc: function (parameters, user, successCallBack, errorCallBack) {
            var params = {};
            var util = new Util();
            params.fields = util.formatJobQueryCSV(parameters.fields);
            params.tables = util.formatJobQueryCSV(parameters.tables);
            if (parameters.aliases != null) {
                params.aliases = util.formatJobQueryCSV(parameters.aliases);
            }
            if (parameters.where != null) {
                params.where = parameters.where;
            }
            if (parameters.orderBy != null) {
                params.orderBy = parameters.orderBy;
            }
            if (user != null && user != "") {
                params.user = this.formatDomainUsername(user);
            }
            this.sendRequest(params, "/jobs/query", successCallBack, errorCallBack);
        },
        createJob: function (parameters, user, successCallBack, errorCallBack) {
            var params = parameters;
            params.user = this.formatDomainUsername(user);
            if (params.ownedBy != null) {
                params.ownedBy = this.formatDomainUsername(params.ownedBy);
            }
            if (params.assignedTo != null) {
                params.assignedTo = this.formatDomainUsername(params.assignedTo);
            }
            if (params.startDate != null) {
                params.startDate = Date.parse(params.startDate);
            }
            if (params.dueDate != null) {
                params.dueDate = Date.parse(params.dueDate);
            }
            if (params.aoi != null) {
                params.aoi = JSON.stringify(params.aoi.toJson());
            }
            if (params.loi != null) {
                var loi = params.loi;
                params.loi = null;
                if (loi.type == "polygon") {
                    params.aoi = JSON.stringify(loi.toJson());
                } else if (loi.type == "multipoint") {
                    params.poi = JSON.stringify(loi.toJson());
                } else if (loi.type == "point") {
                    var multiPoint = new Multipoint(loi.spatialReference);
                    multiPoint.addPoint(loi);
                    params.poi = JSON.stringify(multiPoint.toJson());
                }
            }
            
            this.sendRequest(parameters, "/jobs/create", function (response) {
                successCallBack(response.jobIds);
            }, errorCallBack);
        },
        assignJobs: function (jobIds, assignedType, assignedTo, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.jobs = (new Util()).convertIdsToString(jobIds);
            params.assignedType = assignedType;
            params.assignedTo = this.formatDomainUsername(assignedTo);
    
            this.sendRequest(params, "/jobs/assign", successCallBack, errorCallBack);
        },
        unassignJobs: function (jobIds, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.jobs = (new Util()).convertIdsToString(jobIds);
            this.sendRequest(params, "/jobs/unassign", successCallBack, errorCallBack);
        },
        closeJob: function (jobId, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            this.sendRequest(params, "/jobs/" + jobId + "/close", successCallBack, errorCallBack);
        },
        closeJobs: function (jobIds, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.jobs = (new Util()).convertIdsToString(jobIds);
            this.sendRequest(params, "/jobs/close", successCallBack, errorCallBack);
        },
        reopenClosedJobs: function (jobIds, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.jobs = (new Util()).convertIdsToString(jobIds);
            this.sendRequest(params, "/jobs/reopen", successCallBack, errorCallBack);
        },
        deleteJobs: function (jobIds, deleteHistory, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.jobs = (new Util()).convertIdsToString(jobIds);
            params.deleteHistory = false;
            params.deleteHistory = deleteHistory;
            this.sendRequest(params, "/jobs/delete", successCallBack, errorCallBack);
        },
        updateJob: function (parameters, user, successCallBack, errorCallBack) {
            parameters.user = this.formatDomainUsername(user);
            if (parameters.ownedBy != null) {
                parameters.ownedBy = this.formatDomainUsername(parameters.ownedBy);
            }
            if (parameters.assignedTo != null) {
                parameters.assignedTo = this.formatDomainUsername(parameters.assignedTo);
            }
            if (parameters.startDate != null) {
                parameters.startDate = Date.parse(parameters.startDate);
            }
            if (parameters.dueDate != null) {
                parameters.dueDate = Date.parse(parameters.dueDate);
            }
            if (parameters.loi != null) {
                var loi = parameters.loi;
                parameters.loi = null;
                if (loi.type == "polygon") {
                    parameters.aoi = loi.toJson();
                } else if (loi.type == "multipoint") {
                    parameters.poi = loi.toJson();
                } else if (loi.type == "point") {
                    var multiPoint = new Multipoint(loi.spatialReference);
                    multiPoint.addPoint(loi);
                    parameters.poi = multiPoint.toJson();
                }
            }
    
            // 10.1 style
            var props = {};
            for (var key in parameters) {
                props[key] = parameters[key];
            }
    
            parameters["properties"] = JSON.stringify(props);
            this.sendRequest(parameters, "/jobs/" + parameters.jobId + "/update", successCallBack, errorCallBack);
        },
        createJobVersion: function (jobId, name, parent, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.name = name;
            params.parent = parent;
            this.sendRequest(params, "/jobs/" + jobId + "/createVersion", function (response) {
                successCallBack(response.versionName);
            }, errorCallBack);
        },
        // Deprecated use updateLOI instead.
        updateAOI: function(jobId, aoi, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            
            // 10.1 style
            var props = {};
            props.user = this.formatDomainUsername(user);
    
            if (aoi != null) {
                var aoiJson = aoi.toJson();
                params.aoi = JSON.stringify(aoiJson);
                props.aoi = aoiJson;
            }
    
            params["properties"] = JSON.stringify(props);
            this.sendRequest(params, "/jobs/" + jobId + "/update", successCallBack, errorCallBack);
        },
        updateLOI: function(jobId, loi, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            var props = {};
            props.user = this.formatDomainUsername(user);
    
            if (loi != null) {
                if (loi.type == "polygon") {
                    props.aoi = loi.toJson();
                } else if (loi.type == "multipoint") {
                    props.poi = loi.toJson();
                } else if (loi.type == "point") {
                    var multiPoint = new Multipoint(loi.spatialReference);
                    multiPoint.addPoint(loi);
                    props.poi = multiPoint.toJson();
                }
            }
            params["properties"] = JSON.stringify(props);
            this.sendRequest(params, "/jobs/" + jobId + "/update", successCallBack, errorCallBack);
        },
        deleteAOI: function(jobId, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.clearAOI = true;
            params.aoi = null;
            
            // 10.1 style
            var props = {};
            props.user = this.formatDomainUsername(user);
            props.clearAOI = true;
            props.aoi = null;
    
            params["properties"] = JSON.stringify(props);
            this.sendRequest(params, "/jobs/" + jobId + "/update", successCallBack, errorCallBack);
        },
        deleteLOI: function(jobId, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            
            var props = {};
            props.user = this.formatDomainUsername(user);
            props.aoi = null;
            props.poi = null;
    
            params["properties"] = JSON.stringify(props);
            this.sendRequest(params, "/jobs/" + jobId + "/update", successCallBack, errorCallBack);
        },
        getNotes: function (jobId, successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "/jobs/" + jobId + "/notes", function (response) {
                successCallBack(response.notes);
            }, errorCallBack);
        },
        updateNotes: function (jobId, notes, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.notes = notes;
            this.sendRequest(params, "/jobs/" + jobId + "/notes/update", successCallBack, errorCallBack);
        },
        getAttachments: function (jobId, successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "/jobs/" + jobId + "/attachments", function (response) {
                successCallBack(response.attachments);
            }, errorCallBack);
        },
        addLinkedURLAttachment: function (jobId, url, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.storageType = 3;
            params.filePath = url;
            this.sendRequest(params, "/jobs/" + jobId + "/attachments/add", function (response) {
                successCallBack(response.attachmentId);
            }, errorCallBack);
        },
        addLinkedFileAttachment: function (jobId, filePath, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.storageType = 1;
            params.filePath = filePath;
            this.sendRequest(params, "/jobs/" + jobId + "/attachments/add", function (response) {
                successCallBack(response.attachmentId);
            }, errorCallBack);
        },
        //create a form data and send it
        addEmbeddedAttachment: function(user, jobId, form, successCallBack, errorCallBack) {
            var tokenStr = (this.token) ? this.token : "";
            user = this.formatDomainUsername(user);
            var urlToSend = "/jobs/" + jobId + "/attachments/add?user=" + user + "&storageType=2&f=json" + tokenStr;
            dom.byId('user').value = user;
            this.sendRequestFile(form, urlToSend, function (response) {
                successCallBack(response.attachmentId);
            }, errorCallBack);
        },
        deleteAttachment: function (jobId, attachmentId, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            this.sendRequest(params, "/jobs/" + jobId + "/attachments/" + attachmentId + "/delete", successCallBack, errorCallBack);
        },
        getAttachmentContentURL: function (jobId, attachmentId) {
            var contentURL = this.url + "/jobs/" + jobId + "/attachments/" + attachmentId + "/content?f=file";
            if (this.token) {
                contentURL += "&token=" + this.token;
            }
            if (this.disableClientCaching) {
                contentURL += "&_ts=" + new Date().getTime();
            }
            if (this.proxyURL) {
                contentURL = this.proxyURL + "?" + contentURL;
            }
            return contentURL;
        },
        getHolds: function (jobId, successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "/jobs/" + jobId + "/holds", function (response) {
                var util = new Util();
                for (var i = 0; i < response.holds.length; i++) {
                    response.holds[i].holdDate = util.convertToDate(response.holds[i].holdDate);
                    response.holds[i].releaseDate = util.convertToDate(response.holds[i].releaseDate);
                }
                successCallBack(response.holds);
            }, errorCallBack);
        },
        createHold: function (jobId, holdTypeId, comments, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.type = holdTypeId;
            if (comments != null && comments != "") {
                params.comments = comments;
            }
            this.sendRequest(params, "/jobs/" + jobId + "/holds/create", function (response) {
                successCallBack(response.holdId);
            }, errorCallBack);
        },
        releaseHold: function (jobId, holdId, comments, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            if (comments != null && comments != "") {
                params.comments = comments;
            }
            this.sendRequest(params, "/jobs/" + jobId + "/holds/" + holdId + "/release", successCallBack, errorCallBack);
        },
        getDependencies: function (jobId, successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "/jobs/" + jobId + "/dependencies", function (response) {
                successCallBack(response.dependencies);
            }, errorCallBack);
        },
        createDependency: function (jobId, heldOnType, heldOnValue, depJobId, depOnType, depOnValue, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.heldOnType = heldOnType;
            params.heldOnValue = heldOnValue;
            params.depJobId = depJobId;
            params.depOnType = depOnType;
            params.depOnValue = depOnValue;
            this.sendRequest(params, "/jobs/" + jobId + "/dependencies/create", function (response) {
                successCallBack(response.dependencyId);
            }, errorCallBack);
        },
        deleteDependency: function (jobId, dependencyId, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            this.sendRequest(params, "/jobs/" + jobId + "/dependencies/" + dependencyId + "/delete", successCallBack, errorCallBack);
        },
        getActivityLog: function (jobId, successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "/jobs/" + jobId + "/activity", function (response) {
                var util = new Util();
                for (var i = 0; i < response.activity.length; i++) {
                    response.activity[i].date = util.convertToDate(response.activity[i].date);
                }
                successCallBack(response.activity);
            }, errorCallBack);
        },
        logAction: function (jobId, activityTypeId, comments, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.type = activityTypeId;
            if (comments != null && comments != "") {
                params.comments = comments;
            }
            this.sendRequest(params, "/jobs/" + jobId + "/activity/logAction", successCallBack, errorCallBack);
        },
        getExtendedProperties: function (jobId, successCallBack, errorCallBack) {
            var params = {};
            this.sendRequest(params, "/jobs/" + jobId + "/extendedProperties", function (response) {
                successCallBack(response.containers);
            }, errorCallBack);
        },
        addLinkedRecord: function (jobId, tableName, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            this.sendRequest(params, "/jobs/" + jobId + "/extendedProperties/" + tableName + "/add", function (response) {
                successCallBack(response.recordId);
            }, errorCallBack);
        },
        deleteLinkedRecord: function (jobId, tableName, recordId, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            this.sendRequest(params, "/jobs/" + jobId + "/extendedProperties/" + tableName + "/" + recordId + "/delete", successCallBack, errorCallBack);
        },
        updateRecord: function (jobId, record, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.properties = record.properties;
            this.sendRequest(params, "/jobs/" + jobId + "/extendedProperties/" + record.tableName + "/" + record.recordId + "/update", function (response) {
                successCallBack(response);
            }, errorCallBack);
        },
        listFieldValues: function (jobId, tableName, field, user, successCallBack, errorCallBack) {
            var params = {};
            params.user = this.formatDomainUsername(user);
            params.field = field;
            this.sendRequest(params, "/jobs/" + jobId + "/extendedProperties/" + tableName + "/listValues", function (response) {
                successCallBack(response.values);
            }, errorCallBack);
        },
        listMultiLevelFieldValues: function (jobId, field, previousSelectedValues, user, successCallBack, errorCallBack) {
            var isFillingLastField = false;
            if (field != null 
                && field.displayType == Enum.ExtendedPropertyDisplayType.MULTI_LEVEL_TABLE_LIST)
            {
                var displayFields = field.tableListDisplayField.split(",");
                var numFields = displayFields.length;
                var numFilledFields = (previousSelectedValues ? previousSelectedValues.length : 0);
                if (numFilledFields >= numFields)
                {
                    successCallBack([]);
                    return;
                }
                isFillingLastField = (numFilledFields == numFields - 1);
    
                var subFields = displayFields[numFilledFields];
                if (isFillingLastField)
                {
                    subFields += "," + field.tableListStoreField;
                }
    
                var where = "";
                for (var i = 0; i < numFilledFields; i++)
                {
                    var selected = previousSelectedValues[i];
                    if (selected == null || selected.length == 0)
                    {
                        where += "(" + displayFields[i] + " IS NULL OR " + displayFields[i] + " = '') AND ";
                    }
                    else
                    {
                        where += "(" + displayFields[i] + " = '" + selected + "') AND ";
                    }
                }
                if (where.length > 0)
                {
                    where = where.substring(0, where.length - " AND ".length);
                }
    
                var params = {};
                params.tables = field.tableListClass;
                params.fields = subFields;
                params.where = where;
                if (user != null && user != "") {
                    params.user = this.formatDomainUsername(user);
                }
                this.sendRequest(params, "/jobs/query", function (result) {
                    var uniq = {};
                    var values = []; // of FieldValue
                    var fieldValue;
                    var row;
                    for (var i = 0; i < result.rows.length; i++) {
                        row = result.rows[i];
                        if (isFillingLastField) {
                            fieldValue = {};
                            fieldValue.description = row[0];
                            fieldValue.value = row[1];
                            values.push(fieldValue);
                        } else {
                            // Remove duplicate display values
                            var desc = row[0];
                            if (uniq[desc] == null)
                            {
                                fieldValue = {};
                                fieldValue.description = desc;
                                fieldValue.value = desc;
                                values.push(fieldValue);
                                uniq[desc] = fieldValue;
                            }
                        }
                    }
                    values.sort(function (a,b) {
                        var aDesc = a.description;
                        var bDesc = b.description;
                        if (aDesc == null) return (bDesc == null) ? 0 : 1;
                        if (bDesc == null) return -1;
                        aDesc = aDesc.toLowerCase();
                        bDesc = bDesc.toLowerCase();
                        return aDesc.localeCompare(bDesc);
                    });
                    successCallBack(values);
                }, errorCallBack);
            }
            else
            {
                successCallBack([]);
            }
        },
        queryMultiLevelSelectedValues: function (jobId, field, user, successCallBack, errorCallBack) {
            if (field.data != null 
                && field.displayType == Enum.ExtendedPropertyDisplayType.MULTI_LEVEL_TABLE_LIST)
            {
                var isQuoted = (field.dataType == Enum.FieldType.STRING
                    || field.dataType == Enum.FieldType.GLOBAL_ID
                    || field.dataType == Enum.FieldType.GUID
                );
                var quote = isQuoted ? "'" : "";
    
                var params = {};
                params.tables = field.tableListClass;
                params.fields = field.tableListDisplayField;
                params.where = field.tableListStoreField + " = " + quote + field.data + quote;
                if (user != null && user != "") {
                    params.user = this.formatDomainUsername(user);
                }
                this.sendRequest(params, "/jobs/query", function (result) {
                    var values = [];
                    if (result && result.rows && result.rows.length > 0)
                    {
                        values = result.rows[0];
                    }
                    successCallBack(values);
                }, errorCallBack);
            } else {
                successCallBack([]);
            }
        }
    });
});