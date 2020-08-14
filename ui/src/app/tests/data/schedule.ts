export const GET_SCHEDULES = {
  _embedded: {
    scheduleInfoResourceList: [
      {
        scheduleName: 'foo1',
        taskDefinitionName: 'bar1',
        platform: 'foo',
        scheduleProperties: { 'spring.cloud.scheduler.cron.expression': '0 0 0 * 8 1' },
        _links: {
          self: {
            href: 'http://localhost:4200/tasks/schedules/foo1'
          }
        }
      },
      {
        scheduleName: 'foo2',
        taskDefinitionName: 'bar2',
        platform: 'bar',
        scheduleProperties: { 'spring.cloud.scheduler.cron.expression': '0 0 0 * 8 1' },
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

export const GET_SCHEDULE = {
  scheduleName: 'foo1',
  taskDefinitionName: 'bar1',
  scheduleProperties: { 'spring.cloud.scheduler.cron.expression': '0 0 0 * 8 1' },
  platform: 'foo',
  _links: {
    self: {
      href: 'http://localhost:4200/tasks/schedules/foo1'
    }
  }
};
