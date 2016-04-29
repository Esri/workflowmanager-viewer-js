define({

        loading: {
            loading: "yükleniyor...",
            username: "Kullanıcı adı",
            password: "Şifre",
            login: "Oturum aç",
            loginAttempt: "Oturum açılmaya çalışılıyor..."
        },

        header: {
            title: "ArcGIS Workflow Manager",
            subHeader: "Web Sürümü",
            logout: "Oturumu kapat",
            welcome: "Hoş Geldiniz",
            onHold: "İş şu anda beklemede, bazı işlevler kullanılamıyor.",
            closed: "İş şu anda kapalı, bazı işlevler kullanılamıyor.",
            offline: "İş şu anda çevrim dışı, bazı işlevler kullanılamıyor.",
            navInfo: "{0} / {1}"
        },
        
        common: {
            loading: "Yükleniyor...",
            ok: "Tamam",
            cancel: "İptal",
            error: "Hata",
            update: "Güncelle",
            selectOption: "Seçenek belirle"
        },

        filter: {
            initialQueryTitle: "Sorgu Seç",
            initialReportTitle: "Rapor Seç",
            initialJobTypeTitle: "İş Türünü Seç",
            createNewJob: "Yeni İş Yarat",
            createJob: "İş Oluştur",
            findJob: "İş bul",
            queries: "Sorgular",
            orFindJob: "veya iş bul",
            loadingJobQueries: "İş sorguları yükleniyor...",
            noJobsForThisQuery: "Bu sorgu için iş yok",
            queryFieldDescriptions: "ID,Ad,İş Türü,Atanılan,Son Tarih,Tanım",
            queryTypePublic: "Genel Sorgular",
            queryTypeUser: "Kullanıcı Sorguları",
            reports: "Raporlar",
            reportWindow: "Yeni Pencerede Aç",
            results: "Arama Sonuçları",
            uncategorized: "Kategorize edilmemiş"
        },
        
        statistics: {
            title: "İstatistikler",
            assignedTo: "Atanılan",
            categorizedBy: "Kategori ölçütü",
            groupedBy: "Gruplandırma ölçütü",
            jobType: "İş türü",
            none: "Hiçbiri",
            barChart: "Çubuk",
            pieChart: "Dilim",
            reset: "Sıfırla",
            select: "Seç",
            selectACategory: "Kategori seçin"
        },
        
        grid: {
            promptDelete: "Seçilen işleri silmek istediğinizden emin misiniz?",
            promptClose: "Seçilen işleri kapatmak istediğinizden emin misiniz?",
            promptReopen: "Seçili işleri yeniden açmak istediğinizden emin misiniz?",
            yes: "Evet",
            no: "Hayır",
            closeBtn: "Kapat",
            closeTitle: "İşleri Kapat",
            deleteBtn: "Sil",
            deleteTitle: "İşleri Sil",
            reopenBtn: "Yeniden Aç",
            reopenTitle: "Kapatılan İşleri Yeniden Aç",
            numberJobs: "{0} iş",
            newJob: "Yeni İş Oluşturuldu"
        },

        properties: {
            title: "Özellikler",
            aoiDefined: "AOI tanımlı",
            aoiUndefined: "AOI tanımlı değil",
            loiDefined: "LOI tanımlı",
            loiUndefined: "LOI tanımlı değil",
            poiDefined: "POI tanımlı",
            poiUndefined: "POI tanımlı değil",
            invalidAssignmentType: "Geçersiz atama türü",
            jobId: "İş Kimliği",
            jobName: "İş Adı",
            jobType: "İş Türü",
            jobStatus: "İş Durumu",
            jobPercentComplete: "Tamamlanma %'si",
            jobAOI: "AOI",
            jobLOI: "LOI",
            jobPOI: "POI",
            jobDataWorkspace: "Veri Çalışma Alanı",
            jobVersion: "Sürüm",
            jobParentVersion: "Ana Sürüm",
            jobAssignment: "Atama",
            jobAssignmentUser: "Kullanıcı",
            jobAssignmentGroup: "Grup",
            jobAssignmentUnassigned: "Atanmamış",
            jobAssignmentUnknownUser: "Bilinmeyen Kullanıcı",
            jobOwner: "İş Sahibi",
            jobPriority: "Öncelik",
            jobStartDate: "Başlangıç Tarihi",
            jobDueDate: "Son Tarih",
            jobDescription: "İş Tanımı",
            jobOffline: "Çevrim Dışı İş",
            notApplicable: "yok",
            noDataWorkspace: "Veri Çalışma Alanı Yok",
            noVersion: "Sürüm Yok",
            numberOfJobs: "İş sayısı",
            resize: "Yeniden Boyutlandır",
            updateSuccessful: "Özellikler başarıyla güncellendi."
        },
        
        extendedProperties: {
            title: "Genişletilmiş Özellikler",
            noProperties: "Bu iş için genişletilmiş özellik yok",
            invalid: "Girilen değer geçerli değil",
            required: "Gerekli Alan"
        },
        
        notes: {
            title: "Notlar",
            jobNote: "İş Notu",
            saveNote: "Notu Kaydet"
        },
        
        workflow: {
            title: "İş Akışı",
            currentSteps: "Geçerli Adım(lar)",
            executeStep: "Adımı Yürüt",
            markStepComplete: "İşaretleme Adımı Tamamlandı",
            recreateWorkflow: "İş Akışını Yeniden Oluştur",
            promptRecreateWorkflow: "İşin iş akışını yeniden oluşturmak istediğinizden emin misiniz?",
            
            questionNotes: "Notlar (İsteğe Bağlı)",
            questionResponse: "Soru Yanıtı: {0}",
            questionResponseWithNotes: "Soru Yanıtı: {0}, Not: {1} ile",
            
            selectPrompt: "[Seç]",
            selectCurrentStep: "Geçerli Adımı Seç",
            selectNextStep: "Bir Sonraki Adımı Seç",
                        
            executionComplete: "Yürütme Tamamlandı",
            executionError: "Yürütme Hatası",
            executionWarning: "Yürütme Uyarısı",
            
            executionResponses: {
                1: "Adım başarıyla yürütüldü.",
                2: "Başka bir işteki adıma bağımlı.",
                3: "Başka bir işteki aşamaya bağımlı.",
                4: "Başka bir işteki duruma bağımlı.",
                5: "Etkin iş bekletme tarafından engellendi.",
                6: "Bu işin iş akışındaki önceki adıma bağımlı.",
                7: "Bu adım tamamlandı olarak işaretlendi.",
                8: "Adım başka bir kullanıcıya atandı.",
                9: "Adım başka bir gruba atandı."
            },
            
            stepHasJobDependency: "{0} adımının başka bir iş bağımlılığı var, bazı işlevler kullanılamaz."
        },
        
        attachments: {
            title: "Ekler",
            action: "Eylem",
            add: "Ekle",
            addAttachment: "İlişik Ekle",
            addEmbedAttachTooltip: "Eklenmiş bir dosya eki yükle",
            addLinkAttachTooltip: "Bağlantılı bir dosya eki yükle",
            addURLAttachTooltip: "Bağlantılı bir URL eki ekle",
            browser: "Dosya Seç",
            embed: "Ekli Dosya Eki",
            embedLabel: "Dosya Seç",
            filename: "Dosya adı",
            link: "Bağlantılı Dosya Eki",
            linkPrompt: "Dosya Yolu ve Adı Gir",
            noAttachments: "Bu iş için ek yok",
            removeAll: "Hepsini Kaldır",
            type: "Tür",
            upload: "Yükle",
            url: "URL Eki",
            urlPrompt: "URL gir",
        },

        attachmentItem: {
            noAttachmentType: "Bilinmeyen Ek Türü",
            noFilename: "Dosya Adı Yok",
            url: "URL",
            embedded: "İçine Yerleşik",
            file: "Bağlantılı",
            open: "Aç",
            prompt: "Bağlantılı ekler bu uygulamadan doğrudan açılamaz. Dosya yolunu aşağı kopyalayın",
            dialogTitle: "Bağlantılı Ek"
        },
        
        history: {
            title: "Geçmiş",
            activityType: "Etkinlik Türü",
            date: "Tarih",
            message: "İleti",
            noActivityForThisJob: "Bu iş için etkinlik yok",
            enterComment: "Açıklama Gir",
            saveComment: "Açıklamayı Kaydet",
            user: "Kullanıcı"
        },

        holds: {
            add: "Ekle",
            title: "Bekletmeler",
            comment: "Açıklama",
            holdDate: "Bekletme Tarihi",
            holdType: "Bekletme Türü",
            id: "Kimlik",
            noHoldsForThisJob: "Bu iş için bekletme yok",
            release: "Bırak",
            releaseComments: "Yorumları Bırak",
            releasedBy: "Bırakan",
            releaseHold: "Bekletmeyi Bırak",
            saveHold: "Bekletme Ekle",
            type: "Tür"
        },

        error: {
            title: "Hata",
            errorAddingComment: "Açıklama ekleme hatası",
            errorAddingHold: "Bekletme ekleme hatası",
            errorCreatingJob: "İş oluşturulamıyor",
            errorCreatingJobAOI: "İş AOI oluşturma hatası",
            errorCreatingJobLOI: "İş LOI oluşturma hatası",
            errorCreatingJobPOI: "İş POI oluşturma hatası",
            errorClosingJob: "İşlerin tümü kapatılamıyor",
            errorDeletingJob: "İşler silinemiyor",
            errorDeletingJobAOI: "İş AOI'sı silme hatası",
            errorDeletingJobLOI: "İş LOI\'sı silme hatası",
            errorDeletingJobPOI: "İş POI\'sı silme hatası",
            errorExecuteStep: "İş akışı adımı yürütülemiyor.",
            errorFindingJobsById: "İş(ler) bulunamıyor {0}",
            errorGeneratingReport: "Rapor oluşturma hatası",
            errorGettingFieldValues: "Alan değerleri alma hatası",
            errorGettingMultiFieldValues: "Çok listeli alan değerleri alma hatası",
            errorGettingReports: "Rapor alma hatası",
            errorInvalidAuthenticationMode: "Geçersiz kimlik doğrulama modu: {0}",
            errorInvalidFields: "Bir veya birkaç alan geçersiz.",
            errorInvalidUsername: "Geçersiz kullanıcı adı {0}",
            errorLoadingDataWorkspaceDetails: "Veri çalışma alanı ayrıntıları yüklenemiyor",
            errorLoadingGroups: "Gruplar yüklenemiyor",
            errorLoadingJobHistory: "İş geçmişi yüklenemiyor",
            errorLoadingJobHolds: "İş bekletmeleri yüklenemiyor",
            errorLoadingJobIdField: "İş AOI harita hizmetinden iş kimliği alanı yüklenemiyor",
            errorLoadingJobIdFieldLOI: "İş LOI harita hizmetinden iş kimliği alanı yüklenemiyor",
            errorLoadingJobIdFieldPOI: "İş POI harita hizmetinden iş kimliği alanı yüklenemiyor",
            errorLoadingJobTypeDetails: "İş türü ayrıntıları yüklenemiyor",
            errorLoadingServiceInfo: "Hizmet bilgileri yüklenemiyor",
            errorLoadingUsers: "Kullanıcılar yüklenemiyor",
            errorLoadingWorkflowConfiguration: "Workflow Manager yapılandırması yüklenemiyor: AOI katmanı görevi veya yapılandırma görevi boş",
            errorLoadingWorkflowInfo: "İş akışı bilgileri yüklenemiyor",
            errorMarkAsDone: "İş akışı adımı tamamlandı olarak işaretlenemiyor.",
            errorMissingFields: "Bir ya da daha fazla gerekli alan eksik.",
            errorMissingHoldType: "Bir tutma türü seçin.",
            errorMoveNextStep: "Sonraki iş akışı adımına ilerlenemiyor.",
            errorNotDomainUser: "Domain kimlik doğrulaması etkinleştirildi. Kullanıcı adıyla birlikte domain bilgilerinizi girin.",
            errorOverlappingJobAOI: "İş AOI\'si başka bir iş AOI\'si ile örtüşüyor.",
            errorOverlappingJobLOI: "İş LOI\'si başka bir iş LOI\'si ile örtüşüyor.",
            errorOverlappingJobPOI: "İş POI\'si başka bir iş POI\'si ile örtüşüyor.",
            errorParsingTokens: "Belirteç ayıklama hatası: {0}",
            errorRecreateWorkflow: "İşin iş akışı yeniden oluşturulamıyor.",
            errorReleasingHold: "Bekletmeyi bırakma hatası",
            errorReopeningClosedJobs: "Kapatılan tüm işler yeniden açılamıyor",
            errorResolveConflict: "İş akışı çakışması çözülemiyor.",
            errorRetrievingAttachments: "Ek alma hatası",
            errorRetrievingExtendedProperties: "Genişletilmiş özellik alma hatası",
            errorRetrievingJobWithJobId: "İş kimliği {0} olan işleri alma hatası",
            errorRetrievingUser: "{0} kullanıcısını alma hatası",
            errorRetrievingWindowsUser: "Windows kullanıcısı alma hatası.",
            errorRunningQuery: "{0} sorgusunu çalıştırma hatası",
            errorStepNotWebEnabled: "Bu adım web üzerinde çalışacak şekilde yapılandırılmadı. Adımı masaüstünde yürütebilir ya da uygulama yöneticiniz ile iletişim kurabilirsiniz.",
            errorUnsupportedBrowser: "Desteklenmeyen Tarayıcı",
            errorUnsupportedBrowserMsg: "Kullandığınız tarayıcı ArcGIS Workflow Manager tarafından desteklenmiyor. Internet Explorer'ın son sürümünü indirin.",
            errorUpdatingExtendedProperties: "Genişletilmiş özellik güncelleme hatası",
            errorUpdatingJobAOI: "İş AOI'sı güncelleme hatası",
            errorUpdatingJobLOI: "İş LOI\'sı güncelleme hatası",
            errorUpdatingJobPOI: "İş POI\'sı güncelleme hatası",
            errorUpdatingJobNotes: "İş notlarını güncelleme hatası",
            errorUpdatingJobProperties: "İş özelliklerini güncelleme hatası"
            }

    





}); 
