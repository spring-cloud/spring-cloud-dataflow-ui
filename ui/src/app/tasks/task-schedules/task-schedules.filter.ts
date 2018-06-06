import { Pipe, PipeTransform } from '@angular/core';
import { TaskSchedule } from '../model/task-schedule';

/**
 * Filters the schedules by matching the schedule name or the related task definition name to the input
 * @author Damien Vitrac
 */
@Pipe({
  name: 'filterSchedules'
})
export class TaskSchedulesFilterPipe implements PipeTransform {

  /**
   * Transform
   * @param {TaskSchedule[]} items
   * @param {string} searchText
   * @returns {TaskSchedule[]}
   */
  transform(items: TaskSchedule[], searchText: string): TaskSchedule[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter((it: TaskSchedule) => {
      return it.taskName.toLowerCase().includes(searchText) || it.name.toLowerCase().includes(searchText);
    });
  }

}
