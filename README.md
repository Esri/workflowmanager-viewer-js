workflowmanager-viewer-js
==========================

Source code for ArcGIS Workflow Manager JavaScrpt viewer - Manage your workflows on the web.

[View it live](http://workflowsample.esri.com/js/)

![App](https://raw.github.com/Esri/workflowmanager-viewer-js/master/workflowmanager-viewer-js.png)

## Features
* Ready-to-deploy GIS web client workflow manager application for ArcGIS Server.
* A complete workflow management application, that allows for ease and efficiency toward managing and tracking business workflows.
* Easily configurable to meet custom business needs and requirements - no programming skills required to deploy.

### ArcGIS Workflow Manager JavaScript API
* The JavaScript viewer includes the [ArcGIS Workflow Manager JavaScript API](js/app/WorkflowManager/libs/workflowmanager).
* Refer to the [ArcGIS Workflow Manager JavaScript API Reference](http://workflowsample.esri.com/doc/javascript/jsapi/index.html) for usage information.
* Download a zip file of the API and help documentation from the [ArcGIS Workflow Manager API Download site](http://www.esri.com/apps/products/download/index.cfm?fuseaction=download.all#ArcGIS_Workflow_Manager_API).

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
Workflow Manager service, AOI Map service, and ArcGIS Token service if these are secured
services (details in the Readme.pdf).
4. Modify the deployed js/widget/gis/BasemapGallery.js file to configure custom basemaps
(details in the Readme.pdf).
5. Modify the deployed proxy/proxy.config file to configure the Workflow Manager service that
the proxy will forward to (details in the Readme.pdf).
6. If using IIS, create a website.
7. Launch the sample viewer in a web browser.

## Requirements

* HTTP server such IIS or Apache
* Web browser with access to the Internet

## Resources

* [ArcGIS Workflow Manager Resource Center](http://resources.arcgis.com/en/communities/workflow-manager/)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2013 Esri

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
