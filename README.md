workflowmanager-viewer-js
==========================

Source code for ArcGIS Workflow Manager JavaScript viewer - Manage your workflows on the web.

[View it live](https://workflowsample.esri.com/js/)

![App](https://raw.github.com/Esri/workflowmanager-viewer-js/master/workflowmanager-viewer-js.png)

## Features
* Ready-to-deploy GIS web client workflow manager application for ArcGIS Server.
* A complete workflow management application, that allows for ease and efficiency toward managing and tracking business workflows.
* Easily configurable to meet custom business needs and requirements - no programming skills required to deploy.

### Versions
The current version of the Workflow Manager JavaScript viewer is compatible with [ArcGIS JavaScript 3.19 API](https://developers.arcgis.com/javascript/3/) and [Workflow Manager Server](https://server.arcgis.com/en/workflow-manager/) 10.4 and later versions.

A version of this viewer using ArcGIS JavaScript 4.3 API can be found on the [4master branch](https://github.com/Esri/workflowmanager-viewer-js/tree/4master) of this repository. A Workflow Manager 4.x JavaScript API is also available and has been integrated with [ArcGIS API for JavaScript](https://developers.arcgis.com/downloads/apis-and-sdks?product=javascript) versions 4.3 through 4.12.

The 10.4 Language Pack version of this viewer can be found on the [10.4 LP branch](https://github.com/Esri/workflowmanager-viewer-js/tree/10.4_LP) of this repository.

The 10.3.1 version of this viewer can be found on the [10.3.1 branch](https://github.com/Esri/workflowmanager-viewer-js/tree/10.3.1) of this repository.

### ArcGIS Workflow Manager JavaScript API
* The JavaScript viewer includes the latest [ArcGIS Workflow Manager JavaScript API](js/app/WorkflowManager/libs/workflowmanager).
* Refer to the [ArcGIS Workflow Manager JavaScript API Reference](https://workflowsample.esri.com/doc/javascript/jsapi/index.html) for usage information.
* Download older versions of the API and help documentation from the [ArcGIS Workflow Manager API Download site](https://www.esri.com/apps/products/download/index.cfm?fuseaction=download.all#ArcGIS_Workflow_Manager_API).

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

* [ArcGIS Workflow Manager for Server](https://enterprise.arcgis.com/en/workflow-manager/)
* [ArcGIS Workflow Manager Discussions on GeoNet](https://community.esri.com/community/gis/solutions/workflow-manager)

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
