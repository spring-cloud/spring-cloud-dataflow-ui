export const LOAD = {
  'featureInfo': {
    'analyticsEnabled': true,
    'streamsEnabled': true,
    'tasksEnabled': true,
    'schedulesEnabled': false,
    'grafanaEnabled': false
  },
  'versionInfo': {
    'implementation': {'name': 'spring-cloud-dataflow-server', 'version': '2.4.2.RELEASE'},
    'core': {'name': 'Spring Cloud Data Flow Core', 'version': '2.4.2.RELEASE'},
    'dashboard': {'name': 'Spring Cloud Dataflow UI', 'version': '2.4.2.RELEASE'},
    'shell': {
      'name': 'Spring Cloud Data Flow Shell',
      'version': '2.4.2.RELEASE',
      'url': 'https://repo.spring.io/libs-release/org/springframework/cloud/spring-cloud-dataflow-shell/2.4.2.RELEASE/spring-cloud-dataflow-shell-2.4.2.RELEASE.jar'
    }
  },
  'securityInfo': {'authenticationEnabled': false, 'authenticated': false, 'username': null, 'roles': []},
  'runtimeEnvironment': {
    'appDeployer': {
      'deployerImplementationVersion': '2.3.2.RELEASE',
      'deployerName': 'Spring Cloud Skipper Server',
      'deployerSpiVersion': '2.3.2.RELEASE',
      'javaVersion': '1.8.0_192',
      'platformApiVersion': '',
      'platformClientVersion': '',
      'platformHostVersion': '',
      'platformSpecificInfo': {'default': 'local'},
      'platformType': 'Skipper Managed',
      'springBootVersion': '2.2.5.RELEASE',
      'springVersion': '5.2.4.RELEASE'
    },
    'taskLaunchers': [{
      'deployerImplementationVersion': '2.2.2.RELEASE',
      'deployerName': 'LocalTaskLauncher',
      'deployerSpiVersion': '2.2.2.RELEASE',
      'javaVersion': '1.8.0_192',
      'platformApiVersion': 'Linux 4.19.76-linuxkit',
      'platformClientVersion': '4.19.76-linuxkit',
      'platformHostVersion': '4.19.76-linuxkit',
      'platformSpecificInfo': {},
      'platformType': 'Local',
      'springBootVersion': '2.2.5.RELEASE',
      'springVersion': '5.2.4.RELEASE'
    }]
  },
  'grafanaInfo': {'url': '', 'refreshInterval': 15},
  '_links': {'self': {'href': 'http://localhost:4200/about'}}
}
