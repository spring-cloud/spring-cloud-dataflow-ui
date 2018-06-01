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
          exitStatus: {
          },
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

export const RUNTIME_APPS = {
  _embedded: {
    appStatusResourceList: [
      {
        deploymentId: 'foostream.log',
        state: 'deployed',
        instances: {
          _embedded: {
            appInstanceStatusResourceList: [
              {
                instanceId: 'foostream.log-0',
                state: 'deployed',
                attributes: {
                  guid: '36395',
                  pid: '18337',
                  port: '36395',
                  stderr: '/tmp/spring-cloud-dataflow-6123292284556332480/foostream-1503384837599/foostream.log/stderr_0.log',
                  stdout: '/tmp/spring-cloud-dataflow-6123292284556332480/foostream-1503384837599/foostream.log/stdout_0.log',
                  url: 'http://127.0.1.1:36395',
                  'working.dir': '/tmp/spring-cloud-dataflow-6123292284556332480/foostream-1503384837599/foostream.log'
                },
                _links: {
                  self: {
                    href: 'http://localhost:9393/runtime/apps/foostream.log/instances/foostream.log-0'
                  }
                }
              }
            ]
          }
        },
        _links: {
          self: {
            href: 'http://localhost:9393/runtime/apps/foostream.log'
          }
        }
      },
      {
        deploymentId: 'foostream.time',
        state: 'deploying',
        instances: {
          _embedded: {
            appInstanceStatusResourceList: [
              {
                instanceId: 'foostream.time-0',
                state: 'deployed',
                attributes: {
                  guid: '49401',
                  pid: '18395',
                  port: '49401',
                  stderr: '/tmp/spring-cloud-dataflow-6123292284556332480/foostream-1503384843640/foostream.time/stderr_0.log',
                  stdout: '/tmp/spring-cloud-dataflow-6123292284556332480/foostream-1503384843640/foostream.time/stdout_0.log',
                  url: 'http://127.0.1.1:49401',
                  'working.dir': '/tmp/spring-cloud-dataflow-6123292284556332480/foostream-1503384843640/foostream.time'
                },
                _links: {
                  self: {
                    href: 'http://localhost:9393/runtime/apps/foostream.time/instances/foostream.time-0'
                  }
                }
              }
            ]
          }
        },
        _links: {
          self: {
            href: 'http://localhost:9393/runtime/apps/foostream.time'
          }
        }
      }
    ]
  },
  _links: {
    self: {
      href: 'http://localhost:9393/runtime/apps?page=0&size=10'
    }
  },
  page: {
    size: 2,
    totalElements: 1,
    totalPages: 1,
    number: 0
  }
};

export const APPS = {
  items: [
    {
      name: 'foo',
      type: 'source',
      uri: 'http://foo.bar:1.0.0',
      version: '1.0.0',
      defaultVersion: true,
      versions: [
        {
          version: '0.0.1',
          uri: 'http://foo.bar:0.0.1',
          defaultVersion: false,
          metadata: [
            { name: 'foo1', description: 'bar1' },
            { name: 'foo2', description: 'bar2' }
          ]
        },
        {
          version: '0.0.2',
          uri: 'http://foo.bar:0.0.2',
          defaultVersion: false,
          metadata: [
            { name: 'lorem1', description: 'ipsum1' },
            { name: 'lorem2', description: 'ipsum2' }
          ]
        },
        {
          version: '1.0.0',
          uri: 'http://foo.bar:1.0.0',
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
      uri: 'http://bar.foo:0.0.1 ',
      version: '0.0.1',
      defaultVersion: true,
      versions: [
        {
          version: '0.0.1',
          uri: 'http://foo.bar:0.0.1',
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
      href: 'http://localhost:4200/tasks/definitions?page=0&size=20&sort=DEFINITION_NAME,asc'
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
