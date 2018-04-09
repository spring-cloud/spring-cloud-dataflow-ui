import { ListParams } from '../../shared/components/shared.interface';

export interface TaskListParams extends ListParams {
  q: string;
  page: number;
  size: number;
  sort: string;
  order: string;
}

export interface TaskLaunchParams {
  name: string;
  args?: string;
  props?: string;
}

export interface TaskCreateParams {
  definition: string;
  name: string;
}
