import Node from "./node";
import { buildGraph, findRoutes } from "./graph";

it("flattens all nodes into single graph", () => {
  const graph = buildGraph([
    [matrix([1, 0], [1, 2], [2, 1]), matrix([1, 2], [2, 1])]
  ]);

  expect(graph.length).toEqual(5);
});

it("replaces nodes in overlapping positions", () => {
  const graph = buildGraph([
    [matrix(), matrix([2, 1])],
    [matrix([1, 2]), matrix([0, 1], [1, 0], [1, 2], [2, 1]), matrix([1, 0])],
    [matrix(), matrix([0, 1])]
  ]);

  expect(graph.length).toEqual(4);
});

it("merges connections from one node to another", () => {
  const b = link(matrix([1, 0], [1, 2]));
  const a = link(matrix([1, 2], [2, 1]));

  const graph = buildGraph([[a, b]]);

  expect(graph.length).toEqual(3);
  expect(graph[0].connections).toContain(graph[1]);
  expect(graph[0].connections).toContain(graph[2]);
});

it("finds a route between graph nodes", () => {
  const a = link(matrix("A", [1, 0], [1, 2]));
  const b = link(matrix("B", [1, 0], [1, 2]));
  const c = link(matrix("C", [1, 0], [1, 2]));

  const graph = buildGraph([[a, b, c]]);

  const start = graph.find(n => n.is({ id: "A0" }));
  const end = graph.find(n => n.is({ id: "C1" }));

  const routes = findRoutes(start, end);

  expect(routes).toHaveLength(1);
  expect(routes[0]).toEqual(
    expect.arrayContaining([start, a[1][2], b[1][2], end])
  );
});

/*       a    b    c
  -->  * -- * -\- * \
  Start          *    *  <--- Finish
                 \ * /
                d    e
  */
it("finds all routes between graph nodes", () => {
  const a = link(matrix("A", [1, 0], [1, 2]));
  const b = link(
    matrix("B", [1, 0], [1, 2], [2, 1]),
    [[1, 0], [1, 2]],
    [[1, 0], [2, 1]]
  );
  const c = link(matrix("C", [1, 0], [2, 1]));
  const d = link(matrix("D", [0, 1], [1, 2]));
  const e = link(matrix("E", [0, 1], [1, 0]));

  const graph = buildGraph([[a, b, c], [null, d, e]]);

  const start = graph.find(n => n.is({ id: "A0" }));
  const end = graph.find(n => n.is({ id: "E0" }));

  const routes = findRoutes(start, end);

  expect(routes).toHaveLength(2);
  expect(routes[0]).toEqual(
    expect.arrayContaining([start, a[1][2], b[1][2], end])
  );
  expect(routes[0]).toEqual(
    expect.arrayContaining([start, a[1][2], b[1][2], end])
  );
});

/**
 * Create matrix with nodes at specified positions
 *
 * @param {String} [name]
 * @param  {...Number[]} nodes
 * @returns {Node[][]}
 */
function matrix(name, ...nodes) {
  if (Array.isArray(name)) {
    nodes = [name, ...nodes];
    name = "";
  }

  const matrix = [new Array(3), new Array(3), new Array(3)];

  let i = 0;
  for (const [x, y] of nodes) matrix[x][y] = new Node(null, `${name}${i++}`);

  return matrix;
}

/**
 * Create links between nodes in a matrix
 * If no links are provided, link all matrix nodes to each other
 *
 * @param {Node[][]} matrix
 * @param  {...Number[][]} links Each link is a tuple of coord arrays [[], []]
 */
function link(matrix, ...links) {
  if (links.length) {
    for (const [left, right] of links)
      matrix[left[0]][left[1]].linkWith(matrix[right[0]][right[1]]);
  } else {
    const nodes = matrix.reduce(
      (result, row) => [
        ...result,
        ...row.reduce((result, node) => (node ? [...result, node] : result), [])
      ],
      []
    );

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      for (let j = i + 1; j < nodes.length; j++) node.linkWith(nodes[j]);
    }
  }

  return matrix;
}
