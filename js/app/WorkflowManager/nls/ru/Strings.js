define({

        loading: {
            loading: "загрузка...",
            username: "Имя пользователя",
            password: "Пароль",
            login: "Вход",
            loginAttempt: "Выполняется вход..."
        },

        header: {
            title: "ArcGIS Workflow Manager",
            subHeader: "Веб-версия",
            logout: "Завершить сеанс",
            welcome: "Добро пожаловать",
            onHold: "Задание в данный момент удерживается, часть функций недоступна.",
            closed: "Задание в данный момент закрыто, часть функций недоступна.",
            offline: "Задание в настоящий момент в офлайн, часть функций недоступна.",
            navInfo: "{0} из {1}"
        },
        
        common: {
            loading: "Загрузка...",
            ok: "OK",
            cancel: "Отмена",
            error: "Ошибка",
            update: "Обновить",
            selectOption: "Выбрать опцию"
        },

        filter: {
            initialQueryTitle: "Выбрать запрос",
            initialReportTitle: "Выбрать отчет",
            initialJobTypeTitle: "Выберите тип задания",
            createNewJob: "Создать новое задание",
            createJob: "Создать задание",
            findJob: "Найти задание",
            queries: "Запросы",
            orFindJob: "или найти задание",
            loadingJobQueries: "Загрузка запросов заданий...",
            noJobsForThisQuery: "По этому запросу не найдено заданий",
            queryFieldDescriptions: "ID, Имя, Тип задания, Назначено для, Дата выполнения, Описание",
            queryTypePublic: "Общедоступные запросы",
            queryTypeUser: "Пользовательские запросы",
            reports: "Отчеты",
            reportWindow: "Открыть в новом окне",
            results: "Результаты поиска",
            uncategorized: "Нет категории"
        },
        
        statistics: {
            title: "Статистика",
            assignedTo: "Назначенный для",
            categorizedBy: "Разделены на категории по",
            groupedBy: "Сгруппированы по",
            jobType: "Тип задания",
            none: "Нет",
            barChart: "Линейчатая",
            pieChart: "Круговая диаграмма",
            reset: "Сброс",
            select: "Выбор",
            selectACategory: "Выберите категорию"
        },
        
        grid: {
            promptDelete: "Вы действительно хотите удалить выбранные задания?",
            promptClose: "Вы действительно хотите закрыть выбранные задания?",
            promptReopen: "Вы действительно хотите открыть выбранное задание(я) заново?",
            yes: "Да",
            no: "Нет",
            closeBtn: "Закрыть",
            closeTitle: "Закрыть задания",
            deleteBtn: "Удалить",
            deleteTitle: "Удалить задания",
            reopenBtn: "Открыть заново",
            reopenTitle: "Открыть завершенные задания заново",
            numberJobs: "{0} задания",
            newJob: "Новое задание создано"
        },

        properties: {
            title: "Свойства",
            aoiDefined: "Указанная область интереса",
            aoiUndefined: "Область интереса не задана",
            loiDefined: "LOI задано",
            loiUndefined: "LOI не задано",
            poiDefined: "POI задано",
            poiUndefined: "POI не задано",
            invalidAssignmentType: "Неправильный тип назначения",
            jobId: "ID задания",
            jobName: "Имя задания",
            jobType: "Тип задания",
            jobStatus: "Статус задания",
            jobPercentComplete: "% Выполнено",
            jobAOI: "AOI",
            jobLOI: "LOI",
            jobPOI: "POI (точка интереса)",
            jobDataWorkspace: "Рабочая область данных",
            jobVersion: "Версия",
            jobParentVersion: "Родительская версия",
            jobAssignment: "Назначение",
            jobAssignmentUser: "Пользователь",
            jobAssignmentGroup: "Группа",
            jobAssignmentUnassigned: "Не назначено",
            jobAssignmentUnknownUser: "Неизвестный пользователь",
            jobOwner: "Владелец задания",
            jobPriority: "Приоритет",
            jobStartDate: "Дата начала",
            jobDueDate: "Дата выполнения",
            jobDescription: "Описание задания",
            jobOffline: "Автономное задание",
            notApplicable: "недоступно",
            noDataWorkspace: "Нет рабочей области данных",
            noVersion: "Нет версии",
            numberOfJobs: "Число заданий",
            resize: "Изменить размер",
            updateSuccessful: "Свойства успешно обновились."
        },
        
        extendedProperties: {
            title: "Расширенные свойства",
            noProperties: "Отсутствуют расширенные свойства для этого задания",
            invalid: "Введенное значение некорректно",
            required: "Необходимое поле"
        },
        
        notes: {
            title: "Примечания",
            jobNote: "Примечание к заданию",
            saveNote: "Сохранить задание"
        },
        
        workflow: {
            title: "Рабочий процесс",
            currentSteps: "Текущий шаг (шаги)",
            executeStep: "Выполнить шаг",
            markStepComplete: "Отметить завершение шага",
            recreateWorkflow: "Создать рабочий процесс заново",
            promptRecreateWorkflow: "Вы действительно хотите создать рабочий процесс задания заново?",
            
            questionNotes: "Примечания (Дополнительно)",
            questionResponse: "Ответ на вопрос: {0}",
            questionResponseWithNotes: "Ответ на вопрос: {0} с примечанием: {1}",
            
            selectPrompt: "[Выбрать]",
            selectCurrentStep: "Выберите текущий шаг",
            selectNextStep: "Выбрать следующий шаг",
                        
            executionComplete: "Выполнение завершено",
            executionError: "Ошибка выполнения",
            executionWarning: "Предупреждение выполнения",
            
            executionResponses: {
                1: "Шаг выполнен успешно.",
                2: "Зависимость от шага в другом задании.",
                3: "Зависимость от стадии в другом задании.",
                4: "Зависимость от статуса в другом задании.",
                5: "Блокировано активным удержанием задания.",
                6: "Зависимость от предыдущего шага в рабочем процессе этого задания.",
                7: "Шаг отмечен как выполненный.",
                8: "Шаг назначается другому пользователю.",
                9: "Шаг назначается другой группе."
            },
            
            stepHasJobDependency: "{0} шаг зависит от другого задания, некоторые функции будут недоступны."
        },
        
        attachments: {
            title: "Вложения",
            action: "Действие",
            add: "Добавить",
            addAttachment: "Добавить вложение",
            addEmbedAttachTooltip: "Загрузить встроенный файл вложения",
            addLinkAttachTooltip: "Добавить вложение, связанное с файлом",
            addURLAttachTooltip: "Добавить вложение, связанное с URL-адресом",
            browser: "Выбрать файл",
            embed: "Встроенный файл вложения",
            embedLabel: "Выберите файл",
            filename: "Имя файла",
            link: "Вложение, связанное с файлом",
            linkPrompt: "Введите путь к файлу и имя",
            noAttachments: "У этого задания нет вложений",
            removeAll: "Удалить все",
            type: "Тип",
            upload: "Загрузить",
            url: "URL вложения",
            urlPrompt: "Введите URL",
        },

        attachmentItem: {
            noAttachmentType: "Неизвестный тип вложения",
            noFilename: "Нет имени файла",
            url: "URL-адрес",
            embedded: "Внедренные",
            file: "Связано",
            open: "Открыть",
            prompt: "Связанные вложения нельзя открыть непосредственно из этого приложения. Скопируйте путь к файлу ниже",
            dialogTitle: "Связанное вложение"
        },
        
        history: {
            title: "История",
            activityType: "Тип действия",
            date: "Дата",
            message: "Сообщение",
            noActivityForThisJob: "У этого задания нет действия",
            enterComment: "Добавить комментарий",
            saveComment: "Сохранить комментарий",
            user: "Пользователь"
        },

        holds: {
            add: "Добавить",
            title: "Остановки",
            comment: "Комментарий",
            holdDate: "Дата остановки",
            holdType: "Тип остановки",
            id: "ID",
            noHoldsForThisJob: "Для этого задания нет остановок",
            release: "Выпуск",
            releaseComments: "Освободить комментарии",
            releasedBy: "Выпущено",
            releaseHold: "Освободить удержание",
            saveHold: "Добавить остановку",
            type: "Тип"
        },

        error: {
            title: "Ошибка",
            errorAddingComment: "Ошибка при добавлении комментария",
            errorAddingHold: "Ошибка при добавлении остановки",
            errorCreatingJob: "Невозможно создать задание",
            errorCreatingJobAOI: "Ошибка создания AOI задания",
            errorCreatingJobLOI: "Ошибка создания LOI задания",
            errorCreatingJobPOI: "Ошибка создания POI задания",
            errorClosingJob: "Не удалось закрыть все задания",
            errorDeletingJob: "Не удалось удалить задания",
            errorDeletingJobAOI: "Ошибка при удалении области интереса задания",
            errorDeletingJobLOI: "Ошибка удалении LOI задания",
            errorDeletingJobPOI: "Ошибка удаления POI задания",
            errorExecuteStep: "Не удалось выполнить шаг рабочего процесса.",
            errorFindingJobsById: "Невозможно найти задание(я) {0}",
            errorGeneratingReport: "Ошибка создания отчета",
            errorGettingFieldValues: "Ошибка получения значений полей",
            errorGettingMultiFieldValues: "Ошибка получения значений поля множественного списка",
            errorGettingReports: "Ошибка получения отчетов",
            errorInvalidAuthenticationMode: "Некорректный режим аутентификации: {0}",
            errorInvalidFields: "Одно или более полей некорректны.",
            errorInvalidUsername: "Неверное имя пользователя {0}",
            errorLoadingDataWorkspaceDetails: "Невозможно загрузить сведения о рабочей области данных",
            errorLoadingGroups: "Невозможно загрузить группы",
            errorLoadingJobHistory: "Невозможно загрузить историю задания",
            errorLoadingJobHolds: "Невозможно загрузить остановки задания",
            errorLoadingJobIdField: "Невозможно загрузить поле Id задания из картографического сервиса области интереса задания",
            errorLoadingJobIdFieldLOI: "Невозможно загрузить поле Id задания из картографического сервиса LOI задания",
            errorLoadingJobIdFieldPOI: "Невозможно загрузить поле Id задания из картографического сервиса POI задания",
            errorLoadingJobTypeDetails: "Невозможно загрузить сведения о типе задания",
            errorLoadingServiceInfo: "Невозможно загрузить информацию о задании",
            errorLoadingUsers: "Невозможно загрузить пользователей",
            errorLoadingWorkflowConfiguration: "Не удалось загрузить конфигурацию Workflow Manager: слой AOI задачи или конфигурация задачи пуста",
            errorLoadingWorkflowInfo: "Невозможно загрузить информацию о рабочем процессе",
            errorMarkAsDone: "Не удалось отметить шаг рабочего процесса как выполненный.",
            errorMissingFields: "Одно или более обязательных полей отсутствует",
            errorMissingHoldType: "Выберите тип удержания.",
            errorMoveNextStep: "Не удалось перейти к следующему шагу в рабочем процессе.",
            errorNotDomainUser: "Аутентификация домена включена. Вместе с именем пользователя необходимо ввести домен.",
            errorOverlappingJobAOI: "AOI задания перекрывает другую AOI задания.",
            errorOverlappingJobLOI: "LOI задания перекрывает другую LOI задания.",
            errorOverlappingJobPOI: "POI задания перекрывает другую POI задания.",
            errorParsingTokens: "Ошибка обработки маркера: {0}",
            errorRecreateWorkflow: "Не удалось создать заново рабочий процесс задания.",
            errorReleasingHold: "Ошибка освобождения удержания",
            errorReopeningClosedJobs: "Не удалось открыть заново все закрытые задания",
            errorResolveConflict: "Не удалось разрешить конфликт рабочего процесса.",
            errorRetrievingAttachments: "Ошибка получения вложений",
            errorRetrievingExtendedProperties: "Ошибка получения расширенных свойств",
            errorRetrievingJobWithJobId: "Ошибка извлечения заданий с ID {0}",
            errorRetrievingUser: "Ошибка извлечения пользователя {0}",
            errorRetrievingWindowsUser: "Ошибка получения пользователя Windows.",
            errorRunningQuery: "ошибка запуска запроса {0}",
            errorStepNotWebEnabled: "Это шаг не настроен для записка в веб. Вы можете выполнить шаг в настольном приложении или обратиться к администратору приложений.",
            errorUnsupportedBrowser: "Неподдерживаемый браузер",
            errorUnsupportedBrowserMsg: "Используемый вами веб-браузер не поддерживается ArcGIS Workflow Manager. Загрузите последнюю версию Internet Explorer.",
            errorUpdatingExtendedProperties: "Ошибка обновления расширенных свойств",
            errorUpdatingJobAOI: "Ошибка обновления области интереса задания",
            errorUpdatingJobLOI: "Ошибка обновления LOI задания",
            errorUpdatingJobPOI: "Ошибка обновления POI задания",
            errorUpdatingJobNotes: "Ошибка обновления примечаний задания",
            errorUpdatingJobProperties: "Ошибка обновления свойств задания"
            }

    





}); 
