define({

        loading: {
            loading: "正在加载...",
            username: "用户名",
            password: "密码",
            login: "登录",
            loginAttempt: "正在尝试登录..."
        },

        header: {
            title: "ArcGIS Workflow Manager",
            subHeader: "Web 版",
            logout: "登出",
            welcome: "欢迎",
            onHold: "当前已保留作业，某些功能不可用。",
            closed: "当前已关闭作业，某些功能不可用。",
            offline: "作业当前处于离线状态，某些功能不可用。",
            navInfo: "{0}/{1}"
        },
        
        common: {
            loading: "正在加载...",
            ok: "确定",
            cancel: "取消",
            error: "错误",
            update: "更新",
            selectOption: "选择一个选项"
        },

        filter: {
            initialQueryTitle: "选择查询",
            initialReportTitle: "选择报告",
            initialJobTypeTitle: "选择作业类型",
            createNewJob: "创建新作业",
            createJob: "创建作业",
            findJob: "查找作业",
            queries: "查询",
            orFindJob: "或查找作业",
            loadingJobQueries: "正在加载作业查询...",
            noJobsForThisQuery: "此查询无作业",
            queryFieldDescriptions: "ID,名称,作业类型,分配给,截止日期,描述",
            queryTypePublic: "公共查询",
            queryTypeUser: "用户查询",
            reports: "报表",
            reportWindow: "在新窗口中打开",
            results: "搜索结果",
            uncategorized: "未分类"
        },
        
        statistics: {
            title: "统计数据",
            assignedTo: "分配给",
            categorizedBy: "分类依据",
            groupedBy: "分组依据",
            jobType: "作业类型",
            none: "无",
            barChart: "条块",
            pieChart: "饼图",
            reset: "重置",
            select: "选择",
            selectACategory: "选择类别"
        },
        
        grid: {
            promptDelete: "是否确定要删除所选作业?",
            promptClose: "是否确定要关闭所选作业?",
            promptReopen: "是否确定要重新打开所选作业?",
            yes: "是",
            no: "否",
            closeBtn: "关闭",
            closeTitle: "关闭作业",
            deleteBtn: "删除",
            deleteTitle: "删除作业",
            reopenBtn: "重新打开",
            reopenTitle: "重新打开已关闭的作业",
            numberJobs: "{0} 个作业",
            newJob: "新作业已创建"
        },

        properties: {
            title: "属性",
            aoiDefined: "AOI 已定义",
            aoiUndefined: "AOI 未定义",
            loiDefined: "LOI 已定义",
            loiUndefined: "LOI 未定义",
            poiDefined: "POI 已定义",
            poiUndefined: "POI 未定义",
            invalidAssignmentType: "分配类型无效",
            jobId: "作业 ID",
            jobName: "作业名称",
            jobType: "作业类型",
            jobStatus: "作业状态",
            jobPercentComplete: "% 已完成",
            jobAOI: "AOI",
            jobLOI: "LOI",
            jobPOI: "POI",
            jobDataWorkspace: "数据工作空间",
            jobVersion: "版本",
            jobParentVersion: "父版本",
            jobAssignment: "分配",
            jobAssignmentUser: "用户",
            jobAssignmentGroup: "组",
            jobAssignmentUnassigned: "未分配",
            jobAssignmentUnknownUser: "未知用户",
            jobOwner: "作业所有者",
            jobPriority: "优先级",
            jobStartDate: "开始日期",
            jobDueDate: "截止日期",
            jobDescription: "作业描述",
            jobOffline: "离线作业",
            notApplicable: "n/a",
            noDataWorkspace: "无数据工作空间",
            noVersion: "无版本",
            numberOfJobs: "作业数",
            resize: "调整",
            updateSuccessful: "成功更新属性。"
        },
        
        extendedProperties: {
            title: "扩展属性",
            noProperties: "此作业没有扩展属性",
            invalid: "输入的值无效",
            required: "必填字段"
        },
        
        notes: {
            title: "注释",
            jobNote: "作业注释",
            saveNote: "保存注释"
        },
        
        workflow: {
            title: "工作流",
            currentSteps: "当前步骤",
            executeStep: "执行步骤",
            markStepComplete: "将步骤标记为完成",
            recreateWorkflow: "重新创建工作流",
            promptRecreateWorkflow: "是否确定要重新创建作业工作流?",
            
            questionNotes: "注释(可选)",
            questionResponse: "问题响应: {0}",
            questionResponseWithNotes: "问题响应: {0} 具有注释: {1}",
            
            selectPrompt: "[选择]",
            selectCurrentStep: "选择当前步骤",
            selectNextStep: "选择下一步",
                        
            executionComplete: "执行操作已完成",
            executionError: "执行错误",
            executionWarning: "执行警告",
            
            executionResponses: {
                1: "已成功执行该步骤。",
                2: "取决于另一作业中的步骤。",
                3: "取决于另一作业中的阶段。",
                4: "取决于另一作业中的状态。",
                5: "被活动作业保留项拦截。",
                6: "取决于此作业工作流中的上一步骤。",
                7: "经检查此步骤已完成。",
                8: "此步骤已分配给其他用户。",
                9: "此步骤已分配给其他组。"
            },
            
            stepHasJobDependency: "{0} 步骤依赖于其他作业，某些功能不可用。"
        },
        
        attachments: {
            title: "附件",
            action: "操作",
            add: "添加",
            addAttachment: "添加附件",
            addEmbedAttachTooltip: "上传嵌入的文件附件",
            addLinkAttachTooltip: "添加链接的文件附件",
            addURLAttachTooltip: "添加链接的 URL 附件",
            browser: "选择文件",
            embed: "嵌入的文件附件",
            embedLabel: "选择一个文件",
            filename: "文件名",
            link: "链接的文件附件",
            linkPrompt: "输入文件路径和名称",
            noAttachments: "此作业无附件。",
            removeAll: "全部移除",
            type: "类型",
            upload: "上传",
            url: "URL 附件",
            urlPrompt: "输入 URL",
        },

        attachmentItem: {
            noAttachmentType: "附件类型未知",
            noFilename: "无文件名",
            url: "URL",
            embedded: "嵌入式",
            file: "链接",
            open: "打开",
            prompt: "无法通过此应用程序直接打开链接的附件。请复制下方的文件路径",
            dialogTitle: "链接的附件"
        },
        
        history: {
            title: "历史",
            activityType: "活动类型",
            date: "日期",
            message: "消息",
            noActivityForThisJob: "此作业无活动",
            enterComment: "输入评论",
            saveComment: "保存评论",
            user: "用户"
        },

        holds: {
            add: "添加",
            title: "保留",
            comment: "评论",
            holdDate: "保留日期",
            holdType: "保留类型",
            id: "ID",
            noHoldsForThisJob: "此作业无保留",
            release: "解除",
            releaseComments: "解除注释",
            releasedBy: "发布者",
            releaseHold: "解除阻停",
            saveHold: "添加保留",
            type: "类型"
        },

        error: {
            title: "错误",
            errorAddingComment: "添加评论时出错",
            errorAddingHold: "添加保留时出错",
            errorCreatingJob: "无法创建作业",
            errorCreatingJobAOI: "创建作业 AOI 时出错",
            errorCreatingJobLOI: "创建作业 LOI 时出错",
            errorCreatingJobPOI: "创建作业 POI 时出错",
            errorClosingJob: "无法关闭所有作业",
            errorDeletingJob: "无法删除作业",
            errorDeletingJobAOI: "删除作业 AOI 时出错",
            errorDeletingJobLOI: "删除作业 LOI 时出错",
            errorDeletingJobPOI: "删除作业 POI 时出错",
            errorExecuteStep: "无法执行工作流步骤。",
            errorFindingJobsById: "无法查找作业 {0}",
            errorGeneratingReport: "生成报表时出错",
            errorGettingFieldValues: "获取字段值时出错",
            errorGettingMultiFieldValues: "获取多列表字段值时出错",
            errorGettingReports: "获取报表时出错",
            errorInvalidAuthenticationMode: "无效的身份验证模式: {0}",
            errorInvalidFields: "一个或多个字段无效。",
            errorInvalidUsername: "无效的用户名 {0}",
            errorLoadingDataWorkspaceDetails: "无法加载数据工作空间详细信息",
            errorLoadingGroups: "无法加载组",
            errorLoadingJobHistory: "无法加载作业历史",
            errorLoadingJobHolds: "无法加载作业保留",
            errorLoadingJobIdField: "无法从作业 AOI 地图服务加载作业 Id 字段",
            errorLoadingJobIdFieldLOI: "无法从作业 LOI 地图服务中加载作业 ID 字段",
            errorLoadingJobIdFieldPOI: "无法从作业 POI 地图服务中加载作业 ID 字段",
            errorLoadingJobTypeDetails: "无法加载作业类型详细信息",
            errorLoadingServiceInfo: "无法加载服务信息",
            errorLoadingUsers: "无法加载用户",
            errorLoadingWorkflowConfiguration: "无法加载 Workflow Manager 配置: AOI 图层任务或配置任务为空",
            errorLoadingWorkflowInfo: "无法加载工作流信息",
            errorMarkAsDone: "无法将工作流步骤标记为完成。",
            errorMissingFields: "一个或多个必填字段缺失。",
            errorMissingHoldType: "请选择保留类型。",
            errorMoveNextStep: "无法继续下一个工作流步骤。",
            errorNotDomainUser: "域身份验证已启用。请输入您的域和用户名。",
            errorOverlappingJobAOI: "作业 AOI 与另一作业 AOI 重叠。",
            errorOverlappingJobLOI: "作业 LOI 与另一作业 LOI 重叠。",
            errorOverlappingJobPOI: "作业 POI 与另一作业 POI 重叠。",
            errorParsingTokens: "解析令牌时出错: {0}",
            errorRecreateWorkflow: "无法重新创建作业工作流。",
            errorReleasingHold: "释放阻停时出错",
            errorReopeningClosedJobs: "无法重新打开所有已关闭的作业",
            errorResolveConflict: "无法解决工作流冲突。",
            errorRetrievingAttachments: "检索附件时出错",
            errorRetrievingExtendedProperties: "检索扩展属性时出错",
            errorRetrievingJobWithJobId: "检索作业 ID 为 {0} 的作业时出错",
            errorRetrievingUser: "检索用户 {0} 时出错",
            errorRetrievingWindowsUser: "检索 windows 用户时出错。",
            errorRunningQuery: "运行查询 {0} 时出错",
            errorStepNotWebEnabled: "此步骤尚未配置为在 web 上运行。可在桌面应用程序中执行此步骤或联系应用程序管理员。",
            errorUnsupportedBrowser: "不支持的浏览器",
            errorUnsupportedBrowserMsg: "ArcGIS Workflow Manager 不支持所使用的浏览器。请下载最新版本的 Internet Explorer。",
            errorUpdatingExtendedProperties: "更新扩展属性时出错",
            errorUpdatingJobAOI: "更新作业 AOI 时出错",
            errorUpdatingJobLOI: "更新作业 LOI 时出错",
            errorUpdatingJobPOI: "更新作业 POI 时出错",
            errorUpdatingJobNotes: "更新作业注释时出错",
            errorUpdatingJobProperties: "更新作业属性时出错"
            }

    





}); 
