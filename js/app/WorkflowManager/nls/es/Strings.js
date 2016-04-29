define({

        loading: {
            loading: "cargando...",
            username: "Nombre de usuario",
            password: "Contraseña",
            login: "Iniciar sesión",
            loginAttempt: "Intentando iniciar sesión..."
        },

        header: {
            title: "ArcGIS Workflow Manager",
            subHeader: "Edición web",
            logout: "Cerrar sesión",
            welcome: "Bienvenido",
            onHold: "El trabajo está en espera. Algunas funciones no están disponibles.",
            closed: "El trabajo está cerrado. Algunas funciones no están disponibles.",
            offline: "El trabajo está actualmente sin conexión. Algunas funciones no están disponibles.",
            navInfo: "{0} de {1}"
        },
        
        common: {
            loading: "Cargando...",
            ok: "Aceptar",
            cancel: "Cancelar",
            error: "Error",
            update: "Actualizar",
            selectOption: "Seleccione una opción"
        },

        filter: {
            initialQueryTitle: "Seleccionar consulta",
            initialReportTitle: "Seleccionar informe",
            initialJobTypeTitle: "Seleccionar tipo de trabajo",
            createNewJob: "Crear nuevo trabajo",
            createJob: "Crear trabajo",
            findJob: "Buscar trabajo",
            queries: "Consultas",
            orFindJob: "o buscar trabajo",
            loadingJobQueries: "Cargando consultas de trabajos...",
            noJobsForThisQuery: "No hay trabajos para esta consulta",
            queryFieldDescriptions: "Id.,Nombre,Tipo de trabajo,Asignado a,Fecha de vencimiento,Descripción",
            queryTypePublic: "Consultas públicas",
            queryTypeUser: "Consultas del usuario",
            reports: "Informes",
            reportWindow: "Abrir en Nueva ventana",
            results: "Resultados de búsqueda",
            uncategorized: "No categorizado"
        },
        
        statistics: {
            title: "Estadísticas",
            assignedTo: "Asignado a",
            categorizedBy: "Categorizado por",
            groupedBy: "Agrupado por",
            jobType: "Tipo de trabajo",
            none: "Ninguno",
            barChart: "Barras",
            pieChart: "Circular",
            reset: "Restablecer",
            select: "Seleccionar",
            selectACategory: "Seleccionar una categoría"
        },
        
        grid: {
            promptDelete: "¿Seguro que desea eliminar los trabajos seleccionados?",
            promptClose: "¿Seguro que desea cerrar los trabajos seleccionados?",
            promptReopen: "¿Está seguro de que desea volver a abrir los trabajos seleccionados?",
            yes: "Sí",
            no: "No",
            closeBtn: "Cerrar",
            closeTitle: "Cerrar trabajos",
            deleteBtn: "Eliminar",
            deleteTitle: "Eliminar trabajos",
            reopenBtn: "Volver a abrir",
            reopenTitle: "Volver a abrir trabajos cerrados",
            numberJobs: "{0} trabajos",
            newJob: "Nuevo trabajo creado"
        },

        properties: {
            title: "Propiedades",
            aoiDefined: "AOI definido",
            aoiUndefined: "AOI no definido",
            loiDefined: "LOI definido",
            loiUndefined: "LOI no definido",
            poiDefined: "POI definido",
            poiUndefined: "POI no definido",
            invalidAssignmentType: "Tipo de asignación no válido",
            jobId: "Id. del trabajo",
            jobName: "Nombre del trabajo",
            jobType: "Tipo de trabajo",
            jobStatus: "Estado del trabajo",
            jobPercentComplete: "% Completo",
            jobAOI: "AOI",
            jobLOI: "LOI",
            jobPOI: "POI",
            jobDataWorkspace: "Espacio de trabajo de datos",
            jobVersion: "Versión",
            jobParentVersion: "Versión principal",
            jobAssignment: "Asignación",
            jobAssignmentUser: "Usuario",
            jobAssignmentGroup: "Grupo",
            jobAssignmentUnassigned: "No asignado",
            jobAssignmentUnknownUser: "Usuario desconocido",
            jobOwner: "Propietario del trabajo",
            jobPriority: "Prioridad",
            jobStartDate: "Fecha de inicio",
            jobDueDate: "Fecha de vencimiento",
            jobDescription: "Descripción del trabajo",
            jobOffline: "Trabajo sin conexión",
            notApplicable: "n/a",
            noDataWorkspace: "Ningún espacio de trabajo de datos",
            noVersion: "No hay versión",
            numberOfJobs: "Número de trabajos",
            resize: "Cambiar tamaño",
            updateSuccessful: "Propiedades actualizadas correctamente."
        },
        
        extendedProperties: {
            title: "Propiedades extendidas",
            noProperties: "No hay propiedades extendidas para este trabajo",
            invalid: "El valor introducido no es válido",
            required: "Campo obligatorio"
        },
        
        notes: {
            title: "Notas",
            jobNote: "Nota sobre el trabajo",
            saveNote: "Guardar nota"
        },
        
        workflow: {
            title: "Flujo de trabajo",
            currentSteps: "Pasos actuales",
            executeStep: "Ejecutar paso",
            markStepComplete: "Marcar el paso como completado",
            recreateWorkflow: "Volver a crear flujo de trabajo",
            promptRecreateWorkflow: "¿Está seguro de que desea volver a crear el flujo de trabajo del trabajo?",
            
            questionNotes: "Notas (opcional)",
            questionResponse: "Respuesta a la pregunta: {0}",
            questionResponseWithNotes: "Respuesta a la pregunta: {0} con Nota: {1}",
            
            selectPrompt: "[Select]",
            selectCurrentStep: "Seleccionar paso actual",
            selectNextStep: "Seleccionar paso siguiente",
                        
            executionComplete: "Ejecución completada",
            executionError: "Error de ejecución",
            executionWarning: "Advertencia de ejecución",
            
            executionResponses: {
                1: "El paso se ha ejecutado correctamente.",
                2: "Depende de un paso en otro trabajo.",
                3: "Depende de una fase en otro trabajo.",
                4: "Depende de un estado en otro trabajo.",
                5: "Bloqueado por un trabajo retenido activo.",
                6: "Depende de un paso anterior en el flujo de trabajo de este trabajo.",
                7: "El paso se ha marcado como completado.",
                8: "El paso está asignado a otro usuario.",
                9: "El paso está asignado a otro grupo."
            },
            
            stepHasJobDependency: "El paso {0} depende de otro trabajo. Algunas funciones no están disponibles."
        },
        
        attachments: {
            title: "Adjuntos",
            action: "Acción",
            add: "Agregar",
            addAttachment: "Agregar adjunto",
            addEmbedAttachTooltip: "Cargar adjunto de archivo integrado",
            addLinkAttachTooltip: "Agregar adjunto de archivo vinculado",
            addURLAttachTooltip: "Agregar adjunto de URL vinculado",
            browser: "Seleccionar archivo",
            embed: "Adjunto de archivo integrado",
            embedLabel: "Seleccione un archivo",
            filename: "Nombre del archivo",
            link: "Adjunto de archivo vinculado",
            linkPrompt: "Introduzca el nombre y la ruta del archivo",
            noAttachments: "No hay datos adjuntos para este trabajo",
            removeAll: "Eliminar todo",
            type: "Tipo",
            upload: "Cargar",
            url: "Adjunto de URL",
            urlPrompt: "Introduzca una URL",
        },

        attachmentItem: {
            noAttachmentType: "Tipo de datos adjuntos desconocido",
            noFilename: "Sin nombre de archivo",
            url: "URL",
            embedded: "Integrado",
            file: "Vinculado",
            open: "Abrir",
            prompt: "Los adjuntos vinculados no se pueden abrir directamente desde esta aplicación. Copie la ruta del archivo a continuación",
            dialogTitle: "Adjunto vinculado"
        },
        
        history: {
            title: "Historia",
            activityType: "Tipo de actividad",
            date: "Fecha",
            message: "Mensaje",
            noActivityForThisJob: "No hay actividad para este trabajo",
            enterComment: "Introducir comentario",
            saveComment: "Guardar comentario",
            user: "Usuario"
        },

        holds: {
            add: "Añadir",
            title: "Retenciones",
            comment: "Comentario",
            holdDate: "Fecha de retención",
            holdType: "Tipo de retención",
            id: "Id.",
            noHoldsForThisJob: "No hay retenciones para este trabajo",
            release: "Liberar",
            releaseComments: "Comentarios de la liberación",
            releasedBy: "Liberado por",
            releaseHold: "Liberar retención",
            saveHold: "Agregar retención",
            type: "Tipo"
        },

        error: {
            title: "Error",
            errorAddingComment: "Error al agregar comentario",
            errorAddingHold: "Error al agregar retención",
            errorCreatingJob: "No se puede crear el trabajo",
            errorCreatingJobAOI: "Error al crear el AOI del trabajo",
            errorCreatingJobLOI: "Error al crear el LOI del trabajo",
            errorCreatingJobPOI: "Error al crear el POI del trabajo",
            errorClosingJob: "No se pueden cerrar todos los trabajos",
            errorDeletingJob: "No se pueden eliminar los trabajos",
            errorDeletingJobAOI: "Error al eliminar el AOI del trabajo",
            errorDeletingJobLOI: "Error al eliminar el LOI del trabajo",
            errorDeletingJobPOI: "Error al eliminar el POI del trabajo",
            errorExecuteStep: "No se puede ejecutar el paso del flujo de trabajo.",
            errorFindingJobsById: "No se pueden encontrar trabajos {0}",
            errorGeneratingReport: "Error generando el informe",
            errorGettingFieldValues: "Error al obtener los valores de campo",
            errorGettingMultiFieldValues: "Error al obtener los valores de campo multilista",
            errorGettingReports: "Error al obtener los informes",
            errorInvalidAuthenticationMode: "Modo de autenticación no válido: {0}",
            errorInvalidFields: "Uno o varios campos no son válidos.",
            errorInvalidUsername: "Nombre de usuario no válido {0}",
            errorLoadingDataWorkspaceDetails: "No se pueden cargar los detalles del área de trabajo de datos",
            errorLoadingGroups: "No se pueden cargar los grupos",
            errorLoadingJobHistory: "No se puede cargar el historial de trabajos",
            errorLoadingJobHolds: "No se pueden cargar las retenciones de trabajos",
            errorLoadingJobIdField: "No se puede cargar el campo de Id. de trabajo desde el servicio de mapas AOI del trabajo",
            errorLoadingJobIdFieldLOI: "No se puede cargar el campo de Id. de trabajo desde el servicio de mapas LOI del trabajo",
            errorLoadingJobIdFieldPOI: "No se puede cargar el campo de Id. de trabajo desde el servicio de mapas POI del trabajo",
            errorLoadingJobTypeDetails: "No se pueden cargar los detalles del tipo de trabajo",
            errorLoadingServiceInfo: "No se puede cargar la información del servicio",
            errorLoadingUsers: "No se pueden cargar los usuarios",
            errorLoadingWorkflowConfiguration: "No se puede cargar la configuración del Workflow Manager: la tarea de la capa AOI o tarea de configuración es nula.",
            errorLoadingWorkflowInfo: "No se puede cargar la información del flujo de trabajo",
            errorMarkAsDone: "No se puede marcar el paso del flujo de trabajo como completado.",
            errorMissingFields: "Faltan uno o varios campos obligatorios.",
            errorMissingHoldType: "Seleccione un tipo de retención.",
            errorMoveNextStep: "No se puede avanzar al siguiente paso del flujo de trabajo.",
            errorNotDomainUser: "Autenticación de dominio habilitada. Introduzca su dominio junto con su nombre de usuario.",
            errorOverlappingJobAOI: "El AOI del trabajo se superpone a otro AOI del trabajo.",
            errorOverlappingJobLOI: "El LOI del trabajo se superpone a otro LOI del trabajo.",
            errorOverlappingJobPOI: "El POI del trabajo se superpone a otro POI del trabajo.",
            errorParsingTokens: "Error al analizar tokens: {0}",
            errorRecreateWorkflow: "No se ha podido volver a crear el flujo de trabajo del trabajo.",
            errorReleasingHold: "Error al liberar la retención",
            errorReopeningClosedJobs: "No se han podido volver a abrir todos los trabajos cerrados",
            errorResolveConflict: "No se puede resolver el conflicto del flujo de trabajo.",
            errorRetrievingAttachments: "Error al recuperar adjuntos",
            errorRetrievingExtendedProperties: "Error al recuperar propiedades extendidas",
            errorRetrievingJobWithJobId: "Error al recuperar los trabajos con Id. de trabajo {0}",
            errorRetrievingUser: "Error al recuperar el usuario {0}",
            errorRetrievingWindowsUser: "Error al recuperar el usuario de Windows.",
            errorRunningQuery: "Error al ejecutar la consulta {0}",
            errorStepNotWebEnabled: "El paso no está configurado para ejecutarse en la Web. Puede ejecutar el paso en el escritorio o contactar con el administrador de su aplicación.",
            errorUnsupportedBrowser: "Navegador no compatible",
            errorUnsupportedBrowserMsg: "El navegador que utiliza no es compatible con ArcGIS Workflow Manager. Descargue la versión más reciente de Internet Explorer.",
            errorUpdatingExtendedProperties: "Error al actualizar propiedades extendidas",
            errorUpdatingJobAOI: "Error al actualizar el AOI del trabajo",
            errorUpdatingJobLOI: "Error al actualizar el LOI del trabajo",
            errorUpdatingJobPOI: "Error al actualizar el POI del trabajo",
            errorUpdatingJobNotes: "Error al actualizar las notas del trabajo",
            errorUpdatingJobProperties: "Error al actualizar las propiedades del trabajo"
            }

    





}); 
