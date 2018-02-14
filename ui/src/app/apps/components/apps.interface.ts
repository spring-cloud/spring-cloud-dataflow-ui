import {ApplicationType} from '../../shared/model/application-type';
import {ListParams} from '../../shared/components/shared.interface';

export interface BulkImportParams {
  force: boolean;
  properties: string[];
  uri: string;
}

export interface AppRegisterParams {
  name: string;
  type: ApplicationType;
  uri: string;
  metaDataUri?: string;
  force: boolean;
}

export interface AppListParams extends ListParams {
  q: string;
  type: ApplicationType;
  page: number;
  size: number;
  sort: string;
  order: string;
}
