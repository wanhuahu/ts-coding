// Solution 1: Diameter of Binary Tree (Longest Path Between Any Two Nodes)
class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.left = (left === undefined ? null : left);
        this.right = (right === undefined ? null : right);
    }
}

function diameterOfBinaryTree(root: TreeNode | null): number {
    let diameter = 0;
    
    function dfs(node: TreeNode | null): number {
        if (!node) return 0;
        
        const left = dfs(node.left);
        const right = dfs(node.right);
        
        // Update the diameter if left + right is larger
        diameter = Math.max(diameter, left + right);
        
        // Return the maximum depth
        return Math.max(left, right) + 1;
    }
    
    dfs(root);
    return diameter;
}

// Example usage:
// const tree = new TreeNode(1, 
//     new TreeNode(2, new TreeNode(4), new TreeNode(3)));
// console.log(diameterOfBinaryTree(tree)); // Output: 2

// Solution 2: Maximum Depth (Longest Root-to-Leaf Path)
class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.left = (left === undefined ? null : left);
        this.right = (right === undefined ? null : right);
    }
}

function maxDepth(root: TreeNode | null): number {
    if (!root) return 0;
    
    const leftDepth = maxDepth(root.left);
    const rightDepth = maxDepth(root.right);
    
    return Math.max(leftDepth, rightDepth) + 1;
}

// Example usage:
// const tree = new TreeNode(3, 
//     new TreeNode(9), 
//     new TreeNode(20, new TreeNode(15), new TreeNode(7)))
// console.log(maxDepth(tree)); // Output: 3

// Solution 3: Longest Path with Node Values (If path needs to be returned)
class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.left = (left === undefined ? null : left);
        this.right = (right === undefined ? null : right);
    }
}

function longestPath(root: TreeNode | null): number[] {
    if (!root) return [];
    
    let longest: number[] = [];
    
    function dfs(node: TreeNode | null, currentPath: number[]): void {
        if (!node) return;
        
        currentPath.push(node.val);
        
        if (!node.left && !node.right) {
            if (currentPath.length > longest.length) {
                longest = [...currentPath];
            }
        }
        
        dfs(node.left, currentPath);
        dfs(node.right, currentPath);
        currentPath.pop();
    }
    
    dfs(root, []);
    return longest;
}

// Example usage:
// const tree = new TreeNode(1, 
//     new TreeNode(2, new TreeNode(4), new TreeNode(5)), 
//     new TreeNode(3))
// console.log(longestPath(tree)); // Output: [1, 2, 5] or [1, 2, 4] (both have length 3)
