# Protractor Docker Plugin

This [Protractor][] plugin will startup and shutdown a [Docker][] container using [Docker Compose][].

# Requirements for using the Plugin

- [Docker][]
- [Docker Compose][] command is available in the path

# Requirements for building the Plugin

- [TypeScript][] (`tsc` command should be available on your path)

# Building

Simply execute:

```bash
$ tsc
```

This will generate the `index.js` file.

# Using the Plugin

Add the plugin to your `protractor.conf.js` file:

```javascript
exports.config = {
  plugins: [
    {
      path: 'protractor-docker-plugin/index.js',
      dockerComposeUri: 'https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-server-local/docker-compose.yml',
      useCachedoDockerComposeFile: true
    }
  ],
```

## Config properties:

* **path** *Mandatory*, specifies the plugin itself. Point to the generated JavaScript file
* **dockerComposeUri** *Mandatory*, specifies the URL of the [Docker Compose][] YAML file
* **useCachedoDockerComposeFile** *Optional*, specifies whether the downloaded [Docker Compose][] YAML file shall be reused or not

[Docker]: https://www.docker.com/
[Docker Compose]: https://docs.docker.com/compose/
[TypeScript]: https://www.typescriptlang.org/
[Protractor]: https://github.com/angular/protractor

