export const GET_TASKS = {
  '_embedded': {
    'taskDefinitionResourceList': [{
      'name': 'bar',
      'dslText': 'timestamp-batch',
      'description': '',
      'composed': false,
      'lastTaskExecution': null,
      'status': 'UNKNOWN',
      '_links': { 'self': { 'href': 'http://localhost:4200/tasks/definitions/bar' } }
    }, {
      'name': 'foo',
      'dslText': 'timestamp',
      'description': '',
      'composed': false,
      'lastTaskExecution': null,
      'status': 'UNKNOWN',
      '_links': { 'self': { 'href': 'http://localhost:4200/tasks/definitions/foo' } }
    }, {
      'name': 'tuu',
      'dslText': 'app1: timestamp && <app2: timestamp-batch || app3: timestamp-batch>',
      'description': '',
      'composed': true,
      'lastTaskExecution': null,
      'status': 'UNKNOWN',
      '_links': { 'self': { 'href': 'http://localhost:4200/tasks/definitions/tuu' } }
    }, {
      'name': 'tuu-app1',
      'dslText': 'timestamp',
      'description': null,
      'composed': false,
      'lastTaskExecution': null,
      'status': 'UNKNOWN',
      '_links': { 'self': { 'href': 'http://localhost:4200/tasks/definitions/tuu-app1' } }
    }, {
      'name': 'tuu-app2',
      'dslText': 'timestamp-batch',
      'description': null,
      'composed': false,
      'lastTaskExecution': null,
      'status': 'UNKNOWN',
      '_links': { 'self': { 'href': 'http://localhost:4200/tasks/definitions/tuu-app2' } }
    }, {
      'name': 'tuu-app3',
      'dslText': 'timestamp-batch',
      'description': null,
      'composed': false,
      'lastTaskExecution': null,
      'status': 'UNKNOWN',
      '_links': { 'self': { 'href': 'http://localhost:4200/tasks/definitions/tuu-app3' } }
    }]
  },
  '_links': { 'self': { 'href': 'http://localhost:4200/tasks/definitions?page=0&size=20&sort=taskName,asc' } },
  'page': { 'size': 20, 'totalElements': 6, 'totalPages': 1, 'number': 0 }
};

export const GET_TASK = {
  'name': 'foo',
  'dslText': 'timestamp',
  'description': '',
  'composed': false,
  'lastTaskExecution': null,
  'status': 'UNKNOWN',
  '_links': { 'self': { 'href': 'http://localhost:4200/tasks/definitions/foo' } }
};

export const GET_PLATFORMS = {
  _embedded: {
    launcherResourceList: [
      {
        name: 'default',
        type: 'Local',
        description: 'ShutdownTimeout = [30], EnvVarsToInherit = [TMP,LANG,LANGUAGE,LC_.*,PATH,SPRING_APPLICATION_JSON], JavaCmd = [/opt/openjdk/bin/java], WorkingDirectoriesRoot = [/tmp], DeleteFilesOnExit = [true]',
        _links: {
          self: {
            href: 'http://localhost:4200/tasks/platforms/cf5cdee4-7a2a-4ff8-a4ce-bfff4388327e'
          }
        }
      }
    ]
  },
  _links: {
    self: {
      href: 'http://localhost:4200/tasks/platforms?page=0&size=20'
    }
  },
  page: {
    size: 1000,
    totalElements: 1,
    totalPages: 1,
    number: 0
  }
};

export const GET_EXECUTIONS = {
  '_embedded': {
    'taskExecutionResourceList': [{
      'executionId': 6,
      'exitCode': 1,
      'taskName': 'tuu-app2',
      'startTime': '2020-05-24T16:14:20.000+0000',
      'endTime': '2020-05-24T16:14:21.000+0000',
      'exitMessage': null,
      'arguments': ['--spring.cloud.task.parent-execution-id=3', '--spring.cloud.data.flow.platformname=default', '--spring.cloud.task.executionid=6'],
      'jobExecutionIds': [],
      'errorMessage': 'java.lang.IllegalStateException: Failed to execute CommandLineRunner\n\tat org.springframework.boot.SpringApplication.callRunner(SpringApplication.java:784)\n\tat org.springframework.boot.SpringApplication.callRunners(SpringApplication.java:765)\n\tat org.springframework.boot.SpringApplication.run(SpringApplication.java:319)\n\tat org.springframework.boot.SpringApplication.run(SpringApplication.java:1215)\n\tat org.springframework.boot.SpringApplication.run(SpringApplication.java:1204)\n\tat org.springframework.cloud.task.app.timestamp.batch.TimestampBatchTaskApplication.main(TimestampBatchTaskApplication.java:29)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat org.springframework.boot.loader.MainMethodRunner.run(MainMethodRunner.java:48)\n\tat org.springframework.boot.loader.Launcher.launch(Launcher.java:87)\n\tat org.springframework.boot.loader.Launcher.launch(Launcher.java:51)\n\tat org.springframework.boot.loader.JarLauncher.main(JarLauncher.java:52)\nCaused by: org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException: A job instance already exists and is complete for parameters={-spring.cloud.task.parent-execution-id=3, -spring.cloud.data.flow.platformname=default, -spring.cloud.task.executionid=6}.  If you want to run this job again, change the parameters.\n\tat org.springframework.batch.core.repository.support.SimpleJobRepository.createJobExecution(SimpleJobRepository.java:132)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat org.springframework.aop.support.AopUtils.invokeJoinpointUsingReflection(AopUtils.java:343)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.invokeJoinpoint(ReflectiveMethodInvocation.java:198)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:163)\n\tat org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:295)\n\tat org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.ja',
      'externalExecutionId': 'tuu-app2-4e37c782-4ab6-4fe9-8174-0d2bf4c14d53',
      'parentExecutionId': 3,
      'resourceUrl': 'org.springframework.cloud.task.app:timestamp-batch-task:jar:2.1.1.RELEASE',
      'appProperties': {
        'spring.datasource.username': '******',
        'spring.cloud.task.name': 'tuu-app2',
        'spring.datasource.url': '******',
        'spring.datasource.driverClassName': 'org.mariadb.jdbc.Driver',
        'spring.datasource.password': '******'
      },
      'deploymentProperties': {},
      'taskExecutionStatus': 'ERROR',
      '_links': { 'self': { 'href': 'http://localhost:4200/tasks/executions/6' } }
    }, {
      'executionId': 5,
      'exitCode': 1,
      'taskName': 'tuu-app3',
      'startTime': '2020-05-24T16:14:21.000+0000',
      'endTime': '2020-05-24T16:14:21.000+0000',
      'exitMessage': null,
      'arguments': ['--spring.cloud.task.parent-execution-id=3', '--spring.cloud.data.flow.platformname=default', '--spring.cloud.task.executionid=5'],
      'jobExecutionIds': [],
      'errorMessage': 'java.lang.IllegalStateException: Failed to execute CommandLineRunner\n\tat org.springframework.boot.SpringApplication.callRunner(SpringApplication.java:784)\n\tat org.springframework.boot.SpringApplication.callRunners(SpringApplication.java:765)\n\tat org.springframework.boot.SpringApplication.run(SpringApplication.java:319)\n\tat org.springframework.boot.SpringApplication.run(SpringApplication.java:1215)\n\tat org.springframework.boot.SpringApplication.run(SpringApplication.java:1204)\n\tat org.springframework.cloud.task.app.timestamp.batch.TimestampBatchTaskApplication.main(TimestampBatchTaskApplication.java:29)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat org.springframework.boot.loader.MainMethodRunner.run(MainMethodRunner.java:48)\n\tat org.springframework.boot.loader.Launcher.launch(Launcher.java:87)\n\tat org.springframework.boot.loader.Launcher.launch(Launcher.java:51)\n\tat org.springframework.boot.loader.JarLauncher.main(JarLauncher.java:52)\nCaused by: org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException: A job instance already exists and is complete for parameters={-spring.cloud.task.parent-execution-id=3, -spring.cloud.data.flow.platformname=default, -spring.cloud.task.executionid=5}.  If you want to run this job again, change the parameters.\n\tat org.springframework.batch.core.repository.support.SimpleJobRepository.createJobExecution(SimpleJobRepository.java:132)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat org.springframework.aop.support.AopUtils.invokeJoinpointUsingReflection(AopUtils.java:343)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.invokeJoinpoint(ReflectiveMethodInvocation.java:198)\n\tat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:163)\n\tat org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:295)\n\tat org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.ja',
      'externalExecutionId': 'tuu-app3-0c326932-a54c-4a8f-886a-e1ba8654e889',
      'parentExecutionId': 3,
      'resourceUrl': 'org.springframework.cloud.task.app:timestamp-batch-task:jar:2.1.1.RELEASE',
      'appProperties': {
        'spring.datasource.username': '******',
        'spring.cloud.task.name': 'tuu-app3',
        'spring.datasource.url': '******',
        'spring.datasource.driverClassName': 'org.mariadb.jdbc.Driver',
        'spring.datasource.password': '******'
      },
      'deploymentProperties': {},
      'taskExecutionStatus': 'ERROR',
      '_links': { 'self': { 'href': 'http://localhost:4200/tasks/executions/5' } }
    }, {
      'executionId': 4,
      'exitCode': 0,
      'taskName': 'tuu-app1',
      'startTime': '2020-05-24T16:14:08.000+0000',
      'endTime': '2020-05-24T16:14:08.000+0000',
      'exitMessage': null,
      'arguments': ['--spring.cloud.task.parent-execution-id=3', '--spring.cloud.data.flow.platformname=default', '--spring.cloud.task.executionid=4'],
      'jobExecutionIds': [],
      'errorMessage': null,
      'externalExecutionId': 'tuu-app1-3a4c769e-36cf-4012-a7a3-5262b51ed23b',
      'parentExecutionId': 3,
      'resourceUrl': 'org.springframework.cloud.task.app:timestamp-task:jar:2.1.1.RELEASE',
      'appProperties': {
        'spring.datasource.username': '******',
        'spring.cloud.task.name': 'tuu-app1',
        'spring.datasource.url': '******',
        'spring.datasource.driverClassName': 'org.mariadb.jdbc.Driver',
        'spring.datasource.password': '******'
      },
      'deploymentProperties': {},
      'taskExecutionStatus': 'COMPLETE',
      '_links': { 'self': { 'href': 'http://localhost:4200/tasks/executions/4' } }
    }, {
      'executionId': 3,
      'exitCode': 0,
      'taskName': 'tuu',
      'startTime': '2020-05-24T16:13:59.000+0000',
      'endTime': '2020-05-24T16:14:30.000+0000',
      'exitMessage': null,
      'arguments': ['--spring.cloud.data.flow.platformname=default', '--spring.cloud.task.executionid=3', '--spring.cloud.data.flow.taskappname=composed-task-runner'],
      'jobExecutionIds': [3],
      'errorMessage': null,
      'externalExecutionId': 'tuu-cf28d054-ddfb-4606-b466-8c7d7497df7f',
      'parentExecutionId': null,
      'resourceUrl': 'org.springframework.cloud.task.app:composedtaskrunner-task:jar:2.1.4.RELEASE',
      'appProperties': {
        'spring.datasource.username': '******',
        'spring.datasource.url': '******',
        'spring.datasource.driverClassName': 'org.mariadb.jdbc.Driver',
        'spring.cloud.task.name': 'tuu',
        'graph': 'tuu-app1 && <tuu-app2 || tuu-app3>',
        'spring.datasource.password': '******'
      },
      'deploymentProperties': {},
      'taskExecutionStatus': 'COMPLETE',
      '_links': { 'self': { 'href': 'http://localhost:4200/tasks/executions/3' } }
    }, {
      'executionId': 2,
      'exitCode': 0,
      'taskName': 'bar',
      'startTime': '2020-05-24T16:13:24.000+0000',
      'endTime': '2020-05-24T16:13:24.000+0000',
      'exitMessage': null,
      'arguments': ['--spring.cloud.data.flow.platformname=default', '--spring.cloud.task.executionid=2'],
      'jobExecutionIds': [1, 2],
      'errorMessage': null,
      'externalExecutionId': 'bar-44401697-94cd-465b-96af-58ddba60aa6f',
      'parentExecutionId': null,
      'resourceUrl': 'org.springframework.cloud.task.app:timestamp-batch-task:jar:2.1.1.RELEASE',
      'appProperties': {
        'spring.datasource.username': '******',
        'spring.cloud.task.name': 'bar',
        'spring.datasource.url': '******',
        'spring.datasource.driverClassName': 'org.mariadb.jdbc.Driver',
        'spring.datasource.password': '******'
      },
      'deploymentProperties': {},
      'taskExecutionStatus': 'COMPLETE',
      '_links': { 'self': { 'href': 'http://localhost:4200/tasks/executions/2' } }
    }, {
      'executionId': 1,
      'exitCode': 0,
      'taskName': 'foo',
      'startTime': '2020-05-24T16:12:53.000+0000',
      'endTime': '2020-05-24T16:12:53.000+0000',
      'exitMessage': null,
      'arguments': ['--spring.cloud.data.flow.platformname=default', '--spring.cloud.task.executionid=1'],
      'jobExecutionIds': [],
      'errorMessage': null,
      'externalExecutionId': 'foo-de7b376d-18c0-4311-94b8-943209c1e0be',
      'parentExecutionId': null,
      'resourceUrl': 'org.springframework.cloud.task.app:timestamp-task:jar:2.1.1.RELEASE',
      'appProperties': {
        'spring.datasource.username': '******',
        'spring.cloud.task.name': 'foo',
        'spring.datasource.url': '******',
        'spring.datasource.driverClassName': 'org.mariadb.jdbc.Driver',
        'spring.datasource.password': '******'
      },
      'deploymentProperties': {},
      'taskExecutionStatus': 'COMPLETE',
      '_links': { 'self': { 'href': 'http://localhost:4200/tasks/executions/1' } }
    }]
  },
  '_links': { 'self': { 'href': 'http://localhost:4200/tasks/executions?page=0&size=20&sort=TASK_EXECUTION_ID,desc' } },
  'page': { 'size': 20, 'totalElements': 6, 'totalPages': 1, 'number': 0 }
};

export const GET_EXECUTION = {
  'executionId': 1,
  'exitCode': 0,
  'taskName': 'foo',
  'startTime': '2020-05-24T16:12:53.000+0000',
  'endTime': '2020-05-24T16:12:53.000+0000',
  'exitMessage': null,
  'arguments': ['--spring.cloud.data.flow.platformname=default', '--spring.cloud.task.executionid=1'],
  'jobExecutionIds': [],
  'errorMessage': null,
  'externalExecutionId': 'foo-de7b376d-18c0-4311-94b8-943209c1e0be',
  'parentExecutionId': null,
  'resourceUrl': 'org.springframework.cloud.task.app:timestamp-task:jar:2.1.1.RELEASE',
  'appProperties': {
    'spring.datasource.username': '******',
    'spring.cloud.task.name': 'foo',
    'spring.datasource.url': '******',
    'spring.datasource.driverClassName': 'org.mariadb.jdbc.Driver',
    'spring.datasource.password': '******'
  },
  'deploymentProperties': {},
  'taskExecutionStatus': 'COMPLETE',
  '_links': { 'self': { 'href': 'http://localhost:4200/tasks/executions/1' } }
};

