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

export const JOB_EXECUTIONS_WITH_PAGINATION = {
  _embedded: {
    jobExecutionResourceList: [
      {
        executionId: 4,
        stepExecutionCount: 1,
        jobId: 4,
        taskExecutionId: 95,
        name: 'job4',
        startDate: '2017-09-06',
        startTime: '00:54:46',
        duration: '00:00:00',
        jobExecution: {
          id: 4,
          version: 2,
          jobParameters: {
            parameters: {},
            empty: true
          },
          jobInstance: {
            id: 4,
            version: null,
            jobName: 'job4',
            instanceId: 1
          },
          stepExecutions: [
            {
              id: 1,
              version: 3,
              stepName: 'job4step1',
              status: 'COMPLETED',
              readCount: 0,
              writeCount: 0,
              commitCount: 1,
              rollbackCount: 0,
              readSkipCount: 0,
              processSkipCount: 0,
              writeSkipCount: 0,
              startTime: '2017-09-06T00:54:46.000Z',
              endTime: '2017-09-06T00:54:46.000Z',
              lastUpdated: '2017-09-06T00:54:46.000Z',
              executionContext: {
                dirty: false,
                empty: true,
                values: []
              },
              exitStatus: {
                exitCode: 'STARTED',
                exitDescription: '',
                running: false
              },
              terminateOnly: false,
              filterCount: 0,
              failureExceptions: [],
              jobExecutionId: 1,
              jobParameters: {
                parameters: {},
                empty: true
              },
              skipCount: 0,
              summary: 'StepExecution: id=1, version=3, name=job1step1, status=COMPLETED, exitStatus=COMPLETED, ' +
              'readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, ' +
              'commitCount=1, rollbackCount=0'
            }
          ],
          status: 'STARTED',
          startTime: '2017-09-06T00:54:46.000Z',
          createTime: '2017-09-06T00:54:46.000Z',
          endTime: '2017-09-06T00:54:46.000Z',
          lastUpdated: '2017-09-06T00:54:46.000Z',
          exitStatus: {},
          executionContext: {
            dirty: false,
            empty: true,
            values: []
          },
          failureExceptions: [],
          jobConfigurationName: null,
          running: false,
          jobId: 4,
          stopping: false,
          allFailureExceptions: []
        },
        jobParameters: {},
        jobParametersString: '',
        restartable: true,
        abandonable: true,
        stoppable: true,
        defined: false,
        timeZone: 'UTC',
        _links: {
          self: {
            href: 'http://localhost:9393/jobs/executions/1'
          }
        }
      },
      {
        executionId: 3,
        stepExecutionCount: 1,
        jobId: 3,
        taskExecutionId: 95,
        name: 'job3',
        startDate: '2017-09-06',
        startTime: '00:54:46',
        duration: '00:00:00',
        jobExecution: {
          id: 3,
          version: 2,
          jobParameters: {
            parameters: {},
            empty: true
          },
          jobInstance: {
            id: 3,
            version: null,
            jobName: 'job1',
            instanceId: 1
          },
          stepExecutions: [
            {
              id: 1,
              version: 3,
              stepName: 'job3step1',
              status: 'COMPLETED',
              readCount: 0,
              writeCount: 0,
              commitCount: 1,
              rollbackCount: 0,
              readSkipCount: 0,
              processSkipCount: 0,
              writeSkipCount: 0,
              startTime: '2017-09-06T00:54:46.000Z',
              endTime: '2017-09-06T00:54:46.000Z',
              lastUpdated: '2017-09-06T00:54:46.000Z',
              executionContext: {
                dirty: false,
                empty: true,
                values: []
              },
              exitStatus: {
                exitCode: 'FAIL',
                exitDescription: '',
                running: false
              },
              terminateOnly: false,
              filterCount: 0,
              failureExceptions: [],
              jobExecutionId: 1,
              jobParameters: {
                parameters: {},
                empty: true
              },
              skipCount: 0,
              summary: 'StepExecution: id=1, version=3, name=job1step1, status=COMPLETED, exitStatus=COMPLETED, ' +
              'readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, ' +
              'commitCount=1, rollbackCount=0'
            }
          ],
          status: 'FAIL',
          startTime: '2017-09-06T00:54:46.000Z',
          createTime: '2017-09-06T00:54:46.000Z',
          endTime: '2017-09-06T00:54:46.000Z',
          lastUpdated: '2017-09-06T00:54:46.000Z',
          exitStatus: {
            exitCode: 'FAIL',
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
          running: false,
          jobId: 3,
          stopping: false,
          allFailureExceptions: []
        },
        jobParameters: {},
        jobParametersString: '',
        restartable: true,
        abandonable: true,
        stoppable: true,
        defined: false,
        timeZone: 'UTC',
        _links: {
          self: {
            href: 'http://localhost:9393/jobs/executions/1'
          }
        }
      },
      {
        executionId: 2,
        stepExecutionCount: 1,
        jobId: 2,
        taskExecutionId: 95,
        name: 'job2',
        startDate: '2017-09-06',
        startTime: '00:54:46',
        duration: '00:00:00',
        jobExecution: {
          id: 2,
          version: 2,
          jobParameters: {
            parameters: {},
            empty: true
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
              startTime: '2017-09-06T00:54:46.000Z',
              endTime: '2017-09-06T00:54:46.000Z',
              lastUpdated: '2017-09-06T00:54:46.000Z',
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
              jobExecutionId: 2,
              jobParameters: {
                parameters: {},
                empty: true
              },
              skipCount: 0,
              summary: 'StepExecution: id=2, version=3, name=job2step1, status=COMPLETED, exitStatus=COMPLETED, ' +
              'readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0,' +
              ' commitCount=1, rollbackCount=0'
            }
          ],
          status: 'COMPLETED',
          startTime: '2017-09-06T00:54:46.000Z',
          createTime: '2017-09-06T00:54:46.000Z',
          endTime: '2017-09-06T00:54:46.000Z',
          lastUpdated: '2017-09-06T00:54:46.000Z',
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
          running: false,
          jobId: 2,
          stopping: false,
          allFailureExceptions: []
        },
        jobParameters: {},
        jobParametersString: '',
        restartable: false,
        abandonable: false,
        stoppable: false,
        defined: false,
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
        taskExecutionId: 95,
        name: 'job1',
        startDate: '2017-09-06',
        startTime: '00:54:46',
        duration: '00:00:00',
        jobExecution: {
          id: 1,
          version: 2,
          jobParameters: {
            parameters: {},
            empty: true
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
              startTime: '2017-09-06T00:54:46.000Z',
              endTime: '2017-09-06T00:54:46.000Z',
              lastUpdated: '2017-09-06T00:54:46.000Z',
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
              jobExecutionId: 1,
              jobParameters: {
                parameters: {},
                empty: true
              },
              skipCount: 0,
              summary: 'StepExecution: id=1, version=3, name=job1step1, status=COMPLETED, exitStatus=COMPLETED, ' +
              'readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, ' +
              'commitCount=1, rollbackCount=0'
            }
          ],
          status: 'COMPLETED',
          startTime: '2017-09-06T00:54:46.000Z',
          createTime: '2017-09-06T00:54:46.000Z',
          endTime: '2017-09-06T00:54:46.000Z',
          lastUpdated: '2017-09-06T00:54:46.000Z',
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
          running: false,
          jobId: 1,
          stopping: false,
          allFailureExceptions: []
        },
        jobParameters: {},
        jobParametersString: '',
        restartable: false,
        abandonable: false,
        stoppable: false,
        defined: false,
        timeZone: 'UTC',
        _links: {
          self: {
            href: 'http://localhost:9393/jobs/executions/1'
          }
        }
      }
    ]
  },
  _links: {
    self: {
      href: 'http://localhost:9393/jobs/executions?page=0&size=20'
    }
  },
  page: {
    size: 30,
    totalElements: 2,
    totalPages: 1,
    number: 0
  }
};


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

export const JOBS_EXECUTIONS_1_STEPS_1_PROGRESS = {
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
    startTime: '2017-08-21T07:25:05.028Z',
    endTime: '2017-08-21T07:25:05.041Z',
    lastUpdated: '2017-08-21T07:25:05.041Z',
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
    summary: 'StepExecution: id=1, version=3, name=job1step1, status=COMPLETED, exitStatus=COMPLETED, readCount=0, '
    + 'filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0',
    jobExecutionId: 1,
    jobParameters: {
      parameters: {
        '-server.port': {
          identifying: false,
          value: '8981',
          type: 'STRING'
        },
        '-spring.cloud.task.executionid': {
          identifying: false,
          value: '1',
          type: 'STRING'
        },
        '-spring.jmx.default-domain': {
          identifying: false,
          value: 'timestampbatchtask-cc3dd5e9-69ca-4f91-bf2c-3361494626bd',
          type: 'STRING'
        },
        '-spring.datasource.username': {
          identifying: false,
          value: 'sa',
          type: 'STRING'
        },
        '-endpoints.jmx.unique-names': {
          identifying: false,
          value: 'true',
          type: 'STRING'
        },
        '-spring.cloud.task.name': {
          identifying: false,
          value: 'timestampbatchtask',
          type: 'STRING'
        },
        '-spring.datasource.driverClassName': {
          identifying: false,
          value: 'org.h2.Driver',
          type: 'STRING'
        },
        '-spring.datasource.url': {
          identifying: false,
          value: 'jdbc:h2:tcp://localhost:19092/mem:dataflow',
          type: 'STRING'
        },
        '-endpoints.shutdown.enabled': {
          identifying: false,
          value: 'true',
          type: 'STRING'
        }
      },
      empty: false
    }
  },
  stepExecutionHistory: {
    stepName: 'job1step1',
    count: 1,
    commitCount: {
      count: 1,
      min: 1,
      max: 1,
      standardDeviation: 0,
      mean: 1
    },
    rollbackCount: {
      count: 1,
      min: 0,
      max: 0,
      standardDeviation: 0,
      mean: 0
    },
    readCount: {
      count: 1,
      min: 0,
      max: 0,
      standardDeviation: 0,
      mean: 0
    },
    writeCount: {
      count: 1,
      min: 0,
      max: 0,
      standardDeviation: 0,
      mean: 0
    },
    filterCount: {
      count: 1,
      min: 0,
      max: 0,
      standardDeviation: 0,
      mean: 0
    },
    readSkipCount: {
      count: 1,
      min: 0,
      max: 0,
      standardDeviation: 0,
      mean: 0
    },
    writeSkipCount: {
      count: 1,
      min: 0,
      max: 0,
      standardDeviation: 0,
      mean: 0
    },
    processSkipCount: {
      count: 1,
      min: 0,
      max: 0,
      standardDeviation: 0,
      mean: 0
    },
    duration: {
      count: 1,
      min: 13,
      max: 13,
      standardDeviation: 0,
      mean: 13
    },
    durationPerRead: {
      count: 0,
      min: 0,
      max: 0,
      standardDeviation: 0,
      mean: 0
    }
  },
  percentageComplete: 1,
  finished: true,
  duration: 13,
  _links: {
    self: {
      href: 'http://localhost:9393/jobs/executions/1/steps/1'
    }
  }
};

export const RUNTIME_SREAMS = {
  '_embedded': {
    'streamStatusResourceList': [
      {
        'name': 'a1',
        'applications': {
          '_embedded': {
            'appStatusResourceList': [
              {
                'deploymentId': 'a1.log-v1',
                'state': 'deployed',
                'instances': {
                  '_embedded': {
                    'appInstanceStatusResourceList': [
                      {
                        'instanceId': 'a1.log-v1-0',
                        'state': 'deployed',
                        'attributes': {
                          'guid': '39968',
                          'pid': '41612',
                          'port': '39968',
                          'skipper.application.name': 'log',
                          'skipper.release.name': 'a1',
                          'skipper.release.version': '1',
                          'stderr': '/var/folders/_p/csftb5612z33pgd9ltfbp0mr0000gn/T/1582815271871/a1.log-v1/stderr_0.log',
                          'stdout': '/var/folders/_p/csftb5612z33pgd9ltfbp0mr0000gn/T/1582815271871/a1.log-v1/stdout_0.log',
                          'url': 'http://10.104.14.168:39968',
                          'working.dir': '/var/folders/_p/csftb5612z33pgd9ltfbp0mr0000gn/T/1582815271871/a1.log-v1'
                        },
                        'guid': '39968',
                        '_links': {
                          'self': {
                            'href': 'http://localhost:9393/runtime/apps/a1.log-v1/instances/a1.log-v1-0'
                          }
                        }
                      }
                    ]
                  }
                },
                'name': 'log',
                '_links': {
                  'self': {
                    'href': 'http://localhost:9393/runtime/apps/a1.log-v1'
                  }
                }
              },
              {
                'deploymentId': 'a1.time-v1',
                'state': 'deployed',
                'instances': {
                  '_embedded': {
                    'appInstanceStatusResourceList': [
                      {
                        'instanceId': 'a1.time-v1-0',
                        'state': 'deployed',
                        'attributes': {
                          'guid': '46740',
                          'pid': '41611',
                          'port': '46740',
                          'skipper.application.name': 'time',
                          'skipper.release.name': 'a1',
                          'skipper.release.version': '1',
                          'stderr': '/var/folders/_p/csftb5612z33pgd9ltfbp0mr0000gn/T/1582815271476/a1.time-v1/stderr_0.log',
                          'stdout': '/var/folders/_p/csftb5612z33pgd9ltfbp0mr0000gn/T/1582815271476/a1.time-v1/stdout_0.log',
                          'url': 'http://10.104.14.168:46740',
                          'working.dir': '/var/folders/_p/csftb5612z33pgd9ltfbp0mr0000gn/T/1582815271476/a1.time-v1'
                        },
                        'guid': '46740',
                        '_links': {
                          'self': {
                            'href': 'http://localhost:9393/runtime/apps/a1.time-v1/instances/a1.time-v1-0'
                          }
                        }
                      }
                    ]
                  }
                },
                'name': 'time',
                '_links': {
                  'self': {
                    'href': 'http://localhost:9393/runtime/apps/a1.time-v1'
                  }
                }
              }
            ]
          }
        },
        'version': '1',
        '_links': {
          'self': {
            'href': 'http://localhost:9393/runtime/streams/a1'
          }
        }
      },
      {
        'name': 'a2',
        'applications': {
          '_embedded': {
            'appStatusResourceList': [
              {
                'deploymentId': 'a2.log-v1',
                'state': 'deployed',
                'instances': {
                  '_embedded': {
                    'appInstanceStatusResourceList': [
                      {
                        'instanceId': 'a2.log-v1-0',
                        'state': 'deployed',
                        'attributes': {
                          'guid': '39968',
                          'pid': '41612',
                          'port': '39968',
                          'skipper.application.name': 'log',
                          'skipper.release.name': 'a1',
                          'skipper.release.version': '1',
                          'stderr': '/var/folders/_p/csftb5612z33pgd9ltfbp0mr0000gn/T/1582815271871/a1.log-v1/stderr_0.log',
                          'stdout': '/var/folders/_p/csftb5612z33pgd9ltfbp0mr0000gn/T/1582815271871/a1.log-v1/stdout_0.log',
                          'url': 'http://10.104.14.168:39968',
                          'working.dir': '/var/folders/_p/csftb5612z33pgd9ltfbp0mr0000gn/T/1582815271871/a1.log-v1'
                        },
                        'guid': '39968',
                        '_links': {
                          'self': {
                            'href': 'http://localhost:9393/runtime/apps/a1.log-v1/instances/a1.log-v1-0'
                          }
                        }
                      }
                    ]
                  }
                },
                'name': 'log',
                '_links': {
                  'self': {
                    'href': 'http://localhost:9393/runtime/apps/a1.log-v1'
                  }
                }
              },
              {
                'deploymentId': 'a2.time-v1',
                'state': 'deployed',
                'instances': {
                  '_embedded': {
                    'appInstanceStatusResourceList': [
                      {
                        'instanceId': 'a1.time-v1-0',
                        'state': 'deployed',
                        'attributes': {
                          'guid': '46740',
                          'pid': '41611',
                          'port': '46740',
                          'skipper.application.name': 'time',
                          'skipper.release.name': 'a1',
                          'skipper.release.version': '1',
                          'stderr': '/var/folders/_p/csftb5612z33pgd9ltfbp0mr0000gn/T/1582815271476/a1.time-v1/stderr_0.log',
                          'stdout': '/var/folders/_p/csftb5612z33pgd9ltfbp0mr0000gn/T/1582815271476/a1.time-v1/stdout_0.log',
                          'url': 'http://10.104.14.168:46740',
                          'working.dir': '/var/folders/_p/csftb5612z33pgd9ltfbp0mr0000gn/T/1582815271476/a1.time-v1'
                        },
                        'guid': '46740',
                        '_links': {
                          'self': {
                            'href': 'http://localhost:9393/runtime/apps/a1.time-v1/instances/a1.time-v1-0'
                          }
                        }
                      }
                    ]
                  }
                },
                'name': 'time',
                '_links': {
                  'self': {
                    'href': 'http://localhost:9393/runtime/apps/a1.time-v1'
                  }
                }
              }
            ]
          }
        },
        'version': '1',
        '_links': {
          'self': {
            'href': 'http://localhost:9393/runtime/streams/a1'
          }
        }
      }
    ]
  },
  '_links': {
    'self': {
      'href': 'http://localhost:9393/runtime/streams/a1,a2?page=0&size=20'
    }
  },
  'page': {
    'size': 20,
    'totalElements': 2,
    'totalPages': 1,
    'number': 0
  }
};

export const APPS = {
  items: [
    {
      name: 'foo',
      type: 'source',
      uri: 'https://foo.bar:1.0.0',
      version: '1.0.0',
      defaultVersion: true,
      versions: [
        {
          version: '0.0.1',
          uri: 'https://foo.bar:0.0.1',
          defaultVersion: false,
          metadata: [
            { name: 'foo1', description: 'bar1' },
            { name: 'foo2', description: 'bar2' }
          ]
        },
        {
          version: '0.0.2',
          uri: 'https://foo.bar:0.0.2',
          defaultVersion: false,
          metadata: [
            { name: 'lorem1', description: 'ipsum1' },
            { name: 'lorem2', description: 'ipsum2' }
          ]
        },
        {
          version: '1.0.0',
          uri: 'https://foo.bar:1.0.0',
          defaultVersion: true,
          metadata: [
            { name: 'set1', description: 'set1' },
            { name: 'dolor1', description: 'dolor1' }
          ]
        },
      ]
    },
    {
      name: 'bar',
      type: 'processor',
      uri: 'https://bar.foo:0.0.1 ',
      version: '0.0.1',
      defaultVersion: true,
      versions: [
        {
          version: '0.0.1',
          uri: 'https://foo.bar:0.0.1',
          defaultVersion: true,
          metadata: [
            { name: 'foo1', description: 'bar1' },
            { name: 'foo2', description: 'bar2' }
          ]
        }
      ]
    }
  ],
  size: 20,
  totalElements: 2,
  totalPages: 1,
  number: 0
};

export const APPS_2 = {
  items: [
    {
      name: 'time',
      type: 'source',
      uri: 'https://foo.bar:1.0.0',
      version: '1.0.0',
      defaultVersion: true,
      versions: [
        {
          version: '0.0.1',
          uri: 'https://foo.bar:0.0.1',
          defaultVersion: false,
          metadata: [
            { name: 'foo1', description: 'bar1' },
            { name: 'foo2', description: 'bar2' }
          ]
        }
      ]
    },
    {
      name: 'log',
      type: 'sink',
      uri: 'https://bar.foo:0.0.1 ',
      version: '0.0.1',
      defaultVersion: true,
      versions: [
        {
          version: '0.0.1',
          uri: 'https://foo.bar:0.0.1',
          defaultVersion: true,
          metadata: [
            { name: 'foo1', description: 'bar1' },
            { name: 'foo2', description: 'bar2' }
          ]
        }
      ]
    }
  ],
  size: 20,
  totalElements: 2,
  totalPages: 1,
  number: 0
};

export const STREAM_DEFINITIONS = {
  _embedded: {
    streamDefinitionResourceList: [
      {
        name: 'foo2',
        dslText: 'time |log ',
        originalDslText: 'time | log',
        description: 'demo-stream',
        status: 'undeployed',
        statusDescription: 'The app or group is known to the system, but is not currently deployed',
        force: false,
        _links: {
          self: {
            href: 'http://localhost:9393/streams/definitions/foo2'
          }
        }
      },
      {
        name: 'foo3',
        dslText: 'time |log ',
        originalDslText: 'time | log',
        description: 'demo-stream',
        status: 'undeployed',
        statusDescription: 'The app or group is known to the system, but is currently deployed',
        force: false,
        _links: {
          self: {
            href: 'http://localhost:9393/streams/definitions/foo3'
          }
        }
      }
    ]
  },
  _links: {
    self: {
      href: 'http://localhost:9393/streams/definitions?page=0&size=20'
    }
  },
  page: {
    size: 1,
    totalElements: 1,
    totalPages: 1,
    number: 0
  }
};

export const TASK_DEFINITIONS = {
  _embedded: {
    taskDefinitionResourceList: [
      {
        name: 'foo',
        dslText: 'bar',
        description: 'demo',
        composed: true,
        status: 'unknown',
        _links: {
          self: {
            href: 'http://localhost:4200/tasks/definitions/foo'
          }
        }
      },
      {
        name: 'bar2',
        dslText: 'task1',
        description: 'demo',
        composed: false,
        status: 'unknown',
        _links: {
          self: {
            href: 'http://localhost:4200/tasks/definitions/bar'
          }
        }
      }
    ]
  },
  _links: {
    self: {
      href: 'http://localhost:4200/tasks/definitions?page=0&size=20&sort=taskName,asc'
    }
  },
  page: {
    size: 20,
    totalElements: 2,
    totalPages: 1,
    number: 0
  }
};

export const TASK_EXECUTIONS = {
  _embedded: {
    taskExecutionResourceList: [
      {
        executionId: 2,
        exitCode: 0,
        taskName: 'foo1',
        startTime: null,
        endTime: null,
        exitMessage: null,
        arguments: [],
        jobExecutionIds: [],
        errorMessage: null,
        externalExecutionId: null,
        _links: {
          self: {
            href: 'http://localhost:4200/tasks/executions/2'
          }
        }
      },
      {
        executionId: 1,
        exitCode: 0,
        taskName: 'foo2 && foo3',
        startTime: null,
        endTime: null,
        exitMessage: null,
        arguments: [],
        jobExecutionIds: [],
        errorMessage: null,
        externalExecutionId: null,
        _links: {
          self: {
            href: 'http://localhost:4200/tasks/executions/1'
          }
        }
      }
    ]
  },
  _links: {
    first: {
      href: 'http://localhost:4200/tasks/executions?page=0&size=10&sort=TASK_EXECUTION_ID,desc'
    },
    self: {
      href: 'http://localhost:4200/tasks/executions?page=0&size=10&sort=TASK_EXECUTION_ID,desc'
    },
    next: {
      href: 'http://localhost:4200/tasks/executions?page=1&size=10&sort=TASK_EXECUTION_ID,desc'
    },
    last: {
      href: 'http://localhost:4200/tasks/executions?page=1&size=10&sort=TASK_EXECUTION_ID,desc'
    }
  },
  page: {
    size: 10,
    totalElements: 2,
    totalPages: 1,
    number: 0
  }
};


export const TASK_SCHEDULES = {
  _embedded: {
    scheduleInfoResourceList: [
      {
        scheduleName: 'foo1',
        taskDefinitionName: 'bar1',
        scheduleProperties: { 'spring.cloud.scheduler.cron.expression': '0 0 0 * 8 1'},
        _links: {
          self: {
            href: 'http://localhost:4200/tasks/schedules/foo1'
          }
        }
      },
      {
        scheduleName: 'foo2',
        taskDefinitionName: 'bar2',
        scheduleProperties: { 'spring.cloud.scheduler.cron.expression': '0 0 0 * 8 1'},
        _links: {
          self: {
            href: 'http://localhost:4200/tasks/schedules/foo2'
          }
        }
      }
    ]
  },
  _links: {
    self: {
      href: 'http://localhost:4200/tasks/schedules?page=0&size=20&sort=NAME,asc'
    }
  },
  page: {
    size: 20,
    totalElements: 2,
    totalPages: 1,
    number: 0
  }
};

export const AUDIT_RECORDS = {
  _embedded: {
    auditRecordResourceList: [
      {
        auditRecordId: 1,
        createdBy: null,
        correlationId: 'foo1',
        auditData: 'bar1',
        createdOn: '2018-10-16T13:36:01.720Z',
        auditAction: 'CREATE',
        auditOperation: 'APP_REGISTRATION',
        platformName: 'kubernetes',
        _links: {
          self: {
            self: 'http://localhost:4200/audit-records/1'
          }
        }
      }, {
        auditRecordId: 2,
        createdBy: null,
        correlationId: 'foo2',
        auditData: 'bar2',
        createdOn: '2018-10-16T13:36:01.720Z',
        auditAction: 'UNDEPLOY',
        auditOperation: 'STREAM',
        _links: {
          self: {
            self: 'http://localhost:4200/audit-records/1'
          }
        }
      }, {
        auditRecordId: 3,
        createdBy: null,
        correlationId: 'foo3',
        auditData: 'bar3',
        createdOn: '2018-10-16T13:36:01.720Z',
        auditAction: 'DELETE',
        auditOperation: 'TASK',
        _links: {
          self: {
            self: 'http://localhost:4200/audit-records/1'
          }
        }
      }, {
        auditRecordId: 4,
        createdBy: null,
        correlationId: 'foo4',
        auditData: 'bar4',
        createdOn: '2018-10-16T13:36:01.720Z',
        auditAction: 'UPDATE',
        auditOperation: 'SCHEDULE',
        _links: {
          self: {
            self: 'http://localhost:4200/audit-records/1'
          }
        }
      }
    ]
  },
  _links: {
    self: {
      href: 'http://localhost:4200/audit-records?page=0&size=30&sort=createdOn,desc'
    }
  },
  page: {
    size: 30,
    totalElements: 1,
    totalPages: 1,
    number: 0
  }
};
