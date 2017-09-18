/**
 * Represents a StreamMetrics.
 *
 * @author Alex Boyko
 */
export interface StreamMetrics {
  readonly name: string;
  readonly applications: Application[];
}

export interface Application {
  readonly name: string;
  readonly instances: Instance[];
  readonly aggregateMetrics: Metric[];
}

export interface Metric {
  readonly name: string;
  readonly value: any;
}

export interface Instance {
  readonly guid: string;
  readonly index: number;
  readonly properties: Map<string, any>;
  readonly metrics: Metric[];
}
