/**
 * Generic response type returned from both tools conversions.
 */
export class TaskConversion {

  public graph: Graph;
  public dsl: string;
  public errors: Array<Map<string, any>> = new Array();

  constructor(dsl: string, errors?: Array<Map<string, any>>, graph?: Graph) {
    this.dsl = dsl;
    if (errors) {
      this.errors = errors;
    }
    this.graph = graph;
  }
}

/**
 * Represents a graph in a TaskConversion response.
 */
export class Graph {

  public nodes: Array<Node>;
  public links: Array<Link>;

  constructor(nodes: Array<Node>, links: Array<Link>) {
    this.nodes = nodes;
    this.links = links;
  }

  toJson(): string {
    return JSON.stringify(this);
  }
}

/**
 * Represents node in a Graph.
 */
export class Node {

  public id: string;
  public name: string;
  public properties: Map<string, string>;
  public metadata: Map<string, string>;

  constructor(id: string, name: string, properties?: Map<string, string>, metadata?: Map<string, string>) {
    this.id = id;
    this.name = name;
    this.properties = properties;
    this.metadata = metadata;
  }
}

/**
 * Represents link in a Graph.
 */
export class Link {

  public from: string;
  public to: string;
  public properties: Map<string, string>;

  constructor(from: string, to: string, properties?: Map<string, string>) {
    this.from = from;
    this.to = to;
    this.properties = properties;
  }
}
