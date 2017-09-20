/**
 * Represents a StreamMetrics.
 *
 * @author Alex Boyko
 */

export namespace StreamMetrics {

  export const TYPE = 'spring.cloud.dataflow.stream.app.type';
  export const GUID = 'spring.cloud.application.guid';
  export const INSTANCE_COUNT = 'spring.cloud.stream.instanceCount';
  export const INPUT_CHANNEL_MEAN = 'integration.channel.input.send.mean';
  export const OUTPUT_CHANNEL_MEAN = 'integration.channel.output.send.mean';

  export interface Stream {
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
    readonly properties: {};
    readonly metrics: Metric[];
  }

}
