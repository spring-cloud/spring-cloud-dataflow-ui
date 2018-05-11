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
const requestPromise = require("request-promise-native");
const fs = require("fs");
const cp = require("child_process");
const path = require("path");
class ProtractorDockerPlugin {
    constructor() {
        this.destinationFileName = 'docker-compose.yml';
        this.destinationFilePath = '.docker/' + this.destinationFileName;
        this.dockerComposeCommand = 'docker-compose';
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up Docker Compose…');
            let dockerComposeWaitTime = 30000;
            let useCachedoDockerComposeFile = true;
            let dockerComposeUri = 'https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-server-local/' + this.destinationFileName;
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
                console.log('Did NOT find command: ' + this.dockerComposeCommand);
                process.exit(1);
            }
            process.env['DATAFLOW_VERSION'] = 'latest';
            let stdout = cp.execSync(this.dockerComposeCommand + ' -f ' + this.destinationFilePath + ' up -d');
            console.log('Docker startup command result:' + stdout);
            yield this.sleep(dockerComposeWaitTime);
            console.log(`Waited for ${dockerComposeWaitTime} seconds`);
        });
    }
    teardown() {
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