export interface Identity {
  id?: number;
  type: string;
}

export default class Node {
  identity: Identity[];
  connections: Set<Node>;

  /**
   * Create a new node
   *
   * @param {String} [type]
   * @param {Number} [id]
   */
  constructor(type: string = "TILE", id?: number) {
    this.identity = [{ id, type }];
    this.connections = new Set();
  }

  /**
   * Check if this node has identity of specified type (and maybe id)
   * This is needed to find a node with specified type/id in graph
   *
   * @param {Object} matcher
   * @returns {Boolean}
   */
  is(identity: Identity): boolean {
    const { type, id } = identity;

    return (
      this.identity.find(i => i.type === type && (id ? i.id === id : true)) !==
      undefined
    );
  }

  /**
   * Add provided identities to identity of this node
   *
   * @param {Object[]} identities
   * @returns {Node}
   */
  identifyAs(identities: Identity[]): Node {
    for (const identity of identities)
      if (!this.is(identity)) this.identity.push(identity);

    return this;
  }

  /**
   * Add connections between this and other node
   *
   * @param {Node} node
   * @returns {Node}
   */
  linkWith(node: Node): Node {
    if (node === this) return this;

    this.connections.add(node);
    node.connections.add(this);

    return this;
  }

  /**
   * Remove connections between this and other node
   *
   * @param {Node} node
   * @returns {Node}
   */
  unlinkFrom(node: Node): Node {
    if (node === this) return this;

    this.connections.delete(node);
    node.connections.delete(this);
  }

  /**
   * Replaces all connections to this node with connections to provided target
   *
   * @param {Node} target
   * @returns {Node}
   */
  replaceWith(target: Node): Node {
    if (target === this) return this;

    for (const node of this.connections) {
      this.unlinkFrom(node);
      target.linkWith(node);
    }

    return target.identifyAs(this.identity);
  }
}
