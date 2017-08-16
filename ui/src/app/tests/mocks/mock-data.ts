export const JOBS_EXECUTIONS_1 = {
    executionId: 1,
    stepExecutionCount: 1,
    jobId: 1,
    taskExecutionId: 2,
    name: 'job1',
    startDate: '2017-08-11',
    startTime: '06:15:50',
    duration: '00:00:00',
    jobExecution: {
      id: 1,
      version: 2,
      jobParameters: {
        parameters: {
          '-spring.cloud.task.executionid': {
            identifying: false,
            value: '2',
            type: 'STRING'
          }
        },
        empty: false
      },
      jobInstance: {
        id: 1,
        version: 0,
        jobName: 'job1',
        instanceId: 1
      },
      stepExecutions: [
        {
          id: 1,
          version: 3,
          stepName: 'job1step1',
          status: 'COMPLETED',
          readCount: 0,
          writeCount: 0,
          commitCount: 1,
          rollbackCount: 0,
          readSkipCount: 0,
          processSkipCount: 0,
          writeSkipCount: 0,
          startTime: '2017-08-11T06:15:50.046Z',
          endTime: '2017-08-11T06:15:50.064Z',
          lastUpdated: '2017-08-11T06:15:50.064Z',
          executionContext: {
            dirty: false,
            empty: true,
            values: []
          },
          exitStatus: {
            exitCode: 'COMPLETED',
            exitDescription: '',
            running: false
          },
          terminateOnly: false,
          filterCount: 0,
          failureExceptions: [],
          skipCount: 0,
          summary: 'StepExecution: id=1, version=3, name=job1step1, status=COMPLETED,'
          + ' exitStatus=COMPLETED, readCount=0, filterCount=0, writeCount=0 '
          + 'readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0',
          jobParameters: {
            parameters: {
              '-spring.cloud.task.executionid': {
                identifying: false,
                value: '2',
                type: 'STRING'
              }
            },
            empty: false
          },
          jobExecutionId: 1
        }
      ],
      status: 'COMPLETED',
      startTime: '2017-08-11T06:15:50.027Z',
      createTime: '2017-08-11T06:15:49.989Z',
      endTime: '2017-08-11T06:15:50.067Z',
      lastUpdated: '2017-08-11T06:15:50.067Z',
      exitStatus: {
        exitCode: 'COMPLETED',
        exitDescription: '',
        running: false
      },
      executionContext: {
        dirty: false,
        empty: true,
        values: []
      },
      failureExceptions: [],
      jobConfigurationName: null,
      allFailureExceptions: [],
      running: false,
      stopping: false,
      jobId: 1
    },
    jobParameters: {
      '--spring.cloud.task.executionid': '2'
    },
    jobParametersString: '--spring.cloud.task.executionid=2',
    restartable: false,
    abandonable: false,
    stoppable: false,
    defined: true,
    timeZone: 'UTC',
    _links: {
      self: {
        href: 'http://localhost:9393/jobs/executions/1'
      }
    }
  };

export const JOBS_EXECUTIONS = [
  {
    executionId: 2,
    stepExecutionCount: 1,
    jobId: 2,
    taskExecutionId: 2,
    name: 'job2',
    startDate: '2017-08-11',
    startTime: '06:15:50',
    duration: '00:00:00',
    jobExecution: {
      id: 2,
      version: 2,
      jobParameters: {
        parameters: {
          '-spring.cloud.task.executionid': {
            identifying: false,
            value: '2',
            type: 'STRING'
          }
        },
        empty: false
      },
      jobInstance: {
        id: 2,
        version: null,
        jobName: 'job2',
        instanceId: 2
      },
      stepExecutions: [
        {
          id: 2,
          version: 3,
          stepName: 'job2step1',
          status: 'COMPLETED',
          readCount: 0,
          writeCount: 0,
          commitCount: 1,
          rollbackCount: 0,
          readSkipCount: 0,
          processSkipCount: 0,
          writeSkipCount: 0,
          startTime: '2017-08-11T06:15:50.103Z',
          endTime: '2017-08-11T06:15:50.136Z',
          lastUpdated: '2017-08-11T06:15:50.137Z',
          executionContext: {
            dirty: false,
            empty: true,
            values: []
          },
          exitStatus: {
            exitCode: 'COMPLETED',
            exitDescription: '',
            running: false
          },
          terminateOnly: false,
          filterCount: 0,
          failureExceptions: [],
          skipCount: 0,
          summary: 'StepExecution: id=2, version=3, name=job2step1, status=COMPLETED,'
          + ' exitStatus=COMPLETED, readCount=0, filterCount=0, writeCount=0'
          + ' readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0',
          jobParameters: {
            parameters: {
              '-spring.cloud.task.executionid': {
                identifying: false,
                value: '2',
                type: 'STRING'
              }
            },
            empty: false
          },
          jobExecutionId: 2
        }
      ],
      status: 'COMPLETED',
      startTime: '2017-08-11T06:15:50.087Z',
      createTime: '2017-08-11T06:15:50.082Z',
      endTime: '2017-08-11T06:15:50.142Z',
      lastUpdated: '2017-08-11T06:15:50.142Z',
      exitStatus: {
        exitCode: 'COMPLETED',
        exitDescription: '',
        running: false
      },
      executionContext: {
        dirty: false,
        empty: true,
        values: []
      },
      failureExceptions: [],
      jobConfigurationName: null,
      allFailureExceptions: [],
      running: false,
      stopping: false,
      jobId: 2
    },
    jobParameters: {
      '--spring.cloud.task.executionid': '2'
    },
    jobParametersString: '--spring.cloud.task.executionid=2',
    restartable: false,
    abandonable: false,
    stoppable: false,
    defined: true,
    timeZone: 'UTC',
    _links: {
      self: {
        href: 'http://localhost:9393/jobs/executions/2'
      }
    }
  },
  {
    executionId: 1,
    stepExecutionCount: 1,
    jobId: 1,
    taskExecutionId: 2,
    name: 'job1',
    startDate: '2017-08-11',
    startTime: '06:15:50',
    duration: '00:00:00',
    jobExecution: {
      id: 1,
      version: 2,
      jobParameters: {
        parameters: {
          '-spring.cloud.task.executionid': {
            identifying: false,
            value: '2',
            type: 'STRING'
          }
        },
        empty: false
      },
      jobInstance: {
        id: 1,
        version: null,
        jobName: 'job1',
        instanceId: 1
      },
      stepExecutions: [
        {
          id: 1,
          version: 3,
          stepName: 'job1step1',
          status: 'COMPLETED',
          readCount: 0,
          writeCount: 0,
          commitCount: 1,
          rollbackCount: 0,
          readSkipCount: 0,
          processSkipCount: 0,
          writeSkipCount: 0,
          startTime: '2017-08-11T06:15:50.046Z',
          endTime: '2017-08-11T06:15:50.064Z',
          lastUpdated: '2017-08-11T06:15:50.064Z',
          executionContext: {
            dirty: false,
            empty: true,
            values: []
          },
          exitStatus: {
            exitCode: 'COMPLETED',
            exitDescription: '',
            running: false
          },
          terminateOnly: false,
          filterCount: 0,
          failureExceptions: [],
          skipCount: 0,
          summary: 'StepExecution: id=1, version=3, name=job1step1, status=COMPLETED, exitStatus=COMPLETED,'
          + ' readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0,'
          + ' processSkipCount=0, commitCount=1, rollbackCount=0',
          jobParameters: {
            parameters: {
              '-spring.cloud.task.executionid': {
                identifying: false,
                value: '2',
                type: 'STRING'
              }
            },
            empty: false
          },
          jobExecutionId: 1
        }
      ],
      status: 'COMPLETED',
      startTime: '2017-08-11T06:15:50.027Z',
      createTime: '2017-08-11T06:15:49.989Z',
      endTime: '2017-08-11T06:15:50.067Z',
      lastUpdated: '2017-08-11T06:15:50.067Z',
      exitStatus: {
        exitCode: 'COMPLETED',
        exitDescription: '',
        running: false
      },
      executionContext: {
        dirty: false,
        empty: true,
        values: []
      },
      failureExceptions: [],
      jobConfigurationName: null,
      allFailureExceptions: [],
      running: false,
      stopping: false,
      jobId: 1
    },
    jobParameters: {
      '--spring.cloud.task.executionid': '2'
    },
    jobParametersString: '--spring.cloud.task.executionid=2',
    restartable: false,
    abandonable: false,
    stoppable: false,
    defined: true,
    timeZone: 'UTC',
    _links: {
      self: {
        href: 'http://localhost:9393/jobs/executions/1'
      }
    }
  }
];

export const JOBS_EXECUTIONS_1_STEPS_1 = {
  jobExecutionId: 1,
  stepExecution: {
    id: 1,
    version: 3,
    stepName: 'job1step1',
    status: 'COMPLETED',
    readCount: 0,
    writeCount: 0,
    commitCount: 1,
    rollbackCount: 0,
    readSkipCount: 0,
    processSkipCount: 0,
    writeSkipCount: 0,
    startTime: '2017-08-11T06:15:50.046Z',
    endTime: '2017-08-11T06:15:50.064Z',
    lastUpdated: '2017-08-11T06:15:50.064Z',
    executionContext: {
      dirty: true,
      empty: false,
      values: [
        {
          'batch.taskletType': 'org.springframework.cloud.task.app.timestamp.batch.TimestampBatchTaskConfiguration$1'
        },
        {
          'batch.stepType': 'org.springframework.batch.core.step.tasklet.TaskletStep'
        }
      ]
    },
    exitStatus: {
      exitCode: 'COMPLETED',
      exitDescription: '',
      running: false
    },
    terminateOnly: false,
    filterCount: 0,
    failureExceptions: [],
    skipCount: 0,
    summary: 'StepExecution: id=1, version=3, name=job1step1, status=COMPLETED, exitStatus=COMPLETED,'
    + ' readCount=0, filterCount=0, writeCount=0 readSkipCount=0,'
    + ' writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0',
    jobParameters: {
      parameters: {
        '-spring.cloud.task.executionid': {
          identifying: false,
          value: '2',
          type: 'STRING'
        }
      },
      empty: false
    },
    jobExecutionId: 1
  },
  stepType: 'org.springframework.cloud.task.app.timestamp.batch.TimestampBatchTaskConfiguration$1',
  _links: {
    self: {
      href: 'http://localhost:9393/jobs/executions/1/steps/1'
    }
  }
};

