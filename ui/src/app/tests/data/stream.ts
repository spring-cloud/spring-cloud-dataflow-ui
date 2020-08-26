export const GET_STREAM = {
  'name': 'foo',
  'dslText': 'time --spring.cloud.stream.kafka.streams.binder.zkNodes=zookeeper:2181 --foo=bar --spring.cloud.stream.kafka.binder.zkNodes=zookeeper:2181 --spring.cloud.stream.kafka.streams.binder.brokers=PLAINTEXT://kafka-broker:9092 --spring.cloud.stream.kafka.binder.brokers=PLAINTEXT://kafka-broker:9092 | transform --spring.cloud.stream.kafka.streams.binder.zkNodes=zookeeper:2181 --foo=bar --spring.cloud.stream.kafka.binder.zkNodes=zookeeper:2181 --spring.cloud.stream.kafka.streams.binder.brokers=PLAINTEXT://kafka-broker:9092 --spring.cloud.stream.kafka.binder.brokers=PLAINTEXT://kafka-broker:9092 | log --spring.cloud.stream.kafka.streams.binder.zkNodes=zookeeper:2181 --foo=bar --spring.cloud.stream.kafka.binder.zkNodes=zookeeper:2181 --spring.cloud.stream.kafka.streams.binder.brokers=PLAINTEXT://kafka-broker:9092 --spring.cloud.stream.kafka.binder.brokers=PLAINTEXT://kafka-broker:9092',
  'originalDslText': 'time | transform | log',
  'status': 'deployed',
  'description': '',
  'statusDescription': 'The stream has been successfully deployed',
  '_links': { 'self': { 'href': 'http://localhost:4200/streams/definitions/foo' } }
};

export const GET_PLATFORMS = [
  {
    'id': null,
    'name': 'default',
    'type': 'local',
    'description': 'ShutdownTimeout = [30], EnvVarsToInherit = [TMP,LANG,LANGUAGE,LC_.*,PATH,SPRING_APPLICATION_JSON], JavaCmd = [/opt/openjdk/bin/java], WorkingDirectoriesRoot = [/tmp], DeleteFilesOnExit = [true]',
  }
];
export const GET_LOGS = {
  'logs': {
    'foo.file-v1': 'log1',
    'foo.transform-v1': 'log2',
    'foo.log-v1': 'log3'
  }
};
export const GET_DEPLOYMENT_INFO = {
  'streamName': 'foo',
  'dslText': 'file --spring.cloud.stream.kafka.streams.binder.zkNodes=zookeeper:2181 --spring.cloud.stream.kafka.binder.zkNodes=zookeeper:2181 --spring.cloud.stream.kafka.streams.binder.brokers=PLAINTEXT://kafka-broker:9092 --spring.cloud.stream.kafka.binder.brokers=PLAINTEXT://kafka-broker:9092 | transform --spring.cloud.stream.kafka.streams.binder.zkNodes=zookeeper:2181 --spring.cloud.stream.kafka.binder.zkNodes=zookeeper:2181 --spring.cloud.stream.kafka.streams.binder.brokers=PLAINTEXT://kafka-broker:9092 --spring.cloud.stream.kafka.binder.brokers=PLAINTEXT://kafka-broker:9092 | log --spring.cloud.stream.kafka.streams.binder.zkNodes=zookeeper:2181 --spring.cloud.stream.kafka.binder.zkNodes=zookeeper:2181 --spring.cloud.stream.kafka.streams.binder.brokers=PLAINTEXT://kafka-broker:9092 --spring.cloud.stream.kafka.binder.brokers=PLAINTEXT://kafka-broker:9092',
  'description': '',
  'status': 'deploying',
  'deploymentProperties': '{"transform":{"resource":"maven:\\/\\/org.springframework.cloud.stream.app:transform-processor-kafka:jar","spring.cloud.deployer.group":"foo","version":"2.1.2.RELEASE"},"file":{"resource":"maven:\\/\\/org.springframework.cloud.stream.app:file-source-kafka:jar","spring.cloud.deployer.group":"foo","version":"2.1.2.RELEASE"},"log":{"resource":"maven:\\/\\/org.springframework.cloud.stream.app:log-sink-kafka:jar","spring.cloud.deployer.group":"foo","version":"2.1.3.RELEASE"}}',
  '_links': { 'self': { 'href': 'http://localhost:4200/streams/deployments/foo' } }
};
export const GET_STREAM_HISTORY = [{
  'name': 'foo',
  'version': 1,
  'info': {
    'status': { 'statusCode': 'DELETED', 'platformStatus': null },
    'firstDeployed': '2020-05-10T00:18:08.000+0000',
    'lastDeployed': '2020-05-10T00:18:08.000+0000',
    'deleted': null,
    'description': 'Delete complete'
  },
  'configValues': { 'raw': null },
  'manifest': { 'data': '"apiVersion": "skipper.spring.io/v1"\n"kind": "SpringCloudDeployerApplication"\n"metadata":\n  "name": "log"\n"spec":\n  "resource": "maven://org.springframework.cloud.stream.app:log-sink-kafka:jar"\n  "resourceMetadata": "maven://org.springframework.cloud.stream.app:log-sink-kafka:jar:jar:metadata:2.1.3.RELEASE"\n  "version": "2.1.3.RELEASE"\n  "applicationProperties":\n    "spring.cloud.dataflow.stream.app.label": "log"\n    "spring.cloud.stream.kafka.streams.binder.zkNodes": "zookeeper:2181"\n    "spring.cloud.stream.metrics.properties": "spring.application.name,spring.application.index,spring.cloud.application.*,spring.cloud.dataflow.*"\n    "foo": "bar"\n    "spring.cloud.dataflow.stream.name": "foo"\n    "spring.cloud.stream.kafka.streams.binder.brokers": "PLAINTEXT://kafka-broker:9092"\n    "spring.metrics.export.triggers.application.includes": "integration**"\n    "spring.cloud.stream.metrics.key": "foo.log.${spring.cloud.application.guid}"\n    "spring.cloud.stream.bindings.input.group": "foo"\n    "spring.cloud.stream.kafka.binder.zkNodes": "zookeeper:2181"\n    "spring.cloud.dataflow.stream.app.type": "sink"\n    "spring.cloud.stream.bindings.input.destination": "foo.transform"\n    "spring.cloud.stream.kafka.binder.brokers": "PLAINTEXT://kafka-broker:9092"\n  "deploymentProperties":\n    "spring.cloud.deployer.group": "foo"\n---\n"apiVersion": "skipper.spring.io/v1"\n"kind": "SpringCloudDeployerApplication"\n"metadata":\n  "name": "time"\n"spec":\n  "resource": "maven://org.springframework.cloud.stream.app:time-source-kafka:jar"\n  "resourceMetadata": "maven://org.springframework.cloud.stream.app:time-source-kafka:jar:jar:metadata:2.1.2.RELEASE"\n  "version": "2.1.2.RELEASE"\n  "applicationProperties":\n    "spring.cloud.dataflow.stream.app.label": "time"\n    "spring.cloud.stream.kafka.streams.binder.zkNodes": "zookeeper:2181"\n    "spring.cloud.stream.metrics.properties": "spring.application.name,spring.application.index,spring.cloud.application.*,spring.cloud.dataflow.*"\n    "foo": "bar"\n    "spring.cloud.dataflow.stream.name": "foo"\n    "spring.cloud.stream.kafka.streams.binder.brokers": "PLAINTEXT://kafka-broker:9092"\n    "spring.metrics.export.triggers.application.includes": "integration**"\n    "spring.cloud.stream.metrics.key": "foo.time.${spring.cloud.application.guid}"\n    "spring.cloud.stream.bindings.output.producer.requiredGroups": "foo"\n    "spring.cloud.stream.bindings.output.destination": "foo.time"\n    "spring.cloud.stream.kafka.binder.zkNodes": "zookeeper:2181"\n    "spring.cloud.dataflow.stream.app.type": "source"\n    "spring.cloud.stream.kafka.binder.brokers": "PLAINTEXT://kafka-broker:9092"\n  "deploymentProperties":\n    "spring.cloud.deployer.group": "foo"\n---\n"apiVersion": "skipper.spring.io/v1"\n"kind": "SpringCloudDeployerApplication"\n"metadata":\n  "name": "transform"\n"spec":\n  "resource": "maven://org.springframework.cloud.stream.app:transform-processor-kafka:jar"\n  "resourceMetadata": "maven://org.springframework.cloud.stream.app:transform-processor-kafka:jar:jar:metadata:2.1.2.RELEASE"\n  "version": "2.1.2.RELEASE"\n  "applicationProperties":\n    "spring.cloud.dataflow.stream.app.label": "transform"\n    "spring.cloud.stream.kafka.streams.binder.zkNodes": "zookeeper:2181"\n    "spring.cloud.stream.metrics.properties": "spring.application.name,spring.application.index,spring.cloud.application.*,spring.cloud.dataflow.*"\n    "foo": "bar"\n    "spring.cloud.dataflow.stream.name": "foo"\n    "spring.cloud.stream.kafka.streams.binder.brokers": "PLAINTEXT://kafka-broker:9092"\n    "spring.metrics.export.triggers.application.includes": "integration**"\n    "spring.cloud.stream.metrics.key": "foo.transform.${spring.cloud.application.guid}"\n    "spring.cloud.stream.bindings.input.group": "foo"\n    "spring.cloud.stream.bindings.output.producer.requiredGroups": "foo"\n    "spring.cloud.stream.bindings.output.destination": "foo.transform"\n    "spring.cloud.stream.kafka.binder.zkNodes": "zookeeper:2181"\n    "spring.cloud.dataflow.stream.app.type": "processor"\n    "spring.cloud.stream.bindings.input.destination": "foo.time"\n    "spring.cloud.stream.kafka.binder.brokers": "PLAINTEXT://kafka-broker:9092"\n  "deploymentProperties":\n    "spring.cloud.deployer.group": "foo"\n' },
  'platformName': 'default'
}];

export const GET_STREAM_APPLICATIONS = [
  {
    'name': 'time',
    'type': 'source',
    'label': 'time',
    'uri': 'docker:springcloudstream/time-source-kafka:2.1.2.RELEASE',
    'version': '2.1.2.RELEASE',
    'versions': ['2.1.2.RELEASE'],
    'defaultVersion': true,
  },
  {
    'name': 'transform',
    'type': 'processor',
    'label': 'transform',
    'uri': 'docker:springcloudstream/time-source-kafka:2.1.2.RELEASE',
    'version': '2.1.2.RELEASE',
    'versions': ['2.1.2.RELEASE'],
    'defaultVersion': true,
  },
  {
    'name': 'log',
    'type': 'sink',
    'label': 'log',
    'uri': 'docker:springcloudstream/time-source-kafka:2.1.2.RELEASE',
    'version': '2.1.2.RELEASE',
    'versions': ['2.1.2.RELEASE'],
    'defaultVersion': true,
  }
];

export const GET_STREAMS = {
  '_embedded': {
    'streamDefinitionResourceList': [{
      'name': 'foo',
      'dslText': 'time --spring.cloud.stream.kafka.streams.binder.zkNodes=zookeeper:2181 --foo=bar --spring.cloud.stream.kafka.binder.zkNodes=zookeeper:2181 --spring.cloud.stream.kafka.streams.binder.brokers=PLAINTEXT://kafka-broker:9092 --spring.cloud.stream.kafka.binder.brokers=PLAINTEXT://kafka-broker:9092 | transform --spring.cloud.stream.kafka.streams.binder.zkNodes=zookeeper:2181 --foo=bar --spring.cloud.stream.kafka.binder.zkNodes=zookeeper:2181 --spring.cloud.stream.kafka.streams.binder.brokers=PLAINTEXT://kafka-broker:9092 --spring.cloud.stream.kafka.binder.brokers=PLAINTEXT://kafka-broker:9092 | log --spring.cloud.stream.kafka.streams.binder.zkNodes=zookeeper:2181 --foo=bar --spring.cloud.stream.kafka.binder.zkNodes=zookeeper:2181 --spring.cloud.stream.kafka.streams.binder.brokers=PLAINTEXT://kafka-broker:9092 --spring.cloud.stream.kafka.binder.brokers=PLAINTEXT://kafka-broker:9092',
      'originalDslText': 'time | transform | log',
      'status': 'deployed',
      'description': '',
      'statusDescription': 'The stream has been successfully deployed',
      '_links': { 'self': { 'href': 'http://localhost:4200/streams/definitions/foo' } }
    }, {
      'name': 'minutes',
      'dslText': ':time.time > transform --expression=payload.substring(2,4) | log',
      'originalDslText': ':time.time > transform --expression=payload.substring(2,4) | log',
      'status': 'undeployed',
      'description': '',
      'statusDescription': 'The app or group is known to the system, but is not currently deployed',
      '_links': { 'self': { 'href': 'http://localhost:4200/streams/definitions/minutes' } }
    }, {
      'name': 'seconds',
      'dslText': ':time.time > transform --expression=payload.substring(4) | log',
      'originalDslText': ':time.time > transform --expression=payload.substring(4) | log',
      'status': 'undeployed',
      'description': '',
      'statusDescription': 'The app or group is known to the system, but is not currently deployed',
      '_links': { 'self': { 'href': 'http://localhost:4200/streams/definitions/seconds' } }
    }, {
      'name': 'time',
      'dslText': 'time | log',
      'originalDslText': 'time | log',
      'status': 'undeployed',
      'description': '',
      'statusDescription': 'The app or group is known to the system, but is not currently deployed',
      '_links': { 'self': { 'href': 'http://localhost:4200/streams/definitions/time' } }
    }]
  },
  '_links': { 'self': { 'href': 'http://localhost:4200/streams/definitions?page=0&size=20&sort=name,asc' } },
  'page': { 'size': 20, 'totalElements': 4, 'totalPages': 1, 'number': 0 }
};

export const GET_STREAMS_RELATED = {
  '_embedded': {
    'streamDefinitionResourceList': [{
      'name': 'foo',
      'dslText': 'time --spring.cloud.stream.kafka.streams.binder.zkNodes=zookeeper:2181 --foo=bar --spring.cloud.stream.kafka.binder.zkNodes=zookeeper:2181 --spring.cloud.stream.kafka.streams.binder.brokers=PLAINTEXT://kafka-broker:9092 --spring.cloud.stream.kafka.binder.brokers=PLAINTEXT://kafka-broker:9092 | transform --spring.cloud.stream.kafka.streams.binder.zkNodes=zookeeper:2181 --foo=bar --spring.cloud.stream.kafka.binder.zkNodes=zookeeper:2181 --spring.cloud.stream.kafka.streams.binder.brokers=PLAINTEXT://kafka-broker:9092 --spring.cloud.stream.kafka.binder.brokers=PLAINTEXT://kafka-broker:9092 | log --spring.cloud.stream.kafka.streams.binder.zkNodes=zookeeper:2181 --foo=bar --spring.cloud.stream.kafka.binder.zkNodes=zookeeper:2181 --spring.cloud.stream.kafka.streams.binder.brokers=PLAINTEXT://kafka-broker:9092 --spring.cloud.stream.kafka.binder.brokers=PLAINTEXT://kafka-broker:9092',
      'originalDslText': 'time | transform | log',
      'status': 'deployed',
      'description': '',
      'statusDescription': 'The stream has been successfully deployed',
      '_links': { 'self': { 'href': 'http://localhost:4200/streams/definitions/foo' } }
    }]
  },
  '_links': { 'self': { 'href': 'http://localhost:4200/streams/definitions/foo/related?nested=true&page=0&size=20' } },
  'page': { 'size': 20, 'totalElements': 1, 'totalPages': 1, 'number': 0 }
};
