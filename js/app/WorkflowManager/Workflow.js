define([
    "dojo/topic",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./templates/Workflow.html",
    "dojo/i18n!./nls/Strings",
    "app/WorkflowManager/config/Topics",
    
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/connect",
    "dojo/parser",
    "dojo/query",
    "dojo/on",
    "dojo/store/Memory",
    "dojo/dom-style",
    "dijit/registry",
    
    "dijit/Dialog",
    "dijit/form/FilteringSelect",
    "dijit/form/TextBox",
    "dijit/form/Textarea",
    "dijit/form/Button",
    "dijit/form/DropDownButton",
    
    "workflowmanager/Enum",    
    "./utils/URLUtil",
    "./Alert"
    ],

function (
    topic, declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, 
    template, i18n, appTopics,
    arrayUtil, lang, connect, parser, query, on, Memory, domStyle, registry,
    Dialog, FilteringSelect, TextBox, Textarea, Button, DropDownButton,
    Enum, URLUtil, Alert) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        
        templateString: template,
        widgetsInTemplate: true,
        
        //i18n
        i18n_Ok: i18n.common.ok,
        i18n_Cancel: i18n.common.cancel,
        i18n_CurrentSteps: i18n.workflow.currentSteps,
        i18n_QuestionNotes: i18n.workflow.questionNotes,
        i18n_SelectNextStep: i18n.workflow.selectNextStep,
        i18n_RecreateWorkflow: i18n.workflow.recreateWorkflow,
        i18n_PromptRecreateWorkflow: i18n.workflow.promptRecreateWorkflow,
        
        wmWorkflowTask: null,
        wmJobTask: null,
        wmTokenTask: null,
        commentActivityType: null,
        
        currentUser: null,
        canRecreateWorkflow: null,

        currentJob: null,
        currentStep: null,
        currentSteps: null,        
        optionSteps: null,  // a comma-separated list of the step IDs of all the possible next steps (for Resolve Conflict use)
        
        // Question step input types
        questionStepInputType: {
            BUTTON: 0,
            DROPDOWN: 1            
        },
        
        constructor: function () {
        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            console.log("Workflow started");
            
            // Execute step button
            this.workflowExecuteStepButton = new Button({
                label: i18n.workflow.executeStep,
                id: "workflowExecuteStepButton",
                name: "workflowExecuteStepButton",
                disabled: true,
                "class": "wide-btn dojo-btn-info",
                onClick: lang.hitch(this, function () {
                    this.executeStepButtonClicked();
                })
            }, this.btnExecuteStep);
            this.workflowExecuteStepButton.startup();

            // Mark step complete button
            this.workflowMarkStepCompleteButton = new Button({
                label: i18n.workflow.markStepComplete,
                id: "workflowMarkStepCompleteButton",
                name: "workflowMarkStepCompleteButton",
                disabled: true,
                "class": "wide-btn dojo-btn-success",
                onClick: lang.hitch(this, function () {
                    this.markStepCompleteButtonClicked();
                })
            }, this.btnMarkStepComplete);
            this.workflowMarkStepCompleteButton.startup();
            
            // Recreate workflow button
            this.workflowRecreateWorkflowButton = new Button({
                label: i18n.workflow.recreateWorkflow,
                id: "workflowRecreateWorkflowButton",
                name: "workflowRecreateWorkflowButton",
                disabled: true,
                "class": "wide-btn dojo-btn-danger",
                onClick: lang.hitch(this, function () {
                    recreateWorkflowDialog.show();
                })
            }, this.btnRecreateWorkflow);
            this.workflowRecreateWorkflowButton.startup();
            
            //Question step drop down selection
            this.questionStepsSelect = new FilteringSelect({
                placeHolder: i18n.common.loading,
                id: "questionStepsSelect",
                name: "questionStepsSelect"
            }, this.cboQuestionSteps);
            this.questionStepsSelect.startup();
            
            //Question step notes input text area
            this.stepNotesTextarea = new Textarea({
                id: "stepNotesTextarea",
                name: "stepNotesTextarea",
            }, this.questionStepNotesTextarea);
            this.stepNotesTextarea.startup();

            //Current step drop down selection (parallel execution)
            this.currentStepSelect = new FilteringSelect({
                placeHolder: i18n.common.loading,
                id: "currentStepSelect",
                name: "currentStepSelect",
                onClick: lang.hitch(this, function () {
                    this.setCurrentStep();
                })
            }, this.cboCurrentStepSelect);
            this.currentStepSelect.startup();            
            
            //Step conflict drop down selection
            this.stepConflictsSelect = new FilteringSelect({
                placeHolder: i18n.common.loading,
                id: "stepConflictsSelect",
                name: "stepConflictsSelect"
            }, this.cboStepConflictsSelect);
            this.stepConflictsSelect.startup();            
        },
        
        initializeProperties: function (args) {
            this.wmWorkflowTask = args.workflowTask;
            this.wmjobTask = args.jobTask;
            this.wmTokenTask = args.tokenTask;
            this.commentActivityType = args.commentActivityType;
            this.currentUser = args.currentUser;
            this.currentJob = args.currentJob;
            this.canRecreateWorkflow = args.canRecreateWorkflow;
        },
        
        initializeWorkflow: function() {
            // Reset fields and disable items
            this.currentStepStatus.style.display = "none";
            this.currentStepDiv.style.display = "none";
            this.workflowCurrentStepName.innerHTML = "";
            this.workflowCurrentStepName.style.display = "none";
            this.currentStepSelectWrapper.style.display = "none";
            this.workflowExecuteStepButton.set("disabled", true);
            this.workflowMarkStepCompleteButton.set("disabled", true);
            this.workflowRecreateWorkflowButton.set("disabled", !this.canRecreateWorkflow);
            this.workflowImageContainer.src = "";

            if (this.currentJob == null) {
                console.log("Unable to load workflow for null job");
                return;
            }
            this.loadWorkflow();
        },
        
        loadWorkflow: function() {
            // Retrieve workflow steps and image
            this.loadWorkflowControl();
            this.loadWorkflowImage();
            topic.publish(appTopics.manager.hideProgress, this); 
        },
        
        loadWorkflowControl: function () {
            if ((this.currentJob.stage != Enum.JobStage.CLOSED)
                && (this.currentJob.assignedType == Enum.JobAssignmentType.ASSIGNED_TO_USER)
                && (this.currentJob.assignedTo == this.currentUser)) {
                    
                if (this.wmWorkflowTask == null) {                   
                    console.log("Unable to load workflow.  Workflow properties not initialized.");
                    return;        
                }
                var self = lang.hitch(this);
                this.wmWorkflowTask.getCurrentSteps(this.currentJob.id, 
                    function(data) {
                        self.getCurrentStepsHandler(data);
                    }, 
                    function (error) {
                        self.showError(i18n.error.title, i18n.error.errorLoadingWorkflowInfo, error);
                    });
            }
        },
        
        loadWorkflowImage: function () {
            var urlString = this.wmWorkflowTask.getWorkflowImageURL(this.currentJob.id);
            this.workflowImageContainer.src = urlString;
        },
        
        getCurrentStepsHandler: function(steps) {
            this.currentSteps = steps;
                                
            if (steps.length == 1) {
                // one current step
                this.currentSteps = steps;
                this.currentStep = steps[0];
                this.checkCurrentStep();
            } else if (steps.length > 1) {
                // multiple current steps
                this.currentSteps = steps;
                this.currentStep = steps[0];
                this.checkMultiSteps();
            } else if (steps.length == 0) {
                // no current step
                this.currentStepStatus.style.display = "none";
                this.currentStepDiv.style.display = "none";
            }
        },
        
        checkCurrentStep: function () {
            var self = lang.hitch(this);
            var stepData = this.currentStep;
            var stepId = stepData.id;
            this.wmWorkflowTask.canRunStep(this.currentJob.id, stepId, this.currentUser, lang.hitch(this, 
                function (data) {
                    self.canRunStepHandler(data);
                }),
                function (error) {
                    self.showError(i18n.error.title, i18n.error.errorLoadingWorkflowInfo, error);
                });                
        },
        
        canRunStepHandler: function (canRun) {
            
            this.currentStepStatus.style.display = "none";
            this.currentStepDiv.style.display = "none";
            
            if (canRun == Enum.StepRunnableStatus.CAN_RUN) {
                var stepData = this.currentStep;
            
                this.currentStepDiv.style.display = "block";
                this.workflowCurrentStepName.innerHTML = stepData.name;
                this.workflowCurrentStepName.style.display = "block";
                this.currentStepSelectWrapper.style.display = "none";
                this.workflowExecuteStepButton.set("disabled", true);
                this.workflowMarkStepCompleteButton.set("disabled", true);
            
                if (stepData.stepType.executionType == Enum.StepExecutionType.PROCEDURAL) {// when execution type is procedual
                    this.workflowMarkStepCompleteButton.set("disabled", false);
                    if (stepData.autoRun) {
                        this.workflowExecuteStepButton.set("disabled", false);
                    }
                } else {// when execution type is NOT procedual
                    if (stepData.canSkip) {
                        this.workflowMarkStepCompleteButton.set("disabled", false);
                    } else if (stepData.hasBeenExecuted) {
                        this.workflowMarkStepCompleteButton.set("disabled", false);
                    }
                    this.workflowExecuteStepButton.set("disabled", false);
                }
            }
            else
            {
                console.log("Unable to run step: " + this.currentStep.name + ", runnableStatus = " +  canRun);

                // Check for job dependencies                
                if (canRun == Enum.StepRunnableStatus.DEPENDENT_ON_STEP || canRun == Enum.StepRunnableStatus.DEPENDENT_ON_STAGE 
                    || canRun == Enum.StepRunnableStatus.DEPENDENT_ON_STATUS || canRun == Enum.StepRunnableStatus.DEPENDENT_ON_JOB)
                {
                    this.currentStepStatus.style.display = "block";
                    this.currentStepStatusMessage.innerHTML = i18n.workflow.stepHasJobDependency.replace("{0}", this.currentStep.name);
                }
            }
        },
        
        checkMultiSteps: function () {
            this.currentStepStatus.style.display = "none";
            this.currentStepDiv.style.display = "block";
            this.workflowCurrentStepName.style.display = "none";
            this.currentStepSelectWrapper.style.display = "block";
            this.workflowExecuteStepButton.set("disabled", true);
            this.workflowMarkStepCompleteButton.set("disabled", true);
            
            var newStore = new Memory();
            var firstOption = {id: -1, name: i18n.workflow.selectPrompt};
            newStore.put(firstOption);
            
            dojo.forEach(this.currentSteps, function(step){
                if(step !== null){
                    var stepItem = {id: step.id, name: step.name};
                    newStore.put(stepItem); // add to memory store
                }
            });
            this.currentStepSelect.set("store", newStore);
            this.currentStepSelect.set("value", firstOption.id);  // by default select first item
        },
        
        setCurrentStep: function () {
            var selectID = this.currentStepSelect.value;
            if (selectID != -1) {
               dojo.forEach(this.currentSteps, function(step){
                    if (selectID == step.id) {
                        this.currentStep = step;
                    }
                });
                this.checkCurrentStep();
            } else {
                this.workflowExecuteStepButton.set("disabled", true);
                this.workflowMarkStepCompleteButton.set("disabled", true);
            }
        },
        
        executeStepsHandler: function(executeInfo) {
            var response = executeInfo[0].executionResult;
                                      
            if (response == 1) {
                // execution successful
                if (executeInfo[0].threwError) {
                    // show error if it occurs when executing current step
                    this.showError(i18n.error.title, executeInfo[0].errorDescription, null);
                }
                this.loadWorkflow();
            } else {
                // execution unsuccessful
                this.showError(i18n.error.title, i18n.workflow.executionResponses.response, null);
            }
        },
        
        executeStepButtonClicked : function () {
            var self = lang.hitch(this);

            topic.publish(appTopics.manager.showProgress, this);           
            console.log("Executing step: " + this.currentStep.name);
            var platform = this.currentStep.stepType.supportedPlatform;
            if (platform == Enum.StepPlatformType.DESKTOP) {
                console.log(i18n.workflow.executionWarning + ": " + i18n.error.errorStepNotWebEnabled);
                this.showError(i18n.workflow.executionWarning, i18n.error.errorStepNotWebEnabled, null);              
            } else {
                var exeType = this.currentStep.stepType.executionType;
                
                // Execute certain step types on the server (essentially anything but questions).
                // This is necessary in order to record that a step has been executed.
                switch (exeType) {
                    case Enum.StepExecutionType.PROCEDURAL:  //procedual step will never have run button enabled
                        if (!this.currentStep.autoRun)          
                            break;
                    case Enum.StepExecutionType.EXECUTABLE:
                    case Enum.StepExecutionType.FUNCTION:
                    case Enum.StepExecutionType.FILE:
                    case Enum.StepExecutionType.URL:  
                        var stepIds = new Array();
                        stepIds[0] = this.currentStep.id;
                        this.wmWorkflowTask.executeSteps(this.currentJob.id, stepIds, this.currentUser, true,
                            function (data) {
                                self.executeStepsHandler(data);                                
                            },
                            function (error) {
                                self.showError(i18n.error.title, i18n.error.errorExecuteStep, error);
                            });
                        break;
                }
                     
                // Handle client-side execution of certain step types
                switch (exeType) {
                    case Enum.StepExecutionType.QUESTION:
                        this.popupQuestion();
                        break;
                    case Enum.StepExecutionType.FILE:   // open file in a new window
                        var fileURL = this.wmWorkflowTask.getStepFileURL(this.currentJob.id, this.currentStep.id);
                        window.open(fileURL, "_blank");
                        topic.publish(appTopics.manager.hideProgress, this);  
                        break;
                    case Enum.StepExecutionType.URL:  // open URL in a new window  
                        var url = this.currentStep.stepType.program;
                        this.parseURLToken(url);
                        topic.publish(appTopics.manager.hideProgress, this);  
                        break;
                }
            }
        },
        
        parseURLToken: function (urlToParse) {
            var self = lang.hitch(this);
            self.wmTokenTask.parseTokens(
                self.currentJob.id,
                urlToParse,
                self.currentUser,
                function(result) {
                    self.openURL(result);
                },
                function(error) {
                    // The parseToken request failed, open the URL as-is.
                    // (server versions prior to 10.1 SP1 do not have the parseToken request)
                    self.openURL(urlToParse);
                }
            )
        },
        
        openURL: function (url) {
            var urlPath = URLUtil.getAbsolutePathURL(url);
            window.open(urlPath, "_blank");
        },
        
        markStepCompleteButtonClicked: function () {
            var self = lang.hitch(this);
            console.log("Mark step complete button clicked");            
            topic.publish(appTopics.manager.showProgress, this);

            var stepIds = new Array();
            stepIds[0] = this.currentStep.id;
         
            this.wmWorkflowTask.markStepsAsDone(this.currentJob.id, stepIds, this.currentUser,
                function (executeInfo) {
                    if (executeInfo[0].hasConflicts) {
                        self.showConflictDialog(executeInfo[0].conflicts);
                    } else {    // no conflicts
                        self.loadWorkflow();
                    }
                },
                function (error) {
                    self.showError(i18n.error.title, i18n.error.errorMarkAsDone, error);
                }
            );
        },
        
        recreateWorkflow: function () {
            console.log("Recreate workflow button clicked");            
            var self = lang.hitch(this);
            recreateWorkflowDialog.hide();
            topic.publish(appTopics.manager.showProgress, this);
         
            this.wmWorkflowTask.recreateWorkflow(this.currentJob.id, this.currentUser,
                function (data) {
                    self.loadWorkflow();
                },
                function (error) {
                    self.showError(i18n.error.title, i18n.error.errorRecreateWorkflow, error);
                }
            );
        },        

        popupQuestion: function() {
            var programArray = this.currentStep.stepType.program.split("|");
            var question = "";
            var title = "";
            var inputType = this.questionStepInputType.BUTTON;
            var collectNotes = false;
            
            if (programArray.length > 0) {
                question = programArray[0];
            }
            if (programArray.length > 1) {
                title = programArray[1];
            }
            if (programArray.length > 2) {
                if (programArray[2] == "dd") {
                    inputType = this.questionStepInputType.DROPDOWN;
                }
            }
            if (programArray.length > 3) {
                if (programArray[3] == "note") {
                    collectNotes = true;
                }
            }
            
            var answers = [];
            var answerList = this.currentStep.stepType.arguments.split("|");
            for (var i = 0; i < answerList.length; i++) {
                var answerParts = answerList[i].split(":");
                if (answerParts.length == 1) {
                    answers.push({ name: answerParts[0], code: i });
                } else if (answerParts.length >= 2) {
                    answers.push({ name: answerParts[0], code: parseInt(answerParts[1]) });
                }
            }
            
            this.lastQuestionAnswers = answers;
            this.lastQuestionCollectNotes = collectNotes;
            this.showQuestionDialog(title, question, inputType, answers, collectNotes);
        },
        
        showQuestionDialog: function(title, question, inputType, answers, collectNotes){
            
            this.questionStepMessage.innerHTML = question;
            questionStepDialog.set("title", title);

            if (inputType == this.questionStepInputType.DROPDOWN) {
                this.questionStepDropdownWrapper.style.display = "block";
                this.questionStepActionBar.style.display = "block";
                dojo.empty(this.questionStepButtonWrapper);

                if (answers && answers.length > 0) {
                    this.questionStepsSelect.set("store", new Memory({ data: answers, idProperty: "code" }));
                    this.questionStepsSelect.set("value", answers[0].code);  // by default select first item                                    
                }
                else {
                    this.questionStepsSelect.set("store", new Memory());
                }
            }
            else if (inputType == this.questionStepInputType.BUTTON) {
                this.questionStepDropdownWrapper.style.display = "none";              
                this.questionStepActionBar.style.display = "none";
                dojo.empty(this.questionStepButtonWrapper);

                if (answers && answers.length > 0) {
                    
                    dojo.forEach(answers, lang.hitch(this, function(answer, i){
                        if (answer != null) {
                            
                            var newButton = new Button({
                                label: answer.name,
                                onClick: lang.hitch(this, function () {
                                    questionStepDialog.hide();
                                    this.moveToNextStep(i);
                                }) 
                            }); 
                            // place the button item into the dom
                            newButton.placeAt(this.questionStepButtonWrapper);                           
                        }
                    }));
                }                
            }
            
            if (collectNotes) {
                this.questionNotesDiv.style.display = "block";
                this.questionStepNotesTextarea = "";
            }
            else {
                // no question notes
                this.questionNotesDiv.style.display = "none";
                this.questionStepNotesTextarea = "";              
            }
            questionStepDialog.show();
            topic.publish(appTopics.manager.hideProgress, this);
        },

        questionStepHandler: function() {
            topic.publish(appTopics.manager.showProgress, this);
            var selectedOptionId = this.questionStepsSelect.get("value");
            questionStepDialog.hide();
            this.moveToNextStep(selectedOptionId);        
        },
        
        moveToNextStep: function (answerIndex) {
            var self = lang.hitch(this);
            
            var notes = null;
            if (this.lastQuestionCollectNotes) {              
                notes = this.stepNotesTextarea.value;
                this.stepNotesTextarea.value = "";
            }
    
            answerIndex = parseInt(answerIndex);
            if (this.lastQuestionAnswers == null || answerIndex < 0 || answerIndex >= this.lastQuestionAnswers.length) {
                return;
            }
            var answer = this.lastQuestionAnswers[answerIndex];
            var returnCode = answer.code;
            var answerLabel = answer.name;
    
            if (answerLabel != null) {
                // Log a comment with the question response
                var comment = "";
                if (notes && notes.length > 0) {
                    comment = i18n.workflow.questionResponseWithNotes.replace("{0}", answerLabel).replace("{1}", notes);
                } else {                   
                    comment = i18n.workflow.questionResponse.replace("{0}", answerLabel);
                }
                this.wmjobTask.logAction(this.currentJob.id, this.commentActivityType, comment, this.currentUser,
                    function(data) {
                        self.moveNext(returnCode);
                    },
                    function(error) {
                        self.moveNext(returnCode);
                    }
                ); 
            } else {
                this.moveNext(returnCode);
            }
        },
        
        moveNext: function (returnCode) {
            var self = lang.hitch(this);
            // if selfCheck is false, cannot proceed to next step
            if (this.currentStep.selfCheck == true) {
                this.wmWorkflowTask.moveToNextStep(this.currentJob.id, this.currentStep.id, returnCode, this.currentUser,
                    function (data) {
                        self.loadWorkflow();
                    },
                    function (error) {
                        self.showError(i18n.error.title, i18n.error.errorMoveNextStep, error);
                    }
                );
            } else {
                topic.publish(appTopics.manager.hideProgress, this);
            }
        },

        showConflictDialog: function (conflicts) {
            // TODO What is conflicts.canSpawnConcurrency (look at function createConflictPopUp() for example)

            if (!this.currentStep.canSpawnConcurrency) {    // when concurrency is not allowed, show each next step as a seperate option
                var newStore = new Memory();
                var firstOption = null;
                dojo.forEach(conflicts.options, function(option){
                    if(option !== null){
                        
                        var stepItem = {id: option.steps[0].id, name: option.steps[0].name, returnCode: option.returnCode};
                        if (firstOption == null)
                            firstOption = stepItem;
                        newStore.put(stepItem); // add to memory store
                    }
                });
                
                this.stepConflictsSelect.set("store", newStore);
                if (firstOption != null)
                    this.stepConflictsSelect.set("value", firstOption.id);  // by default select first item    
            }
            else {  // when concurrency is allowed, show each group of current steps as a seperate option
                
                // TODO How to reproduce this case?
                
                /*
                $.each(conflicts, function (i, item) {
                message += "<option value='" + item.returnCode + "'>";
                var num = item.steps.length - 1;
                $.each(item.steps, function (j, step) {
                    if (j < num) {
                        message += step.name + " + ";
                        wm.wmWorkflow.optionSteps += step.id + ",";
                    } else {
                        message += step.name;
                        wm.wmWorkflow.optionSteps += step.id;
                    }
                });
                message += "</option>";
            });

                 */
            }
            stepConflictDialog.show();
            topic.publish(appTopics.manager.hideProgress, this);
        },

        // Called from workflow step conflict dialog
        resolveConflict: function() {
            var self = lang.hitch(this);
            stepConflictDialog.hide();
            
            // User has selected the next step
            var selectedOptionId = this.stepConflictsSelect.get("value");
            
            var store = this.stepConflictsSelect.get("store");
            var selectedOption = store.get(selectedOptionId);
            var returnCode = selectedOption.returnCode;
            
            var optionSteps;
            if (!this.currentStep.canSpawnConcurrency) { 
                // when concurrency is not allowed, choose only one step
                optionSteps = selectedOptionId;
            } else { 
                // when concurrency is allowed, choose all the concurrent steps
                optionSteps = this.optionSteps;
            }
            
            topic.publish(appTopics.manager.showProgress, this);  
            this.wmWorkflowTask.resolveConflict(this.currentJob.id, this.currentStep.id, returnCode, optionSteps, this.currentUser,
                function (data) {
                    self.loadWorkflow();
                },
                function (error) {
                    self.showError(i18n.error.title, i18n.error.errorResolveConflict, error);
                }
            );
        },
        
        showError: function(title, message, error) {
            topic.publish(appTopics.manager.hideProgress, this); 
            if (title == null)
                title = i18n.error.title;
            Alert.show(title, message, error);
        }
    });
});