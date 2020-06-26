export const GET_APP = {
  'name': 'aggregator',
  'type': 'processor',
  'uri': 'docker:springcloudstream/aggregator-processor-kafka:2.1.2.RELEASE',
  'version': '2.1.2.RELEASE',
  'defaultVersion': false,
  'options': [{
    'id': 'aggregator.group-timeout',
    'name': 'group-timeout',
    'type': 'org.springframework.expression.Expression',
    'description': 'SpEL expression for timeout to expiring uncompleted groups',
    'shortDescription': 'SpEL expression for timeout to expiring uncompleted groups',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'aggregator.message-store-entity',
    'name': 'message-store-entity',
    'type': 'java.lang.String',
    'description': 'Persistence message store entity: table prefix in RDBMS, collection name in MongoDb, etc',
    'shortDescription': 'Persistence message store entity: table prefix in RDBMS, collection name in MongoDb, etc',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'aggregator.release',
    'name': 'release',
    'type': 'org.springframework.expression.Expression',
    'description': 'SpEL expression for release strategy. Default is based on the sequenceSize header',
    'shortDescription': 'SpEL expression for release strategy.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'aggregator.correlation',
    'name': 'correlation',
    'type': 'org.springframework.expression.Expression',
    'description': 'SpEL expression for correlation key. Default to correlationId header',
    'shortDescription': 'SpEL expression for correlation key.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'aggregator.message-store-type',
    'name': 'message-store-type',
    'type': 'java.lang.String',
    'description': 'Message store type',
    'shortDescription': 'Message store type',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'aggregator.aggregation',
    'name': 'aggregation',
    'type': 'org.springframework.expression.Expression',
    'description': 'SpEL expression for aggregation strategy. Default is collection of payloads',
    'shortDescription': 'SpEL expression for aggregation strategy.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.mongodb.embedded.version',
    'name': 'version',
    'type': 'java.lang.String',
    'description': 'Version of Mongo to use.',
    'shortDescription': 'Version of Mongo to use.',
    'defaultValue': '3.5.5',
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.mongodb.embedded.features',
    'name': 'features',
    'type': 'java.util.Set<de.flapdoodle.embed.mongo.distribution.Feature>',
    'description': 'Comma-separated list of features to enable. Uses the defaults of the configured version by default.',
    'shortDescription': 'Comma-separated list of features to enable.',
    'defaultValue': ['sync_delay'],
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.data-username',
    'name': 'data-username',
    'type': 'java.lang.String',
    'description': 'Username of the database to execute DML scripts (if different).',
    'shortDescription': 'Username of the database to execute DML scripts (if different).',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.schema-password',
    'name': 'schema-password',
    'type': 'java.lang.String',
    'description': 'Password of the database to execute DDL scripts (if different).',
    'shortDescription': 'Password of the database to execute DDL scripts (if different).',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.data',
    'name': 'data',
    'type': 'java.util.List<java.lang.String>',
    'description': 'Data (DML) script resource references.',
    'shortDescription': 'Data (DML) script resource references.',
    'defaultValue': null,
    'hints': {
      'keyHints': [],
      'keyProviders': [],
      'valueHints': [],
      'valueProviders': [{
        'name': 'handle-as',
        'parameters': { 'target': 'java.util.List<org.springframework.core.io.Resource>' }
      }]
    },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.data-password',
    'name': 'data-password',
    'type': 'java.lang.String',
    'description': 'Password of the database to execute DML scripts (if different).',
    'shortDescription': 'Password of the database to execute DML scripts (if different).',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.schema-username',
    'name': 'schema-username',
    'type': 'java.lang.String',
    'description': 'Username of the database to execute DDL scripts (if different).',
    'shortDescription': 'Username of the database to execute DDL scripts (if different).',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.name',
    'name': 'name',
    'type': 'java.lang.String',
    'description': 'Name of the datasource. Default to "testdb" when using an embedded database.',
    'shortDescription': 'Name of the datasource.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.password',
    'name': 'password',
    'type': 'java.lang.String',
    'description': 'Login password of the database.',
    'shortDescription': 'Login password of the database.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.driver-class-name',
    'name': 'driver-class-name',
    'type': 'java.lang.String',
    'description': 'Fully qualified name of the JDBC driver. Auto-detected based on the URL by default.',
    'shortDescription': 'Fully qualified name of the JDBC driver.',
    'defaultValue': null,
    'hints': {
      'keyHints': [],
      'keyProviders': [],
      'valueHints': [],
      'valueProviders': [{ 'name': 'class-reference', 'parameters': { 'target': 'java.sql.Driver' } }]
    },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.generate-unique-name',
    'name': 'generate-unique-name',
    'type': 'java.lang.Boolean',
    'description': 'Whether to generate a random datasource name.',
    'shortDescription': 'Whether to generate a random datasource name.',
    'defaultValue': false,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.initialization-mode',
    'name': 'initialization-mode',
    'type': 'org.springframework.boot.jdbc.DataSourceInitializationMode',
    'description': 'Initialize the datasource with available DDL and DML scripts.',
    'shortDescription': 'Initialize the datasource with available DDL and DML scripts.',
    'defaultValue': 'embedded',
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.username',
    'name': 'username',
    'type': 'java.lang.String',
    'description': 'Login username of the database.',
    'shortDescription': 'Login username of the database.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.schema',
    'name': 'schema',
    'type': 'java.util.List<java.lang.String>',
    'description': 'Schema (DDL) script resource references.',
    'shortDescription': 'Schema (DDL) script resource references.',
    'defaultValue': null,
    'hints': {
      'keyHints': [],
      'keyProviders': [],
      'valueHints': [],
      'valueProviders': [{
        'name': 'handle-as',
        'parameters': { 'target': 'java.util.List<org.springframework.core.io.Resource>' }
      }]
    },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.url',
    'name': 'url',
    'type': 'java.lang.String',
    'description': 'JDBC URL of the database.',
    'shortDescription': 'JDBC URL of the database.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.sql-script-encoding',
    'name': 'sql-script-encoding',
    'type': 'java.nio.charset.Charset',
    'description': 'SQL scripts encoding.',
    'shortDescription': 'SQL scripts encoding.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.separator',
    'name': 'separator',
    'type': 'java.lang.String',
    'description': 'Statement separator in SQL initialization scripts.',
    'shortDescription': 'Statement separator in SQL initialization scripts.',
    'defaultValue': ';',
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.jndi-name',
    'name': 'jndi-name',
    'type': 'java.lang.String',
    'description': 'JNDI location of the datasource. Class, url, username & password are ignored when set.',
    'shortDescription': 'JNDI location of the datasource.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.continue-on-error',
    'name': 'continue-on-error',
    'type': 'java.lang.Boolean',
    'description': 'Whether to stop if an error occurs while initializing the database.',
    'shortDescription': 'Whether to stop if an error occurs while initializing the database.',
    'defaultValue': false,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.platform',
    'name': 'platform',
    'type': 'java.lang.String',
    'description': 'Platform to use in the DDL or DML scripts (such as schema-${platform}.sql or data-${platform}.sql).',
    'shortDescription': 'Platform to use in the DDL or DML scripts (such as schema-${platform}.sql or data-${platform}.sql).',
    'defaultValue': 'all',
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.datasource.type',
    'name': 'type',
    'type': 'java.lang.Class<? extends javax.sql.DataSource>',
    'description': 'Fully qualified name of the connection pool implementation to use. By default, it is auto-detected from the classpath.',
    'shortDescription': 'Fully qualified name of the connection pool implementation to use.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.data.mongodb.authentication-database',
    'name': 'authentication-database',
    'type': 'java.lang.String',
    'description': 'Authentication database name.',
    'shortDescription': 'Authentication database name.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.data.mongodb.username',
    'name': 'username',
    'type': 'java.lang.String',
    'description': 'Login user of the mongo server. Cannot be set with URI.',
    'shortDescription': 'Login user of the mongo server.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.data.mongodb.database',
    'name': 'database',
    'type': 'java.lang.String',
    'description': 'Database name.',
    'shortDescription': 'Database name.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.data.mongodb.grid-fs-database',
    'name': 'grid-fs-database',
    'type': 'java.lang.String',
    'description': 'GridFS database name.',
    'shortDescription': 'GridFS database name.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.data.mongodb.field-naming-strategy',
    'name': 'field-naming-strategy',
    'type': 'java.lang.Class<?>',
    'description': 'Fully qualified name of the FieldNamingStrategy to use.',
    'shortDescription': 'Fully qualified name of the FieldNamingStrategy to use.',
    'defaultValue': null,
    'hints': {
      'keyHints': [],
      'keyProviders': [],
      'valueHints': [],
      'valueProviders': [{
        'name': 'class-reference',
        'parameters': { 'target': 'org.springframework.data.mapping.model.FieldNamingStrategy' }
      }]
    },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.data.mongodb.password',
    'name': 'password',
    'type': 'java.lang.Character[]',
    'description': 'Login password of the mongo server. Cannot be set with URI.',
    'shortDescription': 'Login password of the mongo server.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.data.mongodb.port',
    'name': 'port',
    'type': 'java.lang.Integer',
    'description': 'Mongo server port. Cannot be set with URI.',
    'shortDescription': 'Mongo server port.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.data.mongodb.uri',
    'name': 'uri',
    'type': 'java.lang.String',
    'description': 'Mongo database URI. Cannot be set with host, port and credentials.',
    'shortDescription': 'Mongo database URI.',
    'defaultValue': 'mongodb://localhost/test',
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.data.mongodb.host',
    'name': 'host',
    'type': 'java.lang.String',
    'description': 'Mongo server host. Cannot be set with URI.',
    'shortDescription': 'Mongo server host.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.redis.database',
    'name': 'database',
    'type': 'java.lang.Integer',
    'description': 'Database index used by the connection factory.',
    'shortDescription': 'Database index used by the connection factory.',
    'defaultValue': 0,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.redis.password',
    'name': 'password',
    'type': 'java.lang.String',
    'description': 'Login password of the redis server.',
    'shortDescription': 'Login password of the redis server.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.redis.ssl',
    'name': 'ssl',
    'type': 'java.lang.Boolean',
    'description': 'Whether to enable SSL support.',
    'shortDescription': 'Whether to enable SSL support.',
    'defaultValue': false,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.redis.url',
    'name': 'url',
    'type': 'java.lang.String',
    'description': 'Connection URL. Overrides host, port, and password. User is ignored. Example: redis://user:password@example.com:6379',
    'shortDescription': 'Connection URL.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.redis.host',
    'name': 'host',
    'type': 'java.lang.String',
    'description': 'Redis server host.',
    'shortDescription': 'Redis server host.',
    'defaultValue': 'localhost',
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.redis.port',
    'name': 'port',
    'type': 'java.lang.Integer',
    'description': 'Redis server port.',
    'shortDescription': 'Redis server port.',
    'defaultValue': 6379,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }, {
    'id': 'spring.redis.timeout',
    'name': 'timeout',
    'type': 'java.time.Duration',
    'description': 'Connection timeout.',
    'shortDescription': 'Connection timeout.',
    'defaultValue': null,
    'hints': { 'keyHints': [], 'keyProviders': [], 'valueHints': [], 'valueProviders': [] },
    'deprecation': null,
    'deprecated': false
  }],
  'shortDescription': null
};

export const GET_APPS = {
  '_embedded': {
    'appRegistrationResourceList': [{
      'name': 'aggregator',
      'type': 'processor',
      'uri': 'maven://org.springframework.cloud.stream.app:aggregator-processor-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.1.RELEASE', '2.1.2.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/processor/aggregator/2.1.2.RELEASE' } }
    }, {
      'name': 'bridge',
      'type': 'processor',
      'uri': 'maven://org.springframework.cloud.stream.app:bridge-processor-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.2.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/processor/bridge/2.1.2.RELEASE' } }
    }, {
      'name': 'cassandra',
      'type': 'sink',
      'uri': 'maven://org.springframework.cloud.stream.app:cassandra-sink-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.2.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/sink/cassandra/2.1.2.RELEASE' } }
    }, {
      'name': 'cdc-debezium',
      'type': 'source',
      'uri': 'maven://org.springframework.cloud.stream.app:cdc-debezium-source-kafka:1.0.1.RELEASE',
      'version': '1.0.1.RELEASE',
      'defaultVersion': true,
      'versions': ['1.0.1.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/source/cdc-debezium/1.0.1.RELEASE' } }
    }, {
      'name': 'composed-task-runner',
      'type': 'task',
      'uri': 'maven://org.springframework.cloud.task.app:composedtaskrunner-task:2.1.4.RELEASE',
      'version': '2.1.4.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.4.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/task/composed-task-runner/2.1.4.RELEASE' } }
    }, {
      'name': 'counter',
      'type': 'sink',
      'uri': 'maven://org.springframework.cloud.stream.app:counter-sink-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.2.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/sink/counter/2.1.2.RELEASE' } }
    }, {
      'name': 'counter',
      'type': 'processor',
      'uri': 'maven://org.springframework.cloud.stream.app:counter-processor-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.2.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/processor/counter/2.1.2.RELEASE' } }
    }, {
      'name': 'file',
      'type': 'source',
      'uri': 'maven://org.springframework.cloud.stream.app:file-source-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.2.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/source/file/2.1.2.RELEASE' } }
    }, {
      'name': 'file',
      'type': 'sink',
      'uri': 'maven://org.springframework.cloud.stream.app:file-sink-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.2.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/sink/file/2.1.2.RELEASE' } }
    }, {
      'name': 'filter',
      'type': 'processor',
      'uri': 'maven://org.springframework.cloud.stream.app:filter-processor-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.2.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/processor/filter/2.1.2.RELEASE' } }
    }, {
      'name': 'ftp',
      'type': 'source',
      'uri': 'maven://org.springframework.cloud.stream.app:ftp-source-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.2.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/source/ftp/2.1.2.RELEASE' } }
    }, {
      'name': 'ftp',
      'type': 'sink',
      'uri': 'maven://org.springframework.cloud.stream.app:ftp-sink-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.2.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/sink/ftp/2.1.2.RELEASE' } }
    }, {
      'name': 'gemfire',
      'type': 'sink',
      'uri': 'maven://org.springframework.cloud.stream.app:gemfire-sink-kafka:2.1.4.RELEASE',
      'version': '2.1.4.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.4.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/sink/gemfire/2.1.4.RELEASE' } }
    }, {
      'name': 'gemfire',
      'type': 'source',
      'uri': 'maven://org.springframework.cloud.stream.app:gemfire-source-kafka:2.1.4.RELEASE',
      'version': '2.1.4.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.4.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/source/gemfire/2.1.4.RELEASE' } }
    }, {
      'name': 'gemfire-cq',
      'type': 'source',
      'uri': 'maven://org.springframework.cloud.stream.app:gemfire-cq-source-kafka:2.1.4.RELEASE',
      'version': '2.1.4.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.4.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/source/gemfire-cq/2.1.4.RELEASE' } }
    }, {
      'name': 'groovy-filter',
      'type': 'processor',
      'uri': 'maven://org.springframework.cloud.stream.app:groovy-filter-processor-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.2.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/processor/groovy-filter/2.1.2.RELEASE' } }
    }, {
      'name': 'groovy-transform',
      'type': 'processor',
      'uri': 'maven://org.springframework.cloud.stream.app:groovy-transform-processor-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.2.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/processor/groovy-transform/2.1.2.RELEASE' } }
    }, {
      'name': 'grpc',
      'type': 'processor',
      'uri': 'maven://org.springframework.cloud.stream.app:grpc-processor-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.2.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/processor/grpc/2.1.2.RELEASE' } }
    }, {
      'name': 'hdfs',
      'type': 'sink',
      'uri': 'maven://org.springframework.cloud.stream.app:hdfs-sink-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.2.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/sink/hdfs/2.1.2.RELEASE' } }
    }, {
      'name': 'header-enricher',
      'type': 'processor',
      'uri': 'maven://org.springframework.cloud.stream.app:header-enricher-processor-kafka:2.1.3.RELEASE',
      'version': '2.1.3.RELEASE',
      'defaultVersion': true,
      'versions': ['2.1.3.RELEASE'],
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/processor/header-enricher/2.1.3.RELEASE' } }
    }]
  },
  '_links': {
    'first': { 'href': 'http://localhost:4200/apps?page=0&size=20&sort=name,asc' },
    'self': { 'href': 'http://localhost:4200/apps?page=0&size=20&sort=name,asc' },
    'next': { 'href': 'http://localhost:4200/apps?page=1&size=20&sort=name,asc' },
    'last': { 'href': 'http://localhost:4200/apps?page=3&size=20&sort=name,asc' }
  },
  'page': { 'size': 20, 'totalElements': 69, 'totalPages': 4, 'number': 0 }
};

export const GET_APP_VERSIONS = {
  '_embedded': {
    'appRegistrationResourceList': [{
      'name': 'aggregator',
      'type': 'processor',
      'uri': 'docker:springcloudstream/aggregator-processor-kafka:2.1.2.RELEASE',
      'version': '2.1.2.RELEASE',
      'defaultVersion': false,
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/processor/aggregator/2.1.2.RELEASE' } }
    }, {
      'name': 'aggregator',
      'type': 'processor',
      'uri': 'docker:springcloudstream/aggregator-processor-kafka:2.1.1.RELEASE',
      'version': '2.1.1.RELEASE',
      'defaultVersion': true,
      '_links': { 'self': { 'href': 'http://localhost:4200/apps/processor/aggregator/2.1.1.RELEASE' } }
    }]
  },
  '_links': { 'self': { 'href': 'http://localhost:4200/apps?page=0&size=20&sort=name,asc' } },
  'page': { 'size': 20, 'totalElements': 2, 'totalPages': 1, 'number': 0 }
};
