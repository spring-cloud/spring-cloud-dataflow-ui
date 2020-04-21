
<p align="center">
  <a href="https://cloud.spring.io/spring-cloud-dataflow/">
    <img alt="Spring Data Flow Dashboard" title="Spring Data Flow Dashboard" src="https://i.imgur.com/ZfEGBE4.png" width="450">
  </a>
</p>

<p align="center">
  <a href="https://waffle.io/spring-cloud/spring-cloud-dataflow-ui">
    <img src="https://badge.waffle.io/spring-cloud/spring-cloud-dataflow-ui.svg?label=ready&title=Ready"
         alt="Stories in Ready">
  </a>
  <a href="https://waffle.io/spring-cloud/spring-cloud-dataflow-ui">
    <img src="https://badge.waffle.io/spring-cloud/spring-cloud-dataflow-ui.svg?label=In%20Progress&title=In%20Progress"
         alt="Stories in Progress">
  </a>
  <br />
  <a href="https://travis-ci.org/spring-cloud/spring-cloud-dataflow-ui">
    <img src="https://travis-ci.org/spring-cloud/spring-cloud-dataflow-ui.png?branch=master"
         alt="Build Status">
  </a>
  <a href="https://ci.appveyor.com/project/ghillert/spring-cloud-dataflow-ui/branch/master">
    <img src="https://ci.appveyor.com/api/projects/status/7pqco2aqjyaphp36/branch/master?svg=true"
         alt="Build status">
  </a>
  <a href="https://codecov.io/gh/spring-cloud/spring-cloud-dataflow-ui/branch/master">
    <img src="https://codecov.io/gh/spring-cloud/spring-cloud-dataflow-ui/branch/master/graph/badge.svg"
         alt="Code Coverage">
  </a>
  <a href="https://saucelabs.com/u/ghillert">
    <img src="https://saucelabs.com/buildstatus/ghillert"
         alt="Sauce Test Status">
  </a>
  <a href="https://www.browserstack.com/automate/public-build/T3pKbzdQK2RpVnkxZ2ZwN2tjeGFUSzdOQUJ2cG1GSDBYSlRvT00zZWV1bz0tLVpuMXk0eTJmN01ienhnbkNPbXJTanc9PQ==--b187f26b476b4d3f262b837e13f4be593c41e44c">
    <img src="https://www.browserstack.com/automate/badge.svg?badge_key=T3pKbzdQK2RpVnkxZ2ZwN2tjeGFUSzdOQUJ2cG1GSDBYSlRvT00zZWV1bz0tLVpuMXk0eTJmN01ienhnbkNPbXJTanc9PQ==--b187f26b476b4d3f262b837e13f4be593c41e44c"
         alt="BrowserStack Status">
  </a>
</p>

<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#acknowledgments">Acknowledgments</a>
</p>

## Introduction

This is the **Spring Cloud Data Flow Dashboard** user interface (UI). The UI uses [Angular][]. **Source code documentation** is available at https://cloud.spring.io/spring-cloud-dataflow-ui/.

> The Git repository for the main **Spring Cloud Data Flow** project is at: https://github.com/spring-cloud/spring-cloud-dataflow

---

## Showcase

<center>
  <table>
    <tr>
      <td><a href="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-available-apps-list.png"><img width="120" alt="Spring Cloud Data Flow" src="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-available-apps-list.png"></a></td>
      <td><a href="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-bulk-import-applications.png"><img width="120" alt="Spring Cloud Data Flow" src="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-bulk-import-applications.png"></a></td>
      <td><a href="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-streams-list-definitions.png"><img width="120" alt="Spring Cloud Data Flow" src="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-streams-list-definitions.png"></a></td>
      <td><a href="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-flo-create-stream.png"><img width="120" alt="Spring Cloud Data Flow" src="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-flo-create-stream.png"></a></td>
    </tr>
    <tr>
      <td><a href="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-stream-deploy-builder.png"><img width="120" alt="Spring Cloud Data Flow" src="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-stream-deploy-builder.png"></a></td>
      <td><a href="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-task-apps-list.png"><img width="120" alt="Spring Cloud Data Flow" src="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-task-apps-list.png"></a></td>
      <td><a href="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-ctr-flo-tab.png"><img width="120" alt="Spring Cloud Data Flow" src="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-ctr-flo-tab.png"></a></td>
      <td><a href="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-jobs-job-execution-details.png"><img width="120" alt="Spring Cloud Data Flow" src="https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-docs/src/main/asciidoc/images/dataflow-jobs-job-execution-details.png"></a></td>
    </tr>
  </table>
</center>

---

## How To Use

Two build tool chains are supported. Primarily, the **Spring Cloud Data Flow UI** uses [npm][] ([Node.js][]-based) for managing dependencies and the execution of the build. In order to provide easier **Continuous Integration** (CI) support, [Maven][] can also be used to execute the build.

The **Spring Cloud Data Flow Dashboard** uses [Maven][], specifically the [frontend-maven-plugin][] which will actually execute [npm][] underneath. Using the [frontend-maven-plugin][], however, the required tooling, including [Node.js][] will be downloaded, installed and executed for you.

### Building the Project using Maven

Please ensure that at a minimum [Maven][] and [Git][] are available on your system (Using [Maven][] is also the easiest route for Java developers to get started).

	$ git clone https://github.com/spring-cloud/spring-cloud-dataflow-ui.git
	$ cd spring-cloud-dataflow-ui
	$ mvn clean install

This will create `target/spring-cloud-dataflow-ui-1.3.0.BUILD-SNAPSHOT.jar` and also install the build artifact into the local Maven repository.

### Building the Project using npm

For UI development purposes, we recommend using [npm][] directly. Please ensure that at a minimum [Node.js][], [npm][] and the [Angular CLI][] are available on your system. In order to execute the build simply do:

	$ git clone https://github.com/spring-cloud/spring-cloud-dataflow-ui.git
	$ cd spring-cloud-dataflow-ui/ui
	$ npm install
	$ ng build --prod

Before building be sure that the `ng-serve` development server has been shutdown.<br >

**If you want to contribute and help developing the project, please, have a look at the [Developer Guideline](https://github.com/spring-cloud/spring-cloud-dataflow-ui/blob/master/README_DEV.md).**

---

## Acknowledgments

Thanks to [Saucelabs](https://saucelabs.com/) and [Browserstack](https://www.browserstack.com/) for supporting us.
This project uses code from several open source packages:
[Angular](https://angular.io),
[Ngx Bootstrap](https://valor-software.com/),
[RxJS](https://github.com/ReactiveX/rxjs),
[Spring Flo](https://github.com/spring-projects/spring-flo),
[Ngx Toastr](https://github.com/scttcper/ngx-toastr),
[Font Awesome](https://fontawesome.com/v4.7.0/icons/) (...).

This project is powered by:

<a href="https://www.vmware.com/"><img alt="VMWare" width="150" title="VMWare" src="https://i.imgur.com/xlFSgTU.png"></a> <a href="https://spring.io/"><img alt="Spring" title="Spring" src="https://i.imgur.com/az8Xady.png" width="155"></a>

[Angular]: https://angular.io/
[Angular CLI]: https://cli.angular.io/
[frontend-maven-plugin]: https://github.com/eirslett/frontend-maven-plugin
[Git]: https://git-scm.com/
[Maven]: https://maven.apache.org/
[Node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[Protractor]: https://github.com/angular/protractor
