export const GET_JOBS_EXECUTIONS = {
  '_embedded': {
    'jobExecutionResourceList': [{
      'executionId': 2,
      'stepExecutionCount': 1,
      'jobId': 2,
      'taskExecutionId': 3,
      'name': 'job2',
      'startDate': '2020-08-12',
      'startTime': '09:12:09',
      'duration': '00:00:01',
      'jobExecution': {
        'id': 2,
        'version': 2,
        'jobParameters': {
          'parameters': {
            '-spring.cloud.task.executionid': {
              'identifying': false,
              'value': '3',
              'type': 'STRING'
            }, '-spring.cloud.data.flow.platformname': { 'identifying': false, 'value': 'default', 'type': 'STRING' }
          }, 'empty': false
        },
        'jobInstance': { 'id': 2, 'version': null, 'jobName': 'job2', 'instanceId': 2 },
        'stepExecutions': [{
          'id': 2,
          'version': 3,
          'stepName': 'job2step1',
          'status': 'COMPLETED',
          'readCount': 0,
          'writeCount': 0,
          'commitCount': 1,
          'rollbackCount': 0,
          'readSkipCount': 0,
          'processSkipCount': 0,
          'writeSkipCount': 0,
          'startTime': '2020-08-12T09:12:10.000+0000',
          'endTime': '2020-08-12T09:12:10.000+0000',
          'lastUpdated': '2020-08-12T09:12:10.000+0000',
          'executionContext': { 'dirty': false, 'empty': true, 'values': [] },
          'exitStatus': { 'exitCode': 'COMPLETED', 'exitDescription': '', 'running': false },
          'terminateOnly': false,
          'filterCount': 0,
          'failureExceptions': [],
          'skipCount': 0,
          'summary': 'StepExecution: id=2, version=3, name=job2step1, status=COMPLETED, exitStatus=COMPLETED, readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0',
          'jobParameters': {
            'parameters': {
              '-spring.cloud.task.executionid': {
                'identifying': false,
                'value': '3',
                'type': 'STRING'
              },
              '-spring.cloud.data.flow.platformname': { 'identifying': false, 'value': 'default', 'type': 'STRING' }
            }, 'empty': false
          },
          'jobExecutionId': 2
        }],
        'status': 'COMPLETED',
        'startTime': '2020-08-12T09:12:09.000+0000',
        'createTime': '2020-08-12T09:12:09.000+0000',
        'endTime': '2020-08-12T09:12:10.000+0000',
        'lastUpdated': '2020-08-12T09:12:10.000+0000',
        'exitStatus': { 'exitCode': 'COMPLETED', 'exitDescription': '', 'running': false },
        'executionContext': { 'dirty': false, 'empty': true, 'values': [] },
        'failureExceptions': [],
        'jobConfigurationName': null,
        'running': false,
        'jobId': 2,
        'stopping': false,
        'allFailureExceptions': []
      },
      'jobParameters': { '--spring.cloud.data.flow.platformname': 'default', '--spring.cloud.task.executionid': '3' },
      'jobParametersString': '--spring.cloud.data.flow.platformname=default,--spring.cloud.task.executionid=3',
      'restartable': false,
      'abandonable': false,
      'stoppable': false,
      'defined': true,
      'timeZone': 'UTC',
      '_links': { 'self': { 'href': 'http://localhost:9393/jobs/executions/2' } }
    }, {
      'executionId': 1,
      'stepExecutionCount': 1,
      'jobId': 1,
      'taskExecutionId': 3,
      'name': 'job1',
      'startDate': '2020-08-12',
      'startTime': '09:12:09',
      'duration': '00:00:00',
      'jobExecution': {
        'id': 1,
        'version': 2,
        'jobParameters': {
          'parameters': {
            '-spring.cloud.task.executionid': {
              'identifying': false,
              'value': '3',
              'type': 'STRING'
            }, '-spring.cloud.data.flow.platformname': { 'identifying': false, 'value': 'default', 'type': 'STRING' }
          }, 'empty': false
        },
        'jobInstance': { 'id': 1, 'version': null, 'jobName': 'job1', 'instanceId': 1 },
        'stepExecutions': [{
          'id': 1,
          'version': 3,
          'stepName': 'job1step1',
          'status': 'COMPLETED',
          'readCount': 0,
          'writeCount': 0,
          'commitCount': 1,
          'rollbackCount': 0,
          'readSkipCount': 0,
          'processSkipCount': 0,
          'writeSkipCount': 0,
          'startTime': '2020-08-12T09:12:09.000+0000',
          'endTime': '2020-08-12T09:12:09.000+0000',
          'lastUpdated': '2020-08-12T09:12:09.000+0000',
          'executionContext': { 'dirty': false, 'empty': true, 'values': [] },
          'exitStatus': { 'exitCode': 'COMPLETED', 'exitDescription': '', 'running': false },
          'terminateOnly': false,
          'filterCount': 0,
          'failureExceptions': [],
          'skipCount': 0,
          'summary': 'StepExecution: id=1, version=3, name=job1step1, status=COMPLETED, exitStatus=COMPLETED, readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0',
          'jobParameters': {
            'parameters': {
              '-spring.cloud.task.executionid': {
                'identifying': false,
                'value': '3',
                'type': 'STRING'
              },
              '-spring.cloud.data.flow.platformname': { 'identifying': false, 'value': 'default', 'type': 'STRING' }
            }, 'empty': false
          },
          'jobExecutionId': 1
        }],
        'status': 'COMPLETED',
        'startTime': '2020-08-12T09:12:09.000+0000',
        'createTime': '2020-08-12T09:12:09.000+0000',
        'endTime': '2020-08-12T09:12:09.000+0000',
        'lastUpdated': '2020-08-12T09:12:09.000+0000',
        'exitStatus': { 'exitCode': 'COMPLETED', 'exitDescription': '', 'running': false },
        'executionContext': { 'dirty': false, 'empty': true, 'values': [] },
        'failureExceptions': [],
        'jobConfigurationName': null,
        'running': false,
        'jobId': 1,
        'stopping': false,
        'allFailureExceptions': []
      },
      'jobParameters': { '--spring.cloud.data.flow.platformname': 'default', '--spring.cloud.task.executionid': '3' },
      'jobParametersString': '--spring.cloud.data.flow.platformname=default,--spring.cloud.task.executionid=3',
      'restartable': false,
      'abandonable': false,
      'stoppable': false,
      'defined': true,
      'timeZone': 'UTC',
      '_links': { 'self': { 'href': 'http://localhost:9393/jobs/executions/1' } }
    }]
  },
  '_links': { 'self': { 'href': 'http://localhost:9393/jobs/executions?page=0&size=20' } },
  'page': { 'size': 20, 'totalElements': 2, 'totalPages': 1, 'number': 0 }
};

export const GET_EXECUTION = {
  'executionId': 2,
  'stepExecutionCount': 1,
  'jobId': 2,
  'taskExecutionId': 3,
  'name': 'job2',
  'startDate': '2020-08-12',
  'startTime': '09:12:09',
  'duration': '00:00:01',
  'jobExecution': {
    'id': 2,
    'version': 2,
    'jobParameters': {
      'parameters': {
        '-spring.cloud.task.executionid': {
          'identifying': false,
          'value': '3',
          'type': 'STRING'
        }, '-spring.cloud.data.flow.platformname': { 'identifying': false, 'value': 'default', 'type': 'STRING' }
      }, 'empty': false
    },
    'jobInstance': { 'id': 2, 'version': 0, 'jobName': 'job2', 'instanceId': 2 },
    'stepExecutions': [{
      'id': 2,
      'version': 3,
      'stepName': 'job2step1',
      'status': 'COMPLETED',
      'readCount': 0,
      'writeCount': 0,
      'commitCount': 1,
      'rollbackCount': 0,
      'readSkipCount': 0,
      'processSkipCount': 0,
      'writeSkipCount': 0,
      'startTime': '2020-08-12T09:12:10.000+0000',
      'endTime': '2020-08-12T09:12:10.000+0000',
      'lastUpdated': '2020-08-12T09:12:10.000+0000',
      'executionContext': { 'dirty': false, 'empty': true, 'values': [] },
      'exitStatus': { 'exitCode': 'COMPLETED', 'exitDescription': '', 'running': false },
      'terminateOnly': false,
      'filterCount': 0,
      'failureExceptions': [],
      'skipCount': 0,
      'summary': 'StepExecution: id=2, version=3, name=job2step1, status=COMPLETED, exitStatus=COMPLETED, readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0',
      'jobParameters': {
        'parameters': {
          '-spring.cloud.task.executionid': {
            'identifying': false,
            'value': '3',
            'type': 'STRING'
          }, '-spring.cloud.data.flow.platformname': { 'identifying': false, 'value': 'default', 'type': 'STRING' }
        }, 'empty': false
      },
      'jobExecutionId': 2
    }],
    'status': 'COMPLETED',
    'startTime': '2020-08-12T09:12:09.000+0000',
    'createTime': '2020-08-12T09:12:09.000+0000',
    'endTime': '2020-08-12T09:12:10.000+0000',
    'lastUpdated': '2020-08-12T09:12:10.000+0000',
    'exitStatus': { 'exitCode': 'COMPLETED', 'exitDescription': '', 'running': false },
    'executionContext': { 'dirty': false, 'empty': true, 'values': [] },
    'failureExceptions': [],
    'jobConfigurationName': null,
    'running': false,
    'jobId': 2,
    'stopping': false,
    'allFailureExceptions': []
  },
  'jobParameters': { '--spring.cloud.data.flow.platformname': 'default', '--spring.cloud.task.executionid': '3' },
  'jobParametersString': '--spring.cloud.data.flow.platformname=default,--spring.cloud.task.executionid=3',
  'restartable': false,
  'abandonable': false,
  'stoppable': false,
  'defined': true,
  'timeZone': 'UTC',
  '_links': { 'self': { 'href': 'http://localhost:9393/jobs/executions/2' } }
};

export const GET_STEP = {
  'jobExecutionId': 2,
  'stepExecution': {
    'id': 2,
    'version': 3,
    'stepName': 'job2step1',
    'status': 'COMPLETED',
    'readCount': 0,
    'writeCount': 0,
    'commitCount': 1,
    'rollbackCount': 0,
    'readSkipCount': 0,
    'processSkipCount': 0,
    'writeSkipCount': 0,
    'startTime': '2020-08-12T09:12:10.000+0000',
    'endTime': '2020-08-12T09:12:10.000+0000',
    'lastUpdated': '2020-08-12T09:12:10.000+0000',
    'executionContext': {
      'dirty': true,
      'empty': false,
      'values': [{ 'batch.taskletType': 'org.springframework.cloud.task.app.timestamp.batch.TimestampBatchTaskConfiguration$2' }, { 'batch.stepType': 'org.springframework.batch.core.step.tasklet.TaskletStep' }]
    },
    'exitStatus': { 'exitCode': 'COMPLETED', 'exitDescription': '', 'running': false },
    'terminateOnly': false,
    'filterCount': 0,
    'failureExceptions': [],
    'skipCount': 0,
    'summary': 'StepExecution: id=2, version=3, name=job2step1, status=COMPLETED, exitStatus=COMPLETED, readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0',
    'jobParameters': {
      'parameters': {
        '-spring.cloud.task.executionid': {
          'identifying': false,
          'value': '3',
          'type': 'STRING'
        }, '-spring.cloud.data.flow.platformname': { 'identifying': false, 'value': 'default', 'type': 'STRING' }
      }, 'empty': false
    },
    'jobExecutionId': 2
  },
  'stepType': 'org.springframework.cloud.task.app.timestamp.batch.TimestampBatchTaskConfiguration$2',
  '_links': { 'self': { 'href': 'http://localhost:9393/jobs/executions/2/steps/2' } }
};

export const GET_PROGRESS = {
  'stepExecution': {
    'id': 2,
    'version': 3,
    'stepName': 'job2step1',
    'status': 'COMPLETED',
    'readCount': 0,
    'writeCount': 0,
    'commitCount': 1,
    'rollbackCount': 0,
    'readSkipCount': 0,
    'processSkipCount': 0,
    'writeSkipCount': 0,
    'startTime': '2020-08-12T09:12:10.000+0000',
    'endTime': '2020-08-12T09:12:10.000+0000',
    'lastUpdated': '2020-08-12T09:12:10.000+0000',
    'executionContext': {
      'dirty': true,
      'empty': false,
      'values': [{ 'batch.taskletType': 'org.springframework.cloud.task.app.timestamp.batch.TimestampBatchTaskConfiguration$2' }, { 'batch.stepType': 'org.springframework.batch.core.step.tasklet.TaskletStep' }]
    },
    'exitStatus': { 'exitCode': 'COMPLETED', 'exitDescription': '', 'running': false },
    'terminateOnly': false,
    'filterCount': 0,
    'failureExceptions': [],
    'skipCount': 0,
    'summary': 'StepExecution: id=2, version=3, name=job2step1, status=COMPLETED, exitStatus=COMPLETED, readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0',
    'jobParameters': {
      'parameters': {
        '-spring.cloud.task.executionid': {
          'identifying': false,
          'value': '3',
          'type': 'STRING'
        }, '-spring.cloud.data.flow.platformname': { 'identifying': false, 'value': 'default', 'type': 'STRING' }
      }, 'empty': false
    },
    'jobExecutionId': 2
  },
  'stepExecutionHistory': {
    'stepName': 'job2step1',
    'count': 1,
    'commitCount': { 'count': 1, 'min': 1.0, 'max': 1.0, 'standardDeviation': 0.0, 'mean': 1.0 },
    'rollbackCount': { 'count': 1, 'min': 0.0, 'max': 0.0, 'standardDeviation': 0.0, 'mean': 0.0 },
    'readCount': { 'count': 1, 'min': 0.0, 'max': 0.0, 'standardDeviation': 0.0, 'mean': 0.0 },
    'writeCount': { 'count': 1, 'min': 0.0, 'max': 0.0, 'standardDeviation': 0.0, 'mean': 0.0 },
    'filterCount': { 'count': 1, 'min': 0.0, 'max': 0.0, 'standardDeviation': 0.0, 'mean': 0.0 },
    'readSkipCount': { 'count': 1, 'min': 0.0, 'max': 0.0, 'standardDeviation': 0.0, 'mean': 0.0 },
    'writeSkipCount': { 'count': 1, 'min': 0.0, 'max': 0.0, 'standardDeviation': 0.0, 'mean': 0.0 },
    'processSkipCount': { 'count': 1, 'min': 0.0, 'max': 0.0, 'standardDeviation': 0.0, 'mean': 0.0 },
    'duration': { 'count': 1, 'min': 0.0, 'max': 0.0, 'standardDeviation': 0.0, 'mean': 0.0 },
    'durationPerRead': { 'count': 0, 'min': 0.0, 'max': 0.0, 'standardDeviation': 0.0, 'mean': 0.0 }
  },
  'percentageComplete': 1.0,
  'finished': true,
  'duration': 0.0,
  '_links': { 'self': { 'href': 'http://localhost:9393/jobs/executions/2/steps/2' } }
};
