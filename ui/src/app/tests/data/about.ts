export const LOAD = {
  'featureInfo': {
    'analyticsEnabled': true,
    'streamsEnabled': true,
    'tasksEnabled': true,
    'schedulesEnabled': false,
    'monitoringDashboardType': 'NONE'
  },
  'versionInfo': {
    'implementation': { 'name': 'spring-cloud-dataflow-server', 'version': '2.7.0-SNAPSHOT' },
    'core': { 'name': 'Spring Cloud Data Flow Core', 'version': '2.7.0-SNAPSHOT' },
    'dashboard': { 'name': 'Spring Cloud Dataflow UI', 'version': '3.0.0-SNAPSHOT' },
    'shell': {
      'name': 'Spring Cloud Data Flow Shell',
      'version': '2.7.0-SNAPSHOT',
      'url': 'https://repo1.maven.org/maven2/org/springframework/cloud/spring-cloud-dataflow-shell/2.7.0-SNAPSHOT/spring-cloud-dataflow-shell-2.7.0-SNAPSHOT.jar'
    }
  },
  'securityInfo': { 'authenticationEnabled': false, 'authenticated': false, 'username': null, 'roles': [] },
  'runtimeEnvironment': {
    'appDeployer': {
      'deployerImplementationVersion': '2.6.0-SNAPSHOT',
      'deployerName': 'Spring Cloud Skipper Server',
      'deployerSpiVersion': '2.6.0-SNAPSHOT',
      'javaVersion': '1.8.0_192',
      'platformApiVersion': '',
      'platformClientVersion': '',
      'platformHostVersion': '',
      'platformSpecificInfo': { 'default': 'local' },
      'platformType': 'Skipper Managed',
      'springBootVersion': '2.3.2.RELEASE',
      'springVersion': '5.2.8.RELEASE'
    },
    'taskLaunchers': [{
      'deployerImplementationVersion': '2.5.0-SNAPSHOT',
      'deployerName': 'LocalTaskLauncher',
      'deployerSpiVersion': '2.5.0-SNAPSHOT',
      'javaVersion': '1.8.0_192',
      'platformApiVersion': 'Linux 4.19.76-linuxkit',
      'platformClientVersion': '4.19.76-linuxkit',
      'platformHostVersion': '4.19.76-linuxkit',
      'platformSpecificInfo': {},
      'platformType': 'Local',
      'springBootVersion': '2.3.2.RELEASE',
      'springVersion': '5.2.8.RELEASE'
    }]
  },
  'monitoringDashboardInfo': {
    'url': 'https://vmware.wavefront.com',
    'refreshInterval': 15,
    'dashboardType': 'WAVEFRONT',
    'source': 'tzolov-08-09'
  },
  '_links': { 'self': { 'href': 'http://localhost:9393/about' } }
};
