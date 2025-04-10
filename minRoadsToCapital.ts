function minRoadsToCapital(
 city_nodes: number,
 city_edges: number,
 city_from: number[],
 city_to: number[],
 c: number
): number {
 // Build the adjacency list for the graph
 const adj: number[][] = Array.from({ length: city_nodes + 1 }, () => []);
 for (let i = 0; i < city_edges; i++) {
     const from = city_from[i];
     const to = city_to[i];
     adj[from].push(to);
 }


 // Step 1: Perform DFS to find all nodes reachable from the capital
 const visited: boolean[] = new Array(city_nodes + 1).fill(false);
 const stack: number[] = [];
 let reachableCount = 0;


 function dfs(u: number) {
     visited[u] = true;
     reachableCount++;
     for (const v of adj[u]) {
         if (!visited[v]) {
             dfs(v);
         }
     }
 }


 dfs(c);
  // If all nodes are reachable, no roads needed
 if (reachableCount === city_nodes) {
     return 0;
 }


 // Step 2: Implement Kosaraju's algorithm to find SCCs
 // First pass: fill the stack in order of finishing times
 const visited1: boolean[] = new Array(city_nodes + 1).fill(false);
 const order: number[] = [];


 function dfs1(u: number) {
     visited1[u] = true;
     for (const v of adj[u]) {
         if (!visited1[v]) {
             dfs1(v);
         }
     }
     order.push(u);
 }


 for (let u = 1; u <= city_nodes; u++) {
     if (!visited1[u]) {
         dfs1(u);
     }
 }


 // Build the reversed graph
 const reversedAdj: number[][] = Array.from({ length: city_nodes + 1 }, () => []);
 for (let u = 1; u <= city_nodes; u++) {
     for (const v of adj[u]) {
         reversedAdj[v].push(u);
     }
 }


 // Second pass: process nodes in reverse order of finishing times
 const visited2: boolean[] = new Array(city_nodes + 1).fill(false);
 const component: number[] = new Array(city_nodes + 1).fill(0);
 let currentComponent = 0;


 function dfs2(u: number) {
     visited2[u] = true;
     component[u] = currentComponent;
     for (const v of reversedAdj[u]) {
         if (!visited2[v]) {
             dfs2(v);
         }
     }
 }


 while (order.length > 0) {
     const u = order.pop()!;
     if (!visited2[u]) {
         dfs2(u);
         currentComponent++;
     }
 }


 // Step 3: Build the condensation DAG and count roots
 const inDegree: number[] = new Array(currentComponent).fill(0);
 const componentAdj: Set<number>[] = Array.from({ length: currentComponent }, () => new Set());


 for (let u = 1; u <= city_nodes; u++) {
     for (const v of adj[u]) {
         if (component[u] !== component[v]) {
             componentAdj[component[u]].add(component[v]);
         }
     }
 }


 for (let u = 0; u < currentComponent; u++) {
     for (const v of componentAdj[u]) {
         inDegree[v]++;
     }
 }


 // Count components with in-degree 0, excluding the capital's component
 const capitalComponent = component[c];
 let roots = 0;
 for (let i = 0; i < currentComponent; i++) {
     if (inDegree[i] === 0 && i !== capitalComponent) {
         roots++;
     }
 }


 return roots;
}


// Example usage:
const city_nodes = 6;
const city_edges = 2;
const city_from = [4, 5];
const city_to = [1, 2];
const c = 6;


console.log(minRoadsToCapital(city_nodes, city_edges, city_from, city_to, c)); // Output should be 3 for the example
