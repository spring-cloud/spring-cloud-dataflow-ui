import { ProtractorPlugin, PluginConfig } from 'protractor';

import * as request from 'request';
import * as requestPromise from 'request-promise-native';
import * as fs from 'fs';
import * as cp from 'child_process';
import * as path from 'path';
import * as execSync from 'child_process';

class ProtractorDockerPlugin implements ProtractorPlugin {

  public config: PluginConfig;

  private readonly destinationFileName = 'docker-compose.yml';
  private readonly destinationFilePath = '.docker/' + this.destinationFileName;
  private readonly dockerComposeCommand = 'docker-compose';

  public async setup() {
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
    } else {
      this.ensureDirectoryExists(this.destinationFilePath);

      console.log('Downloading Docker Compose file from ' + dockerComposeUri);
      console.log('Downloading Docker Compose file to  ' + this.destinationFilePath);

      try {
        await this.downloadFile(dockerComposeUri, this.destinationFilePath);
      } catch (err) {
        console.error('Something went bad while downloading file:', err);
        process.exit(1);
      }
    }

    if (commandExistsSync(this.dockerComposeCommand)) {
      console.log('Found command: ' + this.dockerComposeCommand);
    } else {
      console.log('Did NOT find command: ' + this.dockerComposeCommand);
      process.exit(1);
    }
    process.env['DATAFLOW_VERSION'] = 'latest';
    let stdout = cp.execSync(this.dockerComposeCommand + ' -f ' + this.destinationFilePath + ' up -d');
    console.log('Docker startup command result:' + stdout);
    await this.sleep(dockerComposeWaitTime);
    console.log(`Waited for ${ dockerComposeWaitTime } seconds`);
  }

  public teardown() {
    const shutdownCommand = this.dockerComposeCommand + ' -f ' + this.destinationFilePath + ' stop';
    console.log('Shutting down Docker images: ' + shutdownCommand);
    let stdout = cp.execSync(shutdownCommand);
    console.log('Docker shutdown command result:' + stdout);
  }

  private ensureDirectoryExists(filePath: string) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      console.log('Directory ' + dirname + ' already exists.');
      return true;
    } else {
      console.log('Created directory ' + dirname);
      fs.mkdirSync(dirname);
    }
  }
  private downloadFile (url: string, destinationFilePath: string): Promise<any> {
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
  private sleep(ms: number) {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
  }
}

module.exports = new ProtractorDockerPlugin(); 
