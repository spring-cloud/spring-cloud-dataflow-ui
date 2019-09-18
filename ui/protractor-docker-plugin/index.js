"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
const requestPromise = require("request-promise-native");
const fs = require("fs");
const cp = require("child_process");
const path = require("path");
class ProtractorDockerPlugin {
    constructor() {
        this.destinationFileName = 'docker-compose.yml';
        this.destinationFilePath = '.docker/' + this.destinationFileName;
        this.dockerComposeCommand = 'docker-compose';
        this.defaultDataflowDockerTag = '2.3.0.BUILD-SNAPSHOT';
        this.defaultSkipperDockerTag = '2.2.0.M1';
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env['DATAFLOW_SKIP_DOCKER_COMPOSE'] === 'true') {
                console.log('Skipping Docker Compose Setup of Spring Cloud Dataflow.');
                return;
            }
            console.log('Setting up Docker Compose…');
            let dockerComposeWaitTime = 180000;
            let useCachedoDockerComposeFile = true;
            let dockerComposeUri = 'https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-server/' + this.destinationFileName;
            const commandExistsSync = require('command-exists');
            if (!this.config.dockerComposeUri) {
                console.error('Please specify the dockerComposeUri property.');
                process.exit(1);
            }
            else {
                dockerComposeUri = this.config.dockerComposeUri;
                console.log(`Setting dockerComposeUri to '${dockerComposeUri}'.`);
            }
            if (!this.config.dockerComposeWaitTime) {
                console.log(`Setting dockerComposeWaitTime to DEFAULT value: '${dockerComposeWaitTime}'ms.`);
            }
            else {
                dockerComposeWaitTime = this.config.dockerComposeWaitTime;
                console.log(`Setting dockerComposeWaitTime to value: '${dockerComposeWaitTime}'ms.`);
            }
            if (this.config.useCachedoDockerComposeFile === undefined) {
                console.log(`Setting useCachedoDockerComposeFile to DEFAULT value: '${useCachedoDockerComposeFile}'.`);
            }
            else {
                useCachedoDockerComposeFile = this.config.useCachedoDockerComposeFile;
                console.log(`Setting useCachedoDockerComposeFile to value: '${useCachedoDockerComposeFile}'.`);
            }
            if (fs.existsSync(this.destinationFilePath) && useCachedoDockerComposeFile) {
                console.log(`Docker file exists @ ${this.destinationFilePath}, no need to download`);
            }
            else {
                this.ensureDirectoryExists(this.destinationFilePath);
                console.log('Downloading Docker Compose file from ' + dockerComposeUri);
                console.log('Downloading Docker Compose file to  ' + this.destinationFilePath);
                try {
                    yield this.downloadFile(dockerComposeUri, this.destinationFilePath);
                }
                catch (err) {
                    console.error('Something went bad while downloading file:', err);
                    process.exit(1);
                }
            }
            if (commandExistsSync(this.dockerComposeCommand)) {
                console.log('Found command: ' + this.dockerComposeCommand);
            }
            else {
                console.log('Did not find command: ' + this.dockerComposeCommand);
                process.exit(1);
            }
            if (!process.env['DATAFLOW_VERSION']) {
                process.env['DATAFLOW_VERSION'] = this.defaultDataflowDockerTag;
                console.log(`Setting Data Flow Docker tag to '${process.env['DATAFLOW_VERSION']}'`);
            }
            else {
                console.log(`Using exising Data Flow Docker tag (DATAFLOW_VERSION) '${process.env['DATAFLOW_VERSION']}'`);
            }
            if (!process.env['SKIPPER_VERSION']) {
                process.env['SKIPPER_VERSION'] = this.defaultSkipperDockerTag;
                console.log(`Setting Skipper Docker tag to '${process.env['SKIPPER_VERSION']}'`);
            }
            else {
                console.log(`Using exising Skipper Docker tag (SKIPPER_VERSION) '${process.env['SKIPPER_VERSION']}'`);
            }
            const dockerComposeCommand = this.dockerComposeCommand + ' -f ' + this.destinationFilePath + ' up -d';
            console.log('Docker Compose command: ' + dockerComposeCommand);
            cp.exec(dockerComposeCommand);
            process.chdir(".docker");
            console.log('.docker directory: ' + cp.execSync('ls -al'));
            let isUp = yield this.isDataFlowUp();
            console.log(`Waited for ${dockerComposeWaitTime} seconds and SCDF process is up: ` + isUp);
            process.chdir("..");
            // Docker Container is up but SCDF has not started yet
            // We may need to implement a better health-check in the Docker image
            yield protractor_1.browser.sleep(60000);
        });
    }
    isDataFlowUp() {
        return __awaiter(this, void 0, void 0, function* () {
            const localThis = this;
            return yield new Promise(resolve => {
                let timeout = setTimeout(function timeOutFunction() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const isUp = doCheck();
                        console.log('Is Docker up? ' + isUp);
                        console.log('Docker Compose processes: ' + cp.execSync('docker-compose ps'));
                        if (!isUp) {
                            timeout = setTimeout(timeOutFunction, 2000);
                        }
                        else {
                            resolve(true);
                        }
                    });
                }, 2000);
                setTimeout(() => {
                    console.log('Cancelling Data Flow Server check.');
                    clearTimeout(timeout);
                    resolve(false);
                }, 500000);
                function doCheck() {
                    try {
                        cp.execSync(localThis.dockerComposeCommand + ' exec -T dataflow-server echo "Data Flow Server is up"');
                        return true;
                    }
                    catch (error) {
                        return false;
                    }
                }
            });
        });
    }
    teardown() {
        if (process.env['DATAFLOW_SKIP_DOCKER_COMPOSE'] === 'true') {
            return;
        }
        const shutdownCommand = this.dockerComposeCommand + ' -f ' + this.destinationFilePath + ' stop';
        console.log('Shutting down Docker images: ' + shutdownCommand);
        let stdout = cp.execSync(shutdownCommand);
        console.log('Docker shutdown command result:' + stdout);
    }
    ensureDirectoryExists(filePath) {
        const dirname = path.dirname(filePath);
        if (fs.existsSync(dirname)) {
            console.log('Directory ' + dirname + ' already exists.');
            return true;
        }
        else {
            console.log('Created directory ' + dirname);
            fs.mkdirSync(dirname);
        }
    }
    downloadFile(url, destinationFilePath) {
        console.log('Start downloading file from ' + url);
        const requestPromiseCall = requestPromise.get(url, { json: false }, (error, response, body) => {
            console.log('content-type:', response.headers['content-type']);
            console.log('content-length:', response.headers['content-length']);
            if (response.statusCode < 200 || response.statusCode > 299) {
                throw new Error('Failed to load page, status code: ' + response.statusCode);
            }
            return body;
        }).then(body => {
            const buffer = Buffer.from(body, 'utf8');
            fs.writeFileSync(destinationFilePath, buffer);
            console.log('File downloaded!');
        });
        return requestPromiseCall;
    }
    sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
}
module.exports = new ProtractorDockerPlugin();
//# sourceMappingURL=index.js.map