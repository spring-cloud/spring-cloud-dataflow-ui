export const GET_RUNTIME = {
  '_embedded': {
    'streamStatusResourceList': [{
      'name': 'foo', 'applications': {
        '_embedded': {
          'appStatusResourceList': [{
            'deploymentId': 'foo.transform-v1',
            'state': 'deployed',
            'instances': {
              '_embedded': {
                'appInstanceStatusResourceList': [{
                  'instanceId': 'foo.transform-v1-0',
                  'state': 'deployed',
                  'attributes': {
                    'guid': '20053',
                    'pid': '96',
                    'port': '20053',
                    'skipper.application.name': 'transform',
                    'skipper.release.name': 'foo',
                    'skipper.release.version': '1',
                    'stderr': '/tmp/1590334432371/foo.transform-v1/stderr_0.log',
                    'stdout': '/tmp/1590334432371/foo.transform-v1/stdout_0.log',
                    'url': 'http://172.18.0.4:20053',
                    'working.dir': '/tmp/1590334432371/foo.transform-v1'
                  },
                  'guid': '20053',
                  '_links': { 'self': { 'href': 'http://localhost:4200/runtime/apps/foo.transform-v1/instances/foo.transform-v1-0' } }
                }]
              }
            },
            'name': 'transform',
            '_links': { 'self': { 'href': 'http://localhost:4200/runtime/apps/foo.transform-v1' } }
          }, {
            'deploymentId': 'foo.file-v1',
            'state': 'deployed',
            'instances': {
              '_embedded': {
                'appInstanceStatusResourceList': [{
                  'instanceId': 'foo.file-v1-0',
                  'state': 'deployed',
                  'attributes': {
                    'guid': '20043',
                    'pid': '117',
                    'port': '20043',
                    'skipper.application.name': 'file',
                    'skipper.release.name': 'foo',
                    'skipper.release.version': '1',
                    'stderr': '/tmp/1590334441678/foo.file-v1/stderr_0.log',
                    'stdout': '/tmp/1590334441678/foo.file-v1/stdout_0.log',
                    'url': 'http://172.18.0.4:20043',
                    'working.dir': '/tmp/1590334441678/foo.file-v1'
                  },
                  'guid': '20043',
                  '_links': { 'self': { 'href': 'http://localhost:4200/runtime/apps/foo.file-v1/instances/foo.file-v1-0' } }
                }]
              }
            },
            'name': 'file',
            '_links': { 'self': { 'href': 'http://localhost:4200/runtime/apps/foo.file-v1' } }
          }, {
            'deploymentId': 'foo.log-v1',
            'state': 'deployed',
            'instances': {
              '_embedded': {
                'appInstanceStatusResourceList': [{
                  'instanceId': 'foo.log-v1-0',
                  'state': 'deployed',
                  'attributes': {
                    'guid': '20042',
                    'pid': '76',
                    'port': '20042',
                    'skipper.application.name': 'log',
                    'skipper.release.name': 'foo',
                    'skipper.release.version': '1',
                    'stderr': '/tmp/1590334422360/foo.log-v1/stderr_0.log',
                    'stdout': '/tmp/1590334422360/foo.log-v1/stdout_0.log',
                    'url': 'http://172.18.0.4:20042',
                    'working.dir': '/tmp/1590334422360/foo.log-v1'
                  },
                  'guid': '20042',
                  '_links': { 'self': { 'href': 'http://localhost:4200/runtime/apps/foo.log-v1/instances/foo.log-v1-0' } }
                }]
              }
            },
            'name': 'log',
            '_links': { 'self': { 'href': 'http://localhost:4200/runtime/apps/foo.log-v1' } }
          }]
        }
      }, 'version': '1', '_links': { 'self': { 'href': 'http://localhost:4200/runtime/streams/foo' } }
    }]
  },
  '_links': { 'self': { 'href': 'http://localhost:4200/runtime/streams?page=0&size=2000' } },
  'page': { 'size': 2000, 'totalElements': 1, 'totalPages': 1, 'number': 0 }
};
