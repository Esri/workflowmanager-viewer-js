workflowmanager-viewer-js
==========================

Source code for ArcGIS Workflow Manager JavaScript viewer - Manage your workflows on the web.

[View it live](http://workflowsample.esri.com/js4/)

![App](https://raw.github.com/Esri/workflowmanager-viewer-js/master/workflowmanager-viewer-js.png)

## Features
* Ready-to-deploy GIS web client workflow manager application for ArcGIS Server.
* A complete workflow management application, that allows for ease and efficiency toward managing and tracking business workflows.
* Easily configurable to meet custom business needs and requirements - no programming skills required to deploy.

### Versions
This version of the Workflow Manager JavaScript viewer is compatible with [ArcGIS JavaScript 4.3 API](https://developers.arcgis.com/javascript/) and [Workflow Manager Server](https://server.arcgis.com/en/workflow-manager/) 10.5 and 10.4.  

The ArcGIS JavaScript 3.19 API version of this viewer can be found on the [master branch](https://github.com/esri/workflowmanager-viewer-js) of this repository.

The 10.4 Language Pack version of this viewer can be found on the [10.4 LP branch](https://github.com/Esri/workflowmanager-viewer-js/tree/10.4_LP) of this repository.

The 10.3.1 version of this viewer can be found on the [10.3.1 branch](https://github.com/Esri/workflowmanager-viewer-js/tree/10.3.1) of this repository.

### Limitations
Due to several features not yet available in ArcGIS JavaScript API 4.3, the following features have been disabled in the 4.3 version of JavaScript Viewer.
* Ability to create/update/delete a job's area of interest
* Adding embedded attachments

### ArcGIS Workflow Manager JavaScript API
The ArcGIS Workflow Manager JavaScript API is now integrated with [ArcGIS JavaScript 4.3 API](https://developers.arcgis.com/javascript/).
* Guide > Working with the API > [Get started with workflows](https://developers.arcgis.com/javascript/latest/guide/get-started-workflows/index.html)
* API Reference > esri/tasks/workflow
 * [ConfigurationTask](https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-workflow-ConfigurationTask.html), [JobTask](https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-workflow-JobTask.html), [NotificationTask](https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-workflow-NotificationTask.html), [ReportTask](https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-workflow-ReportTask.html), [TokenTask](https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-workflow-TokenTask.html), [WorkflowTask](https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-workflow-WorkflowTask.html)

### Supported Browsers
The Workflow Manager JavaScript viewer supports the following browsers:
* Chrome
* Firefox
* Internet Explorer 10+

## Instructions

Deployment:

1. Fork and then clone the repo.
2. Install an HTTP server such IIS or Apache.
3. Modify the deployed js/app/WorkflowManager/config/AppConfig.js file to configure the
Workflow Manager service, AOI Map service, basemaps and ArcGIS Token service if these are secured
services (details in the [README.pdf](README.pdf)).
4. Modify the deployed proxy/proxy.config file to configure the Workflow Manager service that
the proxy will forward to (details in the [README.pdf](README.pdf)).
5. If using IIS, create a website.
6. Launch the sample viewer in a web browser.

## Requirements

* HTTP server such IIS or Apache
* Web browser with access to the Internet

## Resources

* [ArcGIS Workflow Manager Resource Center](http://resources.arcgis.com/en/communities/workflow-manager/)

## Issues

Find a bug or want to request a new feature?  Please let us know by [submitting an issue](https://github.com/Esri/workflowmanager-viewer-js/issues).

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2016 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( https://raw.github.com/Esri/workflowmanager-viewer-js/master/license.txt) file.

[](Esri Tags: ArcGIS Workflow Manager Viewer Web Server HTML JavaScript API Dojo)
[](Esri Language: JavaScript)
