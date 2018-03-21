import {ListParams} from '../../shared/components/shared.interface';

export interface StreamListParams extends ListParams {
  q: string;
  page: number;
  size: number;
  sort: string;
  order: string;
}
