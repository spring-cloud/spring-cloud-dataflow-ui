export const CONFIG = {
  'id': 'foo',
  'platform': {
    'id': 'platform', 'name': 'platform', 'form': 'select', 'type': 'java.lang.String', 'defaultValue': '', 'values': [{
      'key': 'default',
      'name': 'default',
      'type': 'local',
      'options': [{
        'id': 'spring.cloud.deployer.local.debug-suspend',
        'name': 'debug-suspend',
        'type': 'java.lang.String',
        'description': null,
        'shortDescription': null,
        'defaultValue': null,
        'hints': {
          'keyHints': [],
          'keyProviders': [],
          'valueHints': [{ 'value': 'y', 'description': null, 'shortDescription': null }, {
            'value': 'n',
            'description': null,
            'shortDescription': null
          }],
          'valueProviders': []
        },
        'deprecation': null,
        'deprecated': false
      }, {
        'id': 'spring.cloud.deployer.local.working-directories-root',
        'name': 'working-directories-root',
        'type': 'java.nio.file.Path',
        'description': 'Directory in which all created processes will run and create log files.',
        'shortDescription': 'Directory in which all created processes will run and create log files.',
        'defaultValue': null,
        'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
        'deprecation': null,
        'deprecated': false
      }, {
        'id': 'spring.cloud.deployer.local.java-opts',
        'name': 'java-opts',
        'type': 'java.lang.String',
        'description': 'The Java Options to pass to the JVM, e.g -Dtest=foo',
        'shortDescription': 'The Java Options to pass to the JVM, e.g -Dtest=foo',
        'defaultValue': null,
        'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
        'deprecation': null,
        'deprecated': false
      }, {
        'id': 'spring.cloud.deployer.local.use-spring-application-json',
        'name': 'use-spring-application-json',
        'type': 'java.lang.Boolean',
        'description': 'Flag to indicate whether application properties are passed as command line args or in a ' +
          'SPRING_APPLICATION_JSON environment variable. Default value is {@code true}.',
        'shortDescription': 'Flag to indicate whether application properties are passed as command line args or ' +
          'in a SPRING_APPLICATION_JSON environment variable.',
        'defaultValue': true,
        'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
        'deprecation': null,
        'deprecated': false
      }, {
        'id': 'spring.cloud.deployer.local.inherit-logging',
        'name': 'inherit-logging',
        'type': 'java.lang.Boolean',
        'description': null,
        'shortDescription': null,
        'defaultValue': false,
        'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
        'deprecation': null,
        'deprecated': false
      }, {
        'id': 'spring.cloud.deployer.local.debug-port',
        'name': 'debug-port',
        'type': 'java.lang.Integer',
        'description': null,
        'shortDescription': null,
        'defaultValue': null,
        'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
        'deprecation': null,
        'deprecated': false
      }, {
        'id': 'spring.cloud.deployer.local.delete-files-on-exit',
        'name': 'delete-files-on-exit',
        'type': 'java.lang.Boolean',
        'description': 'Whether to delete created files and directories on JVM exit.',
        'shortDescription': 'Whether to delete created files and directories on JVM exit.',
        'defaultValue': true,
        'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
        'deprecation': null,
        'deprecated': false
      }, {
        'id': 'spring.cloud.deployer.local.env-vars-to-inherit',
        'name': 'env-vars-to-inherit',
        'type': 'java.lang.String[]',
        'description': 'Array of regular expression patterns for environment variables that should be passed to ' +
          'launched applications.',
        'shortDescription': 'Array of regular expression patterns for environment variables that should be ' +
          'passed to launched applications.',
        'defaultValue': null,
        'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
        'deprecation': null,
        'deprecated': false
      }, {
        'id': 'spring.cloud.deployer.local.java-cmd',
        'name': 'java-cmd',
        'type': 'java.lang.String',
        'description': 'The command to run java.',
        'shortDescription': 'The command to run java.',
        'defaultValue': null,
        'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
        'deprecation': null,
        'deprecated': false
      }, {
        'id': 'spring.cloud.deployer.local.shutdown-timeout',
        'name': 'shutdown-timeout',
        'type': 'java.lang.Integer',
        'description': 'Maximum number of seconds to wait for application shutdown. via the {@code /shutdown} ' +
          'endpoint. A timeout value of 0 specifies an infinite timeout. Default is 30 seconds.',
        'shortDescription': 'Maximum number of seconds to wait for application shutdown. via the {@code /shutdown} ' +
          'endpoint.',
        'defaultValue': 30,
        'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
        'deprecation': null,
        'deprecated': false
      }, {
        'id': 'spring.cloud.deployer.local.port-range.high',
        'name': 'high',
        'type': 'java.lang.Integer',
        'description': 'Upper bound for computing applications\'s random port.',
        'shortDescription': 'Upper bound for computing applications\'s random port.',
        'defaultValue': 61000,
        'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
        'deprecation': null,
        'deprecated': false
      }, {
        'id': 'spring.cloud.deployer.local.port-range.low',
        'name': 'low',
        'type': 'java.lang.Integer',
        'description': 'Lower bound for computing applications\'s random port.',
        'shortDescription': 'Lower bound for computing applications\'s random port.',
        'defaultValue': 20000,
        'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
        'deprecation': null,
        'deprecated': false
      }]
    }]
  },
  'apps': [{
    'origin': 'file',
    'name': 'file',
    'type': 'source',
    'version': '2.1.2.RELEASE',
    'versions': [{
      'name': 'file',
      'type': 'source',
      'uri': 'maven://org.springframework.cloud.stream.app:file-source-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': true
    }],
    'options': null,
    'optionsState': { 'isLoading': false, 'isOnError': false, 'isInvalid': false }
  }, {
    'origin': 'log',
    'name': 'log',
    'type': 'sink',
    'version': '2.1.3.RELEASE',
    'versions': [{
      'name': 'log',
      'type': 'sink',
      'uri': 'maven://org.springframework.cloud.stream.app:log-sink-kafka:2.1.3.RELEASE',
      'version': '2.1.3.RELEASE',
      'defaultVersion': true
    }],
    'options': null,
    'optionsState': { 'isLoading': false, 'isOnError': false, 'isInvalid': false }
  }],
  'deployers': [{
    'id': 'memory',
    'name': 'memory',
    'form': 'autocomplete',
    'type': 'java.lang.Integer',
    'value': null,
    'defaultValue': null,
    'suffix': 'MB'
  }, {
    'id': 'cpu',
    'name': 'cpu',
    'form': 'autocomplete',
    'type': 'java.lang.Integer',
    'value': null,
    'defaultValue': null,
    'suffix': 'Core(s)'
  }, {
    'id': 'disk',
    'name': 'disk',
    'form': 'autocomplete',
    'type': 'java.lang.Integer',
    'value': null,
    'defaultValue': null,
    'suffix': 'MB'
  }, {
    'id': 'count',
    'name': 'count',
    'form': 'autocomplete',
    'type': 'java.lang.Integer',
    'value': null,
    'defaultValue': null
  }]
};

export const APP_DETAILS = [{
  'id': 'log.name',
  'name': 'name',
  'description': 'The name of the logger to use.',
  'shortDescription': 'The name of the logger to use.',
  'isDeprecated': false,
  'type': 'java.lang.String',
  'isSemantic': true
}, {
  'id': 'log.level',
  'name': 'level',
  'description': 'The level at which to log messages.',
  'shortDescription': 'The level at which to log messages.',
  'isDeprecated': false,
  'type': 'org.springframework.integration.handler.LoggingHandler$Level',
  'isSemantic': true
}, {
  'id': 'log.expression',
  'name': 'expression',
  'description': 'A SpEL expression (against the incoming message) to evaluate as the logged message.',
  'shortDescription': 'A SpEL expression (against the incoming message) to evaluate as the logged message.',
  'isDeprecated': false,
  'type': 'java.lang.String',
  'defaultValue': 'payload',
  'isSemantic': true
}];

