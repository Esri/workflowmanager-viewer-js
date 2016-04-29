define({

        loading: {
            loading: "caricamento in corso...",
            username: "Nome utente",
            password: "Password",
            login: "Accedi",
            loginAttempt: "Tentativo di accesso in corso..."
        },

        header: {
            title: "ArcGIS Workflow Manager",
            subHeader: "Edizione Web",
            logout: "Disconnetti",
            welcome: "Benvenuti",
            onHold: "Il processo è attualmente sospeso, pertanto alcune funzionalità non sono disponibili.",
            closed: "Il processo è attualmente chiuso, pertanto alcune funzionalità non sono disponibili.",
            offline: "Il processo è attualmente offline, pertanto alcune funzionalità non sono disponibili.",
            navInfo: "{0} di {1}"
        },
        
        common: {
            loading: "Caricamento in corso...",
            ok: "OK",
            cancel: "Annulla",
            error: "Errore",
            update: "Aggiorna",
            selectOption: "Selezionare un'opzione"
        },

        filter: {
            initialQueryTitle: "Seleziona interrogazione",
            initialReportTitle: "Seleziona report",
            initialJobTypeTitle: "Seleziona tipo di processo",
            createNewJob: "Crea nuovo processo",
            createJob: "Crea job",
            findJob: "Trova processo",
            queries: "Interrogazioni",
            orFindJob: "o trova processo",
            loadingJobQueries: "Caricamento interrogazioni processo in corso...",
            noJobsForThisQuery: "Nessun processo per questa interrogazione",
            queryFieldDescriptions: "ID,nome,tipo processo,assegnato a,scadenza,descrizione",
            queryTypePublic: "Interrogazioni pubbliche",
            queryTypeUser: "Interrogazioni utente",
            reports: "Report",
            reportWindow: "Apri in nuova finestra",
            results: "Risultati della ricerca",
            uncategorized: "Senza categoria"
        },
        
        statistics: {
            title: "Statistiche",
            assignedTo: "Assegnata a",
            categorizedBy: "Suddivisione in categorie per",
            groupedBy: "Raggruppamento per",
            jobType: "Tipo processo",
            none: "Nessuno",
            barChart: "Barra",
            pieChart: "Torta",
            reset: "Reimposta",
            select: "Seleziona",
            selectACategory: "Selezionare una categoria"
        },
        
        grid: {
            promptDelete: "Eliminare i processi selezionati?",
            promptClose: "Chiudere i processi selezionati?",
            promptReopen: "Riaprire i processi selezionati?",
            yes: "Sì",
            no: "No",
            closeBtn: "Chiudi",
            closeTitle: "Chiudi processi",
            deleteBtn: "Elimina",
            deleteTitle: "Elimina processi",
            reopenBtn: "Riapri",
            reopenTitle: "Riapri processi chiusi",
            numberJobs: "{0} processi",
            newJob: "Nuovo processo creato"
        },

        properties: {
            title: "Proprietà",
            aoiDefined: "AOI definita",
            aoiUndefined: "AOI non definita",
            loiDefined: "LOI definita",
            loiUndefined: "LOI non definita",
            poiDefined: "POI definita",
            poiUndefined: "POI non definita",
            invalidAssignmentType: "Tipo di assegnazione non valido",
            jobId: "ID processo",
            jobName: "Nome processo",
            jobType: "Tipo processo",
            jobStatus: "Stato processo",
            jobPercentComplete: "% completamento",
            jobAOI: "AOI",
            jobLOI: "LOI",
            jobPOI: "Punto di interesse",
            jobDataWorkspace: "Workspace dati",
            jobVersion: "Versione",
            jobParentVersion: "Versione padre",
            jobAssignment: "Assegnazione",
            jobAssignmentUser: "Utente",
            jobAssignmentGroup: "Gruppo",
            jobAssignmentUnassigned: "Non assegnato",
            jobAssignmentUnknownUser: "Utente sconosciuto",
            jobOwner: "Proprietario processo",
            jobPriority: "Priorità",
            jobStartDate: "Data di inizio",
            jobDueDate: "Scadenza",
            jobDescription: "Descrizione processo",
            jobOffline: "Processo offline",
            notApplicable: "n/d",
            noDataWorkspace: "Nessun workspace dati",
            noVersion: "Nessuna versione",
            numberOfJobs: "Numero di processi",
            resize: "Ridimensiona",
            updateSuccessful: "Aggiornamento delle proprietà completato."
        },
        
        extendedProperties: {
            title: "Proprietà estese",
            noProperties: "Nessuna proprietà estesa per questo processo",
            invalid: "Il valore immesso non è valido",
            required: "Campo obbligatorio"
        },
        
        notes: {
            title: "Note",
            jobNote: "Nota processo",
            saveNote: "Salva nota"
        },
        
        workflow: {
            title: "Flusso di lavoro",
            currentSteps: "Passi correnti",
            executeStep: "Esegui passo",
            markStepComplete: "Contrassegna passo come completato",
            recreateWorkflow: "Ricrea flusso di lavoro",
            promptRecreateWorkflow: "Ricreare il flusso di lavoro del processo?",
            
            questionNotes: "Note (facoltativo)",
            questionResponse: "Risposta domanda: {0}",
            questionResponseWithNotes: "Risposta alla domanda: {0} con nota: {1}",
            
            selectPrompt: "[Seleziona]",
            selectCurrentStep: "Seleziona passaggio corrente",
            selectNextStep: "Selezionare il passo successivo",
                        
            executionComplete: "Esecuzione completata",
            executionError: "Errore di esecuzione",
            executionWarning: "Avviso su esecuzione",
            
            executionResponses: {
                1: "Esecuzione del passaggio completata.",
                2: "Dipende da un passaggio in un altro processo.",
                3: "Dipende da una fase in un altro processo.",
                4: "Dipende da uno stato in un altro processo.",
                5: "Bloccato da una sospensione processi attiva.",
                6: "Dipende da un passaggio precedente nel flusso di lavoro di questo processo.",
                7: "Il passaggio è stato contrassegnato come completato.",
                8: "Il passaggio è assegnato a un altro utente.",
                9: "Il passaggio è assegnato a un altro gruppo."
            },
            
            stepHasJobDependency: "Il passo {0} ha una dipendenza da un altro processo. Alcune funzionalità non sono disponibili."
        },
        
        attachments: {
            title: "Allegati",
            action: "Azione",
            add: "Aggiungi",
            addAttachment: "Aggiungi allegato",
            addEmbedAttachTooltip: "Carica un allegato di file integrato",
            addLinkAttachTooltip: "Aggiungi un allegato di file collegato",
            addURLAttachTooltip: "Aggiungi un allegato di URL collegato",
            browser: "Scegliere un file",
            embed: "Allegato di file integrato",
            embedLabel: "Seleziona file",
            filename: "Nome file",
            link: "Allegato di file collegato",
            linkPrompt: "Immettere un percorso e un nome di file",
            noAttachments: "Nessun allegato per questo processo",
            removeAll: "Elimina tutto",
            type: "Tipo",
            upload: "Carica",
            url: "Allegato URL",
            urlPrompt: "Immettere un URL",
        },

        attachmentItem: {
            noAttachmentType: "Tipo di allegato sconosciuto",
            noFilename: "Nessun nome file",
            url: "URL",
            embedded: "Integrato",
            file: "Collegato",
            open: "Apri",
            prompt: "Gli allegati collegati non possono essere aperti direttamente da questa applicazione. Copiare il percorso di file sottostante",
            dialogTitle: "Allegato collegato"
        },
        
        history: {
            title: "Cronologia",
            activityType: "Tipo attività",
            date: "Data",
            message: "Messaggio",
            noActivityForThisJob: "Nessuna attività per questo processo",
            enterComment: "Immetti commento",
            saveComment: "Salva commento",
            user: "Utente"
        },

        holds: {
            add: "Aggiungi",
            title: "Sospensioni",
            comment: "Commento",
            holdDate: "Data sospensione",
            holdType: "Tipo di sospensione",
            id: "ID",
            noHoldsForThisJob: "Nessuna sospensione per questo processo",
            release: "Rilascia",
            releaseComments: "Commenti rilascio",
            releasedBy: "Rilasciato da",
            releaseHold: "Rilascia sospensione",
            saveHold: "Aggiungi sospensione",
            type: "Tipo"
        },

        error: {
            title: "Errore",
            errorAddingComment: "Errore durante l\'aggiunta del commento",
            errorAddingHold: "Errore durante l\'aggiunta della sospensione",
            errorCreatingJob: "Impossibile creare il processo",
            errorCreatingJobAOI: "Errore durante la creazione della AOI del processo",
            errorCreatingJobLOI: "Errore durante la creazione della LOI del processo",
            errorCreatingJobPOI: "Errore durante la creazione della POI del processo",
            errorClosingJob: "Impossibile chiudere tutti i processi",
            errorDeletingJob: "Impossibile eliminare i processi",
            errorDeletingJobAOI: "Errore durante l\'eliminazione della AOI del processo",
            errorDeletingJobLOI: "Errore durante l\'eliminazione della LOI del processo",
            errorDeletingJobPOI: "Errore durante l\'eliminazione della POI del processo",
            errorExecuteStep: "Impossibile eseguire il passo del flusso di lavoro.",
            errorFindingJobsById: "Impossibile trovare i processi: {0}",
            errorGeneratingReport: "Errore durante la generazione del rapporto",
            errorGettingFieldValues: "Errore nel recupero dei valori di campo",
            errorGettingMultiFieldValues: "Errore nel recupero dei valori di campo multielenco",
            errorGettingReports: "Errore di recupero report",
            errorInvalidAuthenticationMode: "Modalità di autenticazione non valida: {0}",
            errorInvalidFields: "Uno o più campi non validi.",
            errorInvalidUsername: "Nome utente {0} non valido",
            errorLoadingDataWorkspaceDetails: "Impossibile caricare i dettagli del workspace dati",
            errorLoadingGroups: "Impossibile caricare i gruppi",
            errorLoadingJobHistory: "Impossibile caricare la cronologia processi",
            errorLoadingJobHolds: "Impossibile caricare le sospensioni processo",
            errorLoadingJobIdField: "Impossibile caricare il campo ID processo dal map service AOI del processo",
            errorLoadingJobIdFieldLOI: "Impossibile caricare il campo ID processo dal map service LOI del processo",
            errorLoadingJobIdFieldPOI: "Impossibile caricare il campo ID processo dal map service POI del processo",
            errorLoadingJobTypeDetails: "Impossibile caricare i dettagli del tipo di processo",
            errorLoadingServiceInfo: "Impossibile caricare le informazioni sul servizio",
            errorLoadingUsers: "Impossibile caricare gli utenti",
            errorLoadingWorkflowConfiguration: "Impossibile caricare configurazione di Workflow Manager: l\'attività o l\'attività di configurazione del layer AOI è null",
            errorLoadingWorkflowInfo: "Impossibile caricare le informazioni sul flusso di lavoro",
            errorMarkAsDone: "Impossibile contrassegnare come completato il passo del flusso di lavoro.",
            errorMissingFields: "Mancano uno o più campi obbligatori.",
            errorMissingHoldType: "Selezionare un tipo di sospensione.",
            errorMoveNextStep: "Impossibile continuare con il passo successivo del flusso di lavoro.",
            errorNotDomainUser: "Autenticazione dominio abilitata. Immettere il dominio insieme al nome utente.",
            errorOverlappingJobAOI: "AOI processo sovrascrive un altro AOI.",
            errorOverlappingJobLOI: "LOI processo sovrascrive un altro LOI.",
            errorOverlappingJobPOI: "POI processo sovrascrive un altro POI.",
            errorParsingTokens: "Errore durante l\'analisi dei token: {0}",
            errorRecreateWorkflow: "Impossibile ricreare il flusso di lavoro del processo.",
            errorReleasingHold: "Errore di rilascio sospensione",
            errorReopeningClosedJobs: "Impossibile riaprire tutti i processi chiusi",
            errorResolveConflict: "Impossibile risolvere il conflitto del flusso di lavoro.",
            errorRetrievingAttachments: "Errore nel recupero degli allegati",
            errorRetrievingExtendedProperties: "Errore nel recupero delle proprietà estese",
            errorRetrievingJobWithJobId: "Errore durante il recupero dei processi con ID {0}",
            errorRetrievingUser: "Errore durante il recupero dell\'utente {0}",
            errorRetrievingWindowsUser: "Errore nel recupero dell\'utente Windows.",
            errorRunningQuery: "Errore durante l\'esecuzione dell\'interrogazione {0}",
            errorStepNotWebEnabled: "Passo non configurato per l'esecuzione sul Web. Eseguirlo sul desktop o contattare l'amministratore dell'applicazione.",
            errorUnsupportedBrowser: "Browser non supportato",
            errorUnsupportedBrowserMsg: "Il browser in uso non è supportato in ArcGIS Workflow Manager. Scaricare la versione più recente di Internet Explorer.",
            errorUpdatingExtendedProperties: "Errore nell\'aggiornamento delle proprietà estese",
            errorUpdatingJobAOI: "Errore durante l\'aggiornamento della AOI del processo",
            errorUpdatingJobLOI: "Errore durante l\'aggiornamento della LOI del processo",
            errorUpdatingJobPOI: "Errore durante l\'aggiornamento della POI del processo",
            errorUpdatingJobNotes: "Errore durante l\'aggiornamento delle note del processo",
            errorUpdatingJobProperties: "Errore durante l\'aggiornamento delle proprietà del processo"
            }

    





}); 
