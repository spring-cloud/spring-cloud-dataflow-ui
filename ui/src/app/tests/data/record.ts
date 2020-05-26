export const GET_ACTION_TYPES = [{
  'id': 100,
  'name': 'Create',
  'description': 'Create an Entity',
  'nameWithDescription': 'Create (Create an Entity)',
  'key': 'CREATE'
}, {
  'id': 200,
  'name': 'Delete',
  'description': 'Delete an Entity',
  'nameWithDescription': 'Delete (Delete an Entity)',
  'key': 'DELETE'
}, {
  'id': 300,
  'name': 'Deploy',
  'description': 'Deploy an Entity',
  'nameWithDescription': 'Deploy (Deploy an Entity)',
  'key': 'DEPLOY'
}, {
  'id': 400,
  'name': 'Rollback',
  'description': 'Rollback an Entity',
  'nameWithDescription': 'Rollback (Rollback an Entity)',
  'key': 'ROLLBACK'
}, {
  'id': 500,
  'name': 'Undeploy',
  'description': 'Undeploy an Entity',
  'nameWithDescription': 'Undeploy (Undeploy an Entity)',
  'key': 'UNDEPLOY'
}, {
  'id': 600,
  'name': 'Update',
  'description': 'Update an Entity',
  'nameWithDescription': 'Update (Update an Entity)',
  'key': 'UPDATE'
}];

export const GET_OPERATION_TYPES = [
  { 'id': 100, 'name': 'App Registration', 'key': 'APP_REGISTRATION' },
  { 'id': 200, 'name': 'Schedule', 'key': 'SCHEDULE' },
  { 'id': 300, 'name': 'Stream', 'key': 'STREAM' },
  { 'id': 400, 'name': 'Task', 'key': 'TASK' }
];

export const GET_RECORDS = {
  '_embedded': {
    'auditRecordResourceList': [{
      'auditRecordId': 499,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.1.RELEASE","uri":"docker:springcloudstream/aggregator-processor-kafka:2.1.1.RELEASE","APP_IS_DEFAULT":true,"metaDataUri":null}',
      'createdOn': '2020-05-19T12:47:40Z',
      'auditAction': 'UPDATE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/499' } }
    }, {
      'auditRecordId': 498,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.2.RELEASE","uri":"docker:springcloudstream/aggregator-processor-kafka:2.1.2.RELEASE","APP_IS_DEFAULT":true,"metaDataUri":"maven://org.springframework.cloud.stream.app:aggregator-processor-kafka:jar:metadata:2.1.2.RELEASE"}',
      'createdOn': '2020-05-19T12:47:37Z',
      'auditAction': 'UPDATE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/498' } }
    }, {
      'auditRecordId': 497,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.1.RELEASE","uri":"docker:springcloudstream/aggregator-processor-kafka:2.1.1.RELEASE","APP_IS_DEFAULT":true,"metaDataUri":null}',
      'createdOn': '2020-05-19T12:47:33Z',
      'auditAction': 'UPDATE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/497' } }
    }, {
      'auditRecordId': 496,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.1.RELEASE","uri":"docker:springcloudstream/aggregator-processor-kafka:2.1.1.RELEASE","APP_IS_DEFAULT":false,"metaDataUri":null}',
      'createdOn': '2020-05-19T12:38:17Z',
      'auditAction': 'CREATE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/496' } }
    }, {
      'auditRecordId': 494,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.2.RELEASE","uri":"docker:springcloudstream/aggregator-processor-kafka:2.1.2.RELEASE","APP_IS_DEFAULT":true,"metaDataUri":"maven://org.springframework.cloud.stream.app:aggregator-processor-kafka:jar:metadata:2.1.2.RELEASE"}',
      'createdOn': '2020-05-19T12:30:35Z',
      'auditAction': 'CREATE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/494' } }
    }, {
      'auditRecordId': 492,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.2.RELEASE","uri":"","APP_IS_DEFAULT":false,"metaDataUri":""}',
      'createdOn': '2020-05-19T12:30:21Z',
      'auditAction': 'DELETE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/492' } }
    }, {
      'auditRecordId': 491,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.1.RELEASE","uri":"","APP_IS_DEFAULT":false,"metaDataUri":""}',
      'createdOn': '2020-05-19T12:28:59Z',
      'auditAction': 'DELETE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/491' } }
    }, {
      'auditRecordId': 490,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.1.RELEASE","uri":"docker:springcloudstream/aggregator-processor-kafka:2.1.1.RELEASE","APP_IS_DEFAULT":false,"metaDataUri":null}',
      'createdOn': '2020-05-19T12:28:54Z',
      'auditAction': 'CREATE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/490' } }
    }, {
      'auditRecordId': 488,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.1.RELEASE","uri":"","APP_IS_DEFAULT":false,"metaDataUri":""}',
      'createdOn': '2020-05-19T12:27:45Z',
      'auditAction': 'DELETE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/488' } }
    }, {
      'auditRecordId': 487,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.2.RELEASE","uri":"docker:springcloudstream/aggregator-processor-kafka:2.1.2.RELEASE","APP_IS_DEFAULT":true,"metaDataUri":null}',
      'createdOn': '2020-05-19T12:27:33Z',
      'auditAction': 'CREATE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/487' } }
    }, {
      'auditRecordId': 485,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.2.RELEASE","uri":"","APP_IS_DEFAULT":false,"metaDataUri":""}',
      'createdOn': '2020-05-19T12:26:28Z',
      'auditAction': 'DELETE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/485' } }
    }, {
      'auditRecordId': 484,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.0.RELEASE","uri":"","APP_IS_DEFAULT":false,"metaDataUri":""}',
      'createdOn': '2020-05-19T12:26:14Z',
      'auditAction': 'DELETE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/484' } }
    }, {
      'auditRecordId': 483,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.0.RELEASE","uri":"docker:springcloudstream/aggregator-processor-kafka:2.1.0.RELEASE","APP_IS_DEFAULT":false,"metaDataUri":null}',
      'createdOn': '2020-05-19T12:25:40Z',
      'auditAction': 'CREATE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/483' } }
    }, {
      'auditRecordId': 482,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.1.RELEASE","uri":"docker:springcloudstream/aggregator-processor-kafka:2.1.1.RELEASE","APP_IS_DEFAULT":false,"metaDataUri":null}',
      'createdOn': '2020-05-19T12:25:40Z',
      'auditAction': 'CREATE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/482' } }
    }, {
      'auditRecordId': 479,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.0.RELEASE","uri":"","APP_IS_DEFAULT":false,"metaDataUri":""}',
      'createdOn': '2020-05-19T12:25:01Z',
      'auditAction': 'DELETE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/479' } }
    }, {
      'auditRecordId': 478,
      'createdBy': null,
      'correlationId': 'aggregator',
      'auditData': '{"APP_NAME":"aggregator","APP_TYPE":"processor","APP_VERSION":"2.1.0.RELEASE","uri":"docker:springcloudstream/aggregator-processor-kafka:2.1.0.RELEASE","APP_IS_DEFAULT":false,"metaDataUri":null}',
      'createdOn': '2020-05-18T13:26:22Z',
      'auditAction': 'CREATE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/478' } }
    }, {
      'auditRecordId': 476,
      'createdBy': null,
      'correlationId': 'sample',
      'auditData': '{"APP_NAME":"sample","APP_TYPE":"app","APP_VERSION":"1.0.0.BUILD-SNAPSHOT","uri":"maven://io.spring.cloud:scdf-sample-app:jar:1.0.0.BUILD-SNAPSHOT","APP_IS_DEFAULT":true,"metaDataUri":null}',
      'createdOn': '2020-05-18T13:24:00Z',
      'auditAction': 'CREATE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/476' } }
    }, {
      'auditRecordId': 475,
      'createdBy': null,
      'correlationId': 'sample',
      'auditData': '{"APP_NAME":"sample","APP_TYPE":"app","APP_VERSION":"1.0.1.BUILD-SNAPSHOT","uri":"maven://io.spring.cloud:scdf-sample-app:jar:1.0.1.BUILD-SNAPSHOT","APP_IS_DEFAULT":true,"metaDataUri":null}',
      'createdOn': '2020-05-18T13:24:00Z',
      'auditAction': 'CREATE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/475' } }
    }, {
      'auditRecordId': 474,
      'createdBy': null,
      'correlationId': 'sample',
      'auditData': '{"APP_NAME":"sample","APP_TYPE":"app","APP_VERSION":"1.2.2.BUILD-SNAPSHOT","uri":"maven://io.spring.cloud:scdf-sample-app:jar:1.2.2.BUILD-SNAPSHOT","APP_IS_DEFAULT":true,"metaDataUri":null}',
      'createdOn': '2020-05-18T13:24:00Z',
      'auditAction': 'CREATE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/474' } }
    }, {
      'auditRecordId': 464,
      'createdBy': null,
      'correlationId': 'mmmmm',
      'auditData': '{"APP_NAME":"mmmmm","APP_TYPE":"processor","APP_VERSION":"1.0.0.BUILD-SNAPSHOT","uri":"maven://io.spring.cloud:scdf-sample-app:jar:1.0.0.BUILD-SNAPSHOT","APP_IS_DEFAULT":true,"metaDataUri":null}',
      'createdOn': '2020-05-12T15:16:21Z',
      'auditAction': 'CREATE',
      'auditOperation': 'APP_REGISTRATION',
      'platformName': null,
      '_links': { 'self': { 'href': 'http://localhost:4200/audit-records/464' } }
    }]
  },
  '_links': {
    'first': { 'href': 'http://localhost:4200/audit-records?page=0&size=20&sort=id,desc' },
    'self': { 'href': 'http://localhost:4200/audit-records?page=0&size=20&sort=id,desc' },
    'next': { 'href': 'http://localhost:4200/audit-records?page=1&size=20&sort=id,desc' },
    'last': { 'href': 'http://localhost:4200/audit-records?page=19&size=20&sort=id,desc' }
  },
  'page': { 'size': 20, 'totalElements': 384, 'totalPages': 20, 'number': 0 }
};
